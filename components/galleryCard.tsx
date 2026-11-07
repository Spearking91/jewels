'use client';
import { JEWELRY_ITEMS } from '@/lib/db';
import { Check, ChevronLeft, ChevronRight, Code, Copy, Heart, Pause, Play, ShoppingBag, Sparkles } from '@boxicons/react';
import React, { useState, useEffect, useCallback } from 'react';


// Sample curated luxury jewelry items matching dark aesthetic

export default function GalleryCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const activeItem = JEWELRY_ITEMS[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % JEWELRY_ITEMS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + JEWELRY_ITEMS.length) % JEWELRY_ITEMS.length);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay Timer
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  const copyCodeSnippet = () => {
    const codeText = `// Next.js (App Router) + Tailwind v4 snippet
import { useState } from 'react';

const items = ${JSON.stringify(JEWELRY_ITEMS, null, 2)};

export default function Gallery() {
  const [active, setActive] = useState(0);
  return (
    <div className="relative min-h-[600px] bg-black text-white p-8 flex flex-col justify-end">
      {/* Background Hero */}
      <img src={items[active].heroUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      
      {/* Thumbnails Row */}
      <div className="relative z-10 flex items-center gap-4 justify-center py-6">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActive(idx)}
            className={\`relative transition-all duration-300 rounded-2xl overflow-hidden border-2 \${
              active === idx 
                ? 'scale-125 border-amber-400 shadow-2xl z-20' 
                : 'scale-90 border-transparent opacity-60 hover:opacity-100'
            }\`}
          >
            <img src={item.thumbUrl} className="w-24 h-24 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}`;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 flex flex-col justify-between relative overflow-hidden">

      {/* Top Header / Navigation Bar */}
      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-black font-serif font-bold text-lg">
            M
          </div>
          <span className="font-serif tracking-[0.25em] text-lg font-semibold uppercase text-amber-100/90">
            Maison Atelier
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase bg-white/5 border border-white/10 hover:bg-white/15 transition duration-200 text-amber-200"
          >
            <Code className="w-3.5 h-3.5" />
            {showCode ? "Hide React Code" : "Get React Code"}
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase transition duration-200 ${
              isPlaying ? 'bg-amber-500 text-black font-semibold' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Autoplay On" : "Autoplay"}
          </button>
        </div>
      </header>

      {/* Code Modal View (Toggleable) */}
      {showCode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f0f14] border border-amber-500/30 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-sm font-semibold text-amber-100">Next.js + Tailwind Carousel Code</h3>
              </div>
              <button 
                onClick={() => setShowCode(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed bg-[#0a0a0e]">
              <pre>
{`// 1. In your global.css (Tailwind v4 theme definition):
@theme {
  --font-great-vibes: var(--font-great-vibes), cursive;
}

// 2. Component Code (Interactive Thumbnail Carousel)
import { useState } from 'react';

export default function JewelryGallery({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between p-8">
      {/* Dynamic Background Image with Smooth Crossfade */}
      <div className="absolute inset-0 z-0">
        <img 
          src={active.heroUrl} 
          alt={active.title}
          className="w-full h-full object-cover opacity-25 filter blur-sm transition-opacity duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Thumbnail Carousel Section (Scaled Active Card) */}
      <div className="relative z-10 flex items-center justify-center gap-6 py-10">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={\`relative transition-all duration-500 ease-out rounded-2xl overflow-hidden border-2 focus:outline-none \${
                isActive
                  ? "scale-125 md:scale-150 border-amber-400/90 shadow-[0_0_30px_rgba(251,191,36,0.4)] z-30"
                  : "scale-90 border-white/10 opacity-50 hover:opacity-90 hover:scale-100 z-10"
              }\`}
            >
              <img 
                src={item.thumbUrl} 
                alt={item.title} 
                className="w-20 h-20 md:w-28 md:h-28 object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}`}
              </pre>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end bg-white/5">
              <button
                onClick={copyCodeSnippet}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy React Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Showcase Area */}
      <main className="relative flex-1 flex flex-col justify-center items-center px-6 md:px-16 pt-8 pb-32">
        {/* Dynamic Glowing Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            key={activeItem.heroUrl}
            src={activeItem.heroUrl} 
            alt="Jewelry Showcase Background" 
            className="w-full h-full object-cover opacity-20 filter blur-xl scale-110 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-[#050507]/80 to-[#050507]" />
        </div>

        {/* Floating Content Card */}
        <div className="relative z-10 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-10 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          
          {/* Detailed Image Spotlight */}
          <div className="relative group w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center">
            <img 
              key={activeItem.id}
              src={activeItem.thumbUrl}
              alt={activeItem.title}
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/20 transition backdrop-blur-md"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          </div>

          {/* Product Details Specs */}
          <div className="w-full md:w-1/2 flex flex-col text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {activeItem.category}
              </span>
              <span className="text-xs text-neutral-400 tracking-wider font-mono">
                {activeItem.subtitle}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-light text-amber-50 tracking-wide">
              {activeItem.title}
            </h1>

            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {activeItem.description}
            </p>

            <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-neutral-400">
              <p><span className="text-amber-200/70 font-medium">Gemstone:</span> {activeItem.gemstone}</p>
              <p><span className="text-amber-200/70 font-medium">Craft Metal:</span> {activeItem.metal}</p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block uppercase tracking-wider">Price</span>
                <span className="text-2xl font-serif text-amber-300 font-medium">{activeItem.price}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Acquire Piece
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Thumbnail Showcase & Navigation Controls (Matches Reference Image) */}
      <footer className="relative z-30 pb-8 px-4 flex flex-col items-center">
        
        {/* Main Interactive Carousel Row */}
        <div className="w-full max-w-5xl flex items-center justify-center gap-3 sm:gap-6 md:gap-8 py-4 px-2">
          
          {/* Prev Arrow */}
          <button 
            onClick={handlePrev}
            aria-label="Previous image"
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition duration-300 text-white backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Thumbnails Container */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto py-6 px-4 no-scrollbar">
            {JEWELRY_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative group transition-all duration-500 ease-out rounded-2xl overflow-hidden focus:outline-none flex-shrink-0 ${
                    isActive 
                      ? 'scale-125 sm:scale-135 border-2 border-amber-300/90 shadow-[0_0_25px_rgba(245,158,11,0.4)] z-20' 
                      : 'scale-90 opacity-40 hover:opacity-100 hover:scale-100 border border-white/10 z-10'
                  }`}
                  style={{
                    width: isActive ? '90px' : '65px',
                    height: isActive ? '90px' : '65px',
                  }}
                >
                  <img 
                    src={item.thumbUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle Glow Overlay on Active */}
                  {isActive && (
                    <div className="absolute inset-0 ring-2 ring-amber-400/50 rounded-2xl pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button 
            onClick={handleNext}
            aria-label="Next image"
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition duration-300 text-white backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots (Matching layout from image) */}
        <div className="flex items-center gap-2 mt-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          {JEWELRY_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex 
                  ? 'w-8 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation hint */}
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-3 font-mono">
          Use Left/Right Keyboard Arrows or Click Thumbnails
        </p>
      </footer>
    </div>
  );
}