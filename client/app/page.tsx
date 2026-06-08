import Link from "next/link";
import { ArrowRight, LayoutDashboard, BellRing, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// Static imports automatically handle Next.js image optimization and paths perfectly!
import crmLogo from "../public/crm-logo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src={crmLogo} alt="Flow CRM Logo" width={42} height={42} className="rounded" />
          <span className="text-xl font-bold tracking-tight">FlowCRM</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="rounded-full px-6 shadow-sm">
              Get Started Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Now with Automated Email Reminders
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Manage your clients. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
            Stay in the Flow.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The simple, visual CRM built for small businesses. Track your sales pipeline with a beautiful Kanban board and automate your follow-ups so no client ever falls through the cracks.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-md transition-transform hover:-translate-y-0.5">
              Start for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-card border-t border-border py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to close the deal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We stripped away the confusing corporate bloat to give you a CRM that feels lightweight, fast, and incredibly intuitive.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Pipeline</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag and drop your jobs across a customizable Kanban board. Always know exactly where every project stands at a single glance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <BellRing className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Reminders</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set it and forget it. Our background workers will automatically send you an email exactly when a client needs a follow-up.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Hub</h3>
              <p className="text-muted-foreground leading-relaxed">
                A centralized database to securely track every customer interaction, linked directly to your active jobs and pending reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-80">
            <Image src={crmLogo} alt="Flow CRM Logo" width={32} height={32} className="rounded" />
            <span className="text-lg font-semibold tracking-tight text-slate-300">FlowCRM</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} FlowCRM Inc. Built for small business.
          </p>
        </div>
      </footer>
    </div>
  );
}
