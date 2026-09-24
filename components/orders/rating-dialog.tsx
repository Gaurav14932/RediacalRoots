'use client'

import { submitOrderFeedback } from '@/app/orders/feedback-actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/lib/i18n/context'
import type { Feedback, Order } from '@/lib/types'
import { AlertCircle, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface RatingDialogProps {
  order: Order
  buyerName: string
  existingFeedback?: Feedback | null
}

export function RatingDialog({ order, buyerName, existingFeedback }: RatingDialogProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<number>(existingFeedback?.rating ?? 5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState<string>(existingFeedback?.comment ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, startTransition] = useTransition()

  const sellerId = order.lot?.farmer_id ?? 'usr-farmer-1'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating < 1 || rating > 5) {
      setError('Please select a valid star rating (1–5).')
      return
    }

    if (rating <= 2 && !comment.trim()) {
      setError(t.ratingDialog.requiredFeedbackWarning)
      return
    }

    startTransition(async () => {
      const res = await submitOrderFeedback({
        orderId: order.id,
        lotId: order.lot_id,
        buyerId: order.buyer_id,
        buyerName,
        sellerId,
        rating,
        comment: comment.trim(),
      })

      if (res.error) {
        setError(res.error)
        toast.error(res.error)
      } else {
        if (rating <= 2) {
          toast.warning(t.ratingDialog.flaggedWarningToast)
        } else {
          toast.success(t.ratingDialog.ratingSuccessToast)
        }
        setOpen(false)
        router.refresh()
      }
    })
  }

  if (existingFeedback) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t.orders.yourRatingLabel}</span>
        <div className="flex items-center text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < existingFeedback.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-amber-300 bg-amber-50/50 text-xs font-semibold text-amber-800 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
          >
            <Star className="size-3.5 fill-amber-400 text-amber-500" />
            {t.orders.rateOrderBtn}
          </Button>
        }
      />

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{t.ratingDialog.dialogTitle}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t.ratingDialog.dialogDesc}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Star selector */}
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-muted/20 py-4">
            <span className="text-xs text-muted-foreground font-medium">{t.ratingDialog.rateCropQuality}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => {
                    setRating(star)
                    setError(null)
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`size-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-foreground">
              {rating} / 5
            </span>
          </div>

          {rating <= 2 && (
            <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>
                {t.ratingDialog.requiredFeedbackWarning}
              </span>
            </div>
          )}

          {/* Comment */}
          <div className="grid gap-1.5">
            <Label htmlFor="comment" className="text-xs font-semibold">
              {t.ratingDialog.rateCropQuality} {rating <= 2 && <span className="text-rose-600">*</span>}
            </Label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                setError(null)
              }}
              placeholder={t.ratingDialog.feedbackPlaceholder}
              className={`w-full rounded-md border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 ${
                error && rating <= 2 && !comment.trim()
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border/80 focus:ring-primary'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? t.ratingDialog.submittingBtn : t.ratingDialog.submitRatingBtn}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
