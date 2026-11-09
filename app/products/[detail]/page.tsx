import { JEWELRY_ITEMS } from "@/lib/db";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
} from "@boxicons/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

// 1. Tell Next.js all valid product routes to prerender at build time
export async function generateStaticParams() {
  return JEWELRY_ITEMS.flatMap((item) => [
    { detail: item.id.toString() },
    { detail: item.title },
  ]);
}

function safeDecode(val: string): string {
  let decoded = val;
  try {
    while (decoded.includes("%")) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return val;
  }
  return decoded;
}

const Details = async ({ params }: { params: Promise<{ detail: string }> }) => {
  const resolvedParams = await params;
  const rawDetail = safeDecode(resolvedParams.detail);

  const product = JEWELRY_ITEMS.find(
    (item) =>
      item.id.toString() === rawDetail ||
      item.title.toLowerCase() === rawDetail.toLowerCase(),
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 lg:px-16 py-8 flex flex-col items-center">
      {/* Navigation / Breadcrumb */}
      <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-base-content/60 hover:text-primary transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>
        <span className="text-xs uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          In Stock • Ready to Ship
        </span>
      </div>

      {/* Main Luxury Showcase Layout */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16">
        {/* Left Column: Media Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative group w-full aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
            <img
              src={product.thumbUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            <div className="absolute top-6 right-6">
              <button
                aria-label="Add to wishlist"
                className="p-3.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all shadow-xl"
              >
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="text-xs font-mono tracking-widest uppercase text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                {product.category}
              </span>
              <span className="text-xs font-mono tracking-widest text-primary bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/30">
                Authentic Certified
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Intelligence & Acquisition */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-primary">
                {product.subtitle || "Artisan Craft"}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono tracking-wider text-base-content/50">
                REF: #{product.id.toString().padStart(4, "0")}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-light text-amber-50 tracking-wide leading-tight">
              {product.title}
            </h1>

            <p className="text-3xl font-serif text-primary font-medium pt-2">
              {product.price}
            </p>
          </div>

          <p className="text-sm text-base-content/75 leading-relaxed font-light border-t border-b border-white/10 py-5">
            {product.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-base-content/40 block">
                Primary Gemstone
              </span>
              <p className="text-sm font-medium text-amber-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> {product.gemstone}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-base-content/40 block">
                Craft Metal
              </span>
              <p className="text-sm font-medium text-amber-100">
                {product.metal}
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3 pt-2">
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary/80 via-primary to-primary/90 text-black font-semibold text-sm tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5" /> Acquire Piece
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-white/10">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-primary/70" />
              <span className="text-[10px] text-base-content/60 uppercase tracking-wider">
                Insured Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-5 h-5 text-primary/70" />
              <span className="text-[10px] text-base-content/60 uppercase tracking-wider">
                Lifetime Warranty
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="w-5 h-5 text-primary/70" />
              <span className="text-[10px] text-base-content/60 uppercase tracking-wider">
                Certificate Incl.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Details;
