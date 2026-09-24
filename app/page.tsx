import { SiteHeader } from '@/components/site-header'
import { LandingContent } from '@/components/landing/landing-content'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <LandingContent />
    </div>
  )
}
