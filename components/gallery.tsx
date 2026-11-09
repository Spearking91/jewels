"use client";
import { JEWELRY_ITEMS } from "@/lib/db";
import React, { useCallback, useEffect, useState } from "react";

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const product = JEWELRY_ITEMS.slice(0, 5);
  const activeItem = product[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % JEWELRY_ITEMS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + JEWELRY_ITEMS.length) % JEWELRY_ITEMS.length,
    );
  }, []);
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full">
      <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-auto py-6 px-4 no-scrollbar">
        {product.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`relative group transition-all duration-500 ease-out rounded-2xl overflow-hidden focus:outline-none flex-shrink-0 ${
                isActive
                  ? "scale-125 sm:scale-135 border-2 border-primary/90 shadow-[0_0_25px_rgba(245,158,11,0.4)] z-20"
                  : "scale-90 opacity-40 hover:opacity-100 hover:scale-100 border border-white/10 z-10"
              }`}
              style={{
                width: isActive ? "90px" : "65px",
                height: isActive ? "90px" : "65px",
              }}
            >
              <img
                src={item.thumbUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Subtle Glow Overlay on Active */}
              {isActive && (
                <div className="absolute inset-0 ring-2 ring-primary/50 rounded-2xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-2 px-4 py-2 justify-end">
        {product.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex
                ? "w-8 h-2 bg-primary shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
