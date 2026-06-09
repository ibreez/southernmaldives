import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen section-navy flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,150,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 space-y-8 max-w-md">
        <div>
          <p className="font-serif italic text-8xl font-bold text-gradient-brand leading-none">404</p>
          <h1 className="font-serif text-3xl font-bold text-white mt-4 mb-3">Page Not Found</h1>
          <p className="text-slate-400 text-lg font-light">
            This page seems to have drifted out to sea. Let's get you back to shore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 hover:scale-105 transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="rounded-full border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white px-8 transition-all duration-200"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
