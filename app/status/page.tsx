import { SiteHeader } from '@/components/site-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, Database, Globe, Image as ImageIcon, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'System & Architecture Status | RadicalRoots Internal',
  description: 'Internal engineering architecture notes and production-readiness flags',
}

export default function StatusPage() {
  const flags = [
    {
      id: 'photos',
      title: '(a) Crop Photos Storage',
      status: 'Simulated (In-Memory)',
      type: 'mock',
      icon: ImageIcon,
      hackathonCurrent: 'Stored as in-memory browser Object URLs (URL.createObjectURL) during session. Not persisted to cloud buckets.',
      productionPlan: 'Direct multipart upload to Supabase Storage / S3 with signed URLs, WebP compression, and durable CDN delivery.',
    },
    {
      id: 'mandi',
      title: '(b) Mandi APMC Price Feeds',
      status: 'Simulated (Realistic Mock)',
      type: 'mock',
      icon: Database,
      hackathonCurrent: 'Realistic synthetic APMC benchmark dataset calibrated to Maharashtra seasonal wholesale arrival curves.',
      productionPlan: 'Automated daily cron sync ingesting official Ministry of Agriculture / Agmarknet terminal market API feeds.',
    },
    {
      id: 'geocoding',
      title: '(c) Geolocation & Reverse Geocoding',
      status: 'External API (No Offline Fallback)',
      type: 'mock',
      icon: Globe,
      hackathonCurrent: 'OpenStreetMap Nominatim reverse geocoding with manual text input fallback. Requires active connectivity.',
      productionPlan: 'Offline-first hybrid gazetteer with local Pincode/Tehsil database in IndexedDB for low-connectivity farm regions.',
    },
    {
      id: 'auth-security',
      title: 'Role-Based Access & Security Gating',
      status: 'Production-Ready',
      type: 'ready',
      icon: ShieldCheck,
      hackathonCurrent: 'Full server-side middleware and route gating for all 6 roles. Demo Persona Switcher strictly isolated to demo users.',
      productionPlan: 'Complete and hardened.',
    },
    {
      id: 'pii-protection',
      title: 'Buyer PII & Order Privacy',
      status: 'Production-Ready',
      type: 'ready',
      icon: ShieldCheck,
      hackathonCurrent: 'Server-side data sanitization on /marketplace/[id]: Buyer identities redacted to "Verified Buyer" for third-party viewers.',
      productionPlan: 'Complete and hardened.',
    },
    {
      id: 'multilingual',
      title: 'Full Multilingual i18n (EN/HI/MR)',
      status: 'Production-Ready',
      type: 'ready',
      icon: CheckCircle2,
      hackathonCurrent: '100% full-page coverage across English, Hindi, and Marathi with persistent cookies/localStorage and runtime dev warnings.',
      productionPlan: 'Complete and hardened.',
    },
  ]

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/30">
              Internal Technical Briefing
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System & Architecture Status
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Engineering reference outlining real production features vs. intentionally simulated hackathon integrations for technical Q&amp;A.
          </p>
        </div>

        <div className="grid gap-5">
          {flags.map((flag) => (
            <Card key={flag.id} className="border-border/60">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${flag.type === 'ready' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                      <flag.icon className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {flag.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge className={`text-xs ${flag.type === 'ready' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                    {flag.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-2 text-xs">
                <div className="rounded-md bg-muted/40 p-3 border border-border/40">
                  <span className="font-semibold text-foreground">Current Hackathon Implementation: </span>
                  <span className="text-muted-foreground">{flag.hackathonCurrent}</span>
                </div>
                <div className="rounded-md bg-background p-3 border border-border/40">
                  <span className="font-semibold text-foreground">Production Target: </span>
                  <span className="text-muted-foreground">{flag.productionPlan}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
