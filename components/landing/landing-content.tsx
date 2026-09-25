'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import {
  BadgeIndianRupee,
  Handshake,
  Leaf,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function LandingContent() {
  const { t } = useI18n()

  const steps = [
    {
      icon: Leaf,
      title: t.landing.step1Title,
      description: t.landing.step1Desc,
    },
    {
      icon: ShieldCheck,
      title: t.landing.step2Title,
      description: t.landing.step2Desc,
    },
    {
      icon: Handshake,
      title: t.landing.step3Title,
      description: t.landing.step3Desc,
    },
    {
      icon: Truck,
      title: t.landing.step4Title,
      description: t.landing.step4Desc,
    },
  ]

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-farm.png"
            alt="Agricultural field at sunrise"
            fill
            className="object-cover opacity-15 dark:opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
            <Leaf className="size-4" />
            {t.landing.taglineBadge}
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t.landing.heroHeading}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t.landing.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/marketplace" />}>
              {t.landing.browseMarketplace}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/auth/sign-up" />}
            >
              {t.landing.listYourCrop}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold text-foreground">
            {t.landing.howItWorksHeading}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.landing.howItWorksSubtitle}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title} className="border-border/60">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
          <BadgeIndianRupee className="size-8 text-primary" />
          <h2 className="max-w-lg text-2xl font-semibold text-foreground">
            {t.landing.ctaHeading}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/auth/sign-up" />}>
              {t.landing.createAccount}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/marketplace" />}
            >
              {t.landing.exploreListings}
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-primary" />
            <span>RadicalRoots</span>
          </div>
          <p>{t.landing.footerTagline}</p>
        </div>
      </footer>
    </main>
  )
}
