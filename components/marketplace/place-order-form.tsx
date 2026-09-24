'use client'

import { placeOrder } from '@/app/marketplace/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatINR } from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { AlertCircle, AlertTriangle, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function PlaceOrderForm({
  lotId,
  unit,
  priceExpected,
  maxQuantity,
  isSignedIn,
  isOwnLot,
}: {
  lotId: string
  unit: string
  priceExpected: number
  maxQuantity: number
  isSignedIn: boolean
  isOwnLot: boolean
}) {
  const { t } = useI18n()
  const [quantity, setQuantity] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'upi' | 'mandi'>('escrow')
  const [simulateDecline, setSimulateDecline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const parsedQuantity = Number.parseFloat(quantity)
  const total = Number.isFinite(parsedQuantity) && parsedQuantity > 0
    ? parsedQuantity * priceExpected
    : 0

  const handleQuantityChange = (val: string) => {
    setQuantity(val)
    setFieldError(null)
    setPaymentError(null)

    if (!val.trim()) {
      return
    }

    const n = Number.parseFloat(val)
    if (isNaN(n) || n <= 0) {
      setFieldError(t.orderForm.invalidQuantityError)
    } else if (n > maxQuantity) {
      setFieldError(`${t.orderForm.exceedsStockError} (${maxQuantity} ${unit})`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSignedIn) {
      router.push('/auth/login?redirect=/marketplace')
      return
    }

    // Explicit Form Validation
    const n = Number.parseFloat(quantity)
    if (isNaN(n) || !quantity.trim() || n <= 0) {
      setFieldError(t.orderForm.invalidQuantityError)
      return
    }
    if (n > maxQuantity) {
      setFieldError(`${t.orderForm.exceedsStockError} (${maxQuantity} ${unit})`)
      return
    }

    setFieldError(null)
    setPaymentError(null)
    setIsLoading(true)

    // Mock Payment Flow simulation
    await new Promise((res) => setTimeout(res, 600))

    if (simulateDecline) {
      setIsLoading(false)
      setPaymentError(t.orderForm.paymentDeclinedError)
      toast.error('Payment authorization failed')
      return
    }

    const result = await placeOrder({
      lotId,
      quantity: n,
      priceAgreed: priceExpected,
    })
    setIsLoading(false)

    if (result.error) {
      setPaymentError(result.error)
      toast.error(result.error)
      return
    }

    toast.success(t.orderForm.orderSuccessToast)
    setQuantity('')
    router.refresh()
  }

  if (isOwnLot) {
    return (
      <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        {t.orderForm.ownListingNotice}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Quantity Input with inline validation */}
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="order-quantity" className="text-xs font-semibold">
            {t.orderForm.quantityLabel} ({unit})
          </Label>
          <span className="text-[11px] text-muted-foreground">
            {t.orderForm.availableLabel}: {maxQuantity} {unit}
          </span>
        </div>
        <Input
          id="order-quantity"
          type="number"
          min="0.01"
          max={maxQuantity}
          step="0.01"
          required
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          placeholder={`${t.orderForm.enterQuantityPlaceholder} ${maxQuantity}`}
          className={`h-9 text-sm ${fieldError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        />
        {fieldError && (
          <p className="flex items-center gap-1 text-xs text-destructive mt-0.5">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{fieldError}</span>
          </p>
        )}
      </div>

      {/* Payment Method Selector */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold">{t.orderForm.securePaymentMethod}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('escrow')}
            className={`flex flex-col items-start p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
              paymentMethod === 'escrow'
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border/80 hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            <span className="font-semibold flex items-center gap-1 text-foreground">
              <ShieldCheck className="size-3.5 text-primary" /> {t.orderForm.radicalEscrow}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{t.orderForm.escrowDesc}</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`flex flex-col items-start p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
              paymentMethod === 'upi'
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border/80 hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            <span className="font-semibold flex items-center gap-1 text-foreground">
              <CreditCard className="size-3.5 text-primary" /> {t.orderForm.instantUpi}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{t.orderForm.upiDesc}</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('mandi')}
            className={`flex flex-col items-start p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
              paymentMethod === 'mandi'
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border/80 hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            <span className="font-semibold text-foreground">{t.orderForm.apmcMandi}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{t.orderForm.mandiDesc}</span>
          </button>
        </div>
      </div>

      {/* Mock Payment Decline Simulation Checkbox */}
      <div className="flex items-center gap-2 rounded-md border border-amber-200/80 bg-amber-50/50 p-2.5 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs">
        <input
          id="mock-decline"
          type="checkbox"
          checked={simulateDecline}
          onChange={(e) => {
            setSimulateDecline(e.target.checked)
            setPaymentError(null)
          }}
          className="size-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
        <Label htmlFor="mock-decline" className="text-xs text-amber-900 dark:text-amber-200 font-normal cursor-pointer">
          {t.orderForm.simulateDeclineLabel}
        </Label>
      </div>

      {/* Graceful Payment Error Banner */}
      {paymentError && (
        <div className="flex flex-col gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{paymentError}</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSimulateDecline(false)
                setPaymentError(null)
              }}
              className="h-7 text-xs border-destructive/40 hover:bg-destructive/10"
            >
              <RefreshCw className="size-3 mr-1" />
              {t.orderForm.resetTryAgainBtn}
            </Button>
          </div>
        </div>
      )}

      {/* Order Total */}
      <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
        <span className="text-muted-foreground">{t.orderForm.orderTotalLabel}</span>
        <span className="font-semibold text-foreground">
          {formatINR(total)}
        </span>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !quantity || !!fieldError}
        className="w-full"
      >
        {isLoading
          ? t.orderForm.authorizingBtn
          : isSignedIn
            ? t.orderForm.placeOrderBtn
            : t.orderForm.signInToOrderBtn}
      </Button>
    </form>
  )
}
