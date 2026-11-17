import { CompanyName, CompanySlogan } from "@/lib/constants";

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center max-w-sm">
        {/* Brand Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-widest uppercase">
            {CompanyName}
          </h1>
          <p className="font-great-vibes text-primary text-xl tracking-wide">
            {CompanySlogan}
          </p>
        </div>

        {/* Spinner & Loader Animation */}
        <div className="relative flex items-center justify-center pt-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute w-8 h-8 rounded-full border border-primary/40 border-b-primary animate-ping" />
        </div>

        <p className="text-xs uppercase font-mono tracking-widest text-base-content/50 pt-2 animate-pulse">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
}
