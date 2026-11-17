"use client";

import React from "react";
import Link from "next/link";
import Reveal from "@/components/reveal";
import EndFooter from "@/components/endFooter";
import { CompanyName, CompanySlogan } from "@/lib/constants";
import {
  ArrowRight,
  CheckCircle,
  Diamond,
  Heart,
  ShieldAlt2,
  Sparkles,
} from "@boxicons/react";

const PILLARS = [
  {
    Icon: Diamond,
    title: "Ethically Sourced Materials",
    description:
      "Every gemstone and precious metal is vetted for authenticity, brilliance, and lasting durability before it ever reaches our studio.",
  },
  {
    Icon: Sparkles,
    title: "Artisan Craftsmanship",
    description:
      "Combining timeless goldsmithing traditions with modern precision, each piece is finished by hand for effortless everyday elegance.",
  },
  {
    Icon: ShieldAlt2,
    title: "Certified Authenticity",
    description:
      "Every acquisition includes verified material specifications, transparent pricing in Ghana Cedis, and insured doorstep delivery.",
  },
];

const MILESTONES = [
  {
    number: "100%",
    label: "Authentic Metals & Gems",
  },
  {
    number: "24/7",
    label: "Direct WhatsApp Concierge",
  },
  {
    number: "48h",
    label: "Insured Nationwide Delivery",
  },
  {
    number: "Bespoke",
    label: "Custom Sourcing Available",
  },
];

export default function AboutPage() {
  const heroImage =
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop";
  const craftImage =
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1887&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-base-100 text-base-content flex flex-col items-center px-5 lg:px-12 py-8 space-y-20">
      {/* 1. Hero Banner */}
      <section className="w-full max-w-7xl relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div
          className="min-h-[65vh] bg-cover bg-center flex items-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/85 to-black/30" />

          <div className="relative z-10 p-8 md:p-16 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-mono bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" /> Our Heritage & Vision
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-great-vibes text-primary leading-tight">
              Crafted to Illuminate Every Moment
            </h1>

            <p className="text-base md:text-lg text-base-content/80 font-light leading-relaxed">
              At <span className="font-semibold text-white">{CompanyName}</span>
              , we believe fine jewellery is more than an accessory—it is an
              heirloom of personal milestones, quiet confidence, and timeless
              artistry.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="btn btn-primary text-black font-semibold tracking-wider uppercase text-xs px-6 rounded-xl shadow-lg shadow-primary/20 gap-2"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline border-white/20 hover:border-primary hover:bg-primary/10 text-xs uppercase tracking-wider px-6 rounded-xl"
              >
                Speak With a Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Story Split Section */}
      <Reveal>
        <section className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={craftImage}
                alt="Fine jewellery craftsmanship"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-great-vibes text-3xl text-primary">
                  {CompanySlogan}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-primary font-mono">
              The Story Behind {CompanyName}
            </span>

            <h2 className="text-3xl md:text-5xl font-serif font-light text-amber-50 leading-tight">
              Modern Elegance Rooted in Timeless Beauty
            </h2>

            <div className="space-y-4 text-sm md:text-base text-base-content/75 font-light leading-relaxed">
              <p>
                Founded with a passion for contemporary luxury, {CompanyName}{" "}
                curates distinctive pieces designed to transition effortlessly
                from intimate everyday moments to life&apos;s grandest
                celebrations.
              </p>
              <p>
                Whether you are selecting a signature solitaire ring, a delicate
                layered necklace, or a bespoke gift for someone unforgettable,
                our collection balances classic silhouettes with modern
                refinement.
              </p>
              <p>
                We pair curated luxury with personal service—giving you direct
                access to our team for sizing guidance, custom requests, and
                seamless order fulfillment.
              </p>
            </div>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              {MILESTONES.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-serif font-semibold text-primary">
                    {stat.number}
                  </p>
                  <p className="text-xs text-base-content/60 font-mono">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3. Three Core Pillars */}
      <Reveal>
        <section className="w-full max-w-7xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary font-mono">
              Our Standards
            </span>
            <h2 className="text-4xl md:text-5xl font-great-vibes text-primary">
              The Promise Behind Every Piece
            </h2>
            <p className="text-sm text-base-content/70 font-light">
              Three guiding principles shape every design we bring into our
              collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-black/20 border border-white/10 hover:border-primary/40 transition-all duration-300 space-y-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-amber-50">{title}</h3>
                <p className="text-sm text-base-content/70 font-light leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 4. Concierge Experience / CTA Banner */}
      <Reveal>
        <section className="w-full max-w-7xl rounded-3xl bg-gradient-to-r from-primary/20 via-black/40 to-primary/10 border border-primary/20 p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
              <Heart className="w-4 h-4" /> Personal Shopping Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Looking for a Signature Piece or Custom Gift?
            </h2>
            <p className="text-sm text-base-content/75 font-light leading-relaxed">
              Browse our live catalog online, download an instant itemized
              invoice from your bag, or message us directly on WhatsApp for
              personalized recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products"
              className="btn btn-primary text-black font-semibold text-xs uppercase tracking-widest px-7 rounded-xl"
            >
              Shop the Collection
            </Link>
            <Link
              href="/contact"
              className="btn btn-ghost border border-white/15 hover:border-primary text-xs uppercase tracking-widest px-7 rounded-xl gap-2"
            >
              <CheckCircle className="w-4 h-4 text-primary" /> Contact Concierge
            </Link>
          </div>
        </section>
      </Reveal>

      <div className="w-full max-w-7xl">
        <EndFooter />
      </div>
    </main>
  );
}