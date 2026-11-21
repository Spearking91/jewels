"use client";

import { Suspense } from "react";
import Counter from "@/components/counter";
import { addToCart } from "@/utils/cart";
import { supabase } from "@/utils/supabase";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBagAlt,
  Sparkles,
  Truck,
} from "@boxicons/react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1693212793204-bcea856c75fe";

// Inner component that safely uses useParams() inside Suspense
function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } else {
        setProduct(data);
        setSelectedIndex(0);
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Normalize product.imageUrl into a clean array of URLs
  const images: string[] = Array.isArray(product.imageUrl)
    ? product.imageUrl.filter(Boolean)
    : product.imageUrl
      ? [product.imageUrl]
      : [FALLBACK_IMAGE];

  const displayImage = images[selectedIndex] || images[0] || FALLBACK_IMAGE;

  const handleAddToCart = async () => {
    setAdding(true);

    const numericPrice =
      Number(product.selling_price) ||
      Number(String(product.price || "0").replace(/[^0-9.]/g, "")) ||
      0;

    const res = await addToCart({
      productId: product.id.toString(),
      title: product.title,
      subtitle: product.subtitle || "",
      category: product.category || "",
      metal: product.metal || "",
      gemstone: product.gemstone || "",
      price: numericPrice,
      quantity: quantity,
      imageUrl: images[0] || "",
    });

    setAdding(false);
    if (res.success) {
      // 1. Ensure CartDrawer reloads the latest items
      window.dispatchEvent(new Event("cart-updated"));

      // 2. Open the DaisyUI CartDrawer programmatically
      const drawerCheckbox = document.getElementById(
        "cart-drawer-toggle",
      ) as HTMLInputElement | null;

      if (drawerCheckbox) {
        drawerCheckbox.checked = true;
      }
    } else {
      alert(`Could not add to cart: ${res.error}`);
    }
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 lg:px-16 py-8 flex flex-col items-center w-full">
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
          {/* Main Image Box */}
          <div className="relative group w-full aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
            <img
              src={displayImage}
              alt={`${product.title} - view ${selectedIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="text-xs font-mono tracking-widest uppercase text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                {product.category || "Jewelry"}
              </span>
              <span className="text-xs font-mono tracking-widest text-primary bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/30">
                Authentic Certified
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((imgUrl, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${imgUrl}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-black/40 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
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
                REF: #{product.id.toString().slice(0, 8)}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-light text-amber-50 tracking-wide leading-tight">
              {product.title}
            </h1>

            <p className="text-3xl font-serif text-primary font-medium pt-2 font-mono">
              GH₵{Number(product.selling_price || 0).toFixed(2)}
            </p>
          </div>

          <p className="text-sm text-base-content/75 leading-relaxed font-light border-t border-b border-white/10 py-5">
            {product.description || "No description provided for this piece."}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-base-content/40 block">
                Primary Gemstone
              </span>
              <p className="text-sm font-medium text-amber-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />{" "}
                {product.gemstone || "None"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-base-content/40 block">
                Craft Metal
              </span>
              <p className="text-sm font-medium text-amber-100">
                {product.metal || "Standard"}
              </p>
            </div>
          </div>

          {/* Action Area with Counter & Add to Bag */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-base-content/60">
                Quantity:
              </span>
              <Counter
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary/80 via-primary to-primary/90 text-black font-semibold text-sm tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition shadow-xl shadow-primary/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              {adding ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <ShoppingBagAlt className="w-5 h-5" /> Add to bag ({quantity})
                </>
              )}
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-2 pt-4 text-center border-t border-white/10">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-primary/70" />
              <span className="text-[10px] text-base-content/60 uppercase tracking-wider">
                Insured Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="w-5 h-5 text-primary/70" />
              <span className="text-[10px] text-base-content/60 uppercase tracking-wider">
                Authentic
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Default export wrapped in Suspense to satisfy Next.js 16 build requirements
export default function DetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
