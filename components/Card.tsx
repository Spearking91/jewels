"use client";
import { Heart, ShoppingBag } from "@boxicons/react";
import { useState } from "react";

type props = {
  thumbUrl: string | Blob | undefined;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  gemstone: string;
  metal: string;
  price: string;
};

const Card = ({
  thumbUrl,
  title,
  category,
  subtitle,
  description,
  gemstone,
  metal,
  price,
}: props) => {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className="w-96 lg:w-1/3 flex flex-col md:flex-row gap-5 border border-white/10 rounded-2xl p-5 bg-black/20 backdrop-blur-md">
      {/* Detailed Image Spotlight */}
      <div className="relative group w- md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center">
        <img
          src={thumbUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/20 transition backdrop-blur-md"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
          />
        </button>
      </div>

      {/* Product Details Specs */}
      <div className="w-full md:w-1/2 flex flex-col text-left space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            {category}
          </span>
          <span className="text-xs text-neutral-400 tracking-wider font-mono">
            {subtitle}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-light text-amber-50 tracking-wide">
          {title}
        </h1>

        <p className="text-sm text-neutral-300 leading-relaxed font-light">
          {description}
        </p>

        <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-neutral-400">
          <p>
            <span className="text-amber-200/70 font-medium">Gemstone:</span>{" "}
            {gemstone}
          </p>
          <p>
            <span className="text-amber-200/70 font-medium">Craft Metal:</span>{" "}
            {metal}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block uppercase tracking-wider">
              Price
            </span>
            <span className="text-2xl font-serif text-amber-300 font-medium">
              {price}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Acquire Piece
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
