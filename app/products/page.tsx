"use client";

import Card from "@/components/Card";
import { JEWELRY_ITEMS } from "@/lib/db";
import React, { useState } from "react";

const ITEMS_PER_PAGE = 15;

const Products = () => {
  const products = JEWELRY_ITEMS;
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculations
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-base-100 text-base-content px-5 lg:px-12 py-6">
      {/* 1. Styled Category Poster / Header */}
      <section className="w-full max-w-7xl rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 via-[#050507] to-[#050507] border border-white/10 flex items-center justify-between p-8 lg:p-12 overflow-hidden mb-12 shadow-xl">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-primary font-mono">
            Curated Collection
          </span>
          <h1 className="text-5xl lg:text-6xl font-serif tracking-wide text-white">
            Exquisite Earrings
          </h1>
          <p className="text-sm text-base-content/70 max-w-md font-light">
            Discover modern artisan pieces designed with precision, beauty, and
            timeless style to illuminate every moment.
          </p>
        </div>
        <div className="hidden md:block w-36 h-36 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1693212793204-bcea856c75fe?q=80&w=1760&auto=format&fit=crop"
            alt="earring collection"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          />
        </div>
      </section>

      {/* 2. Product Grid Container */}
      <section className="w-full max-w-7xl pb-20">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <p className="text-sm tracking-wider text-base-content/60 font-mono">
            SHOWING {startIndex + 1}–{Math.min(endIndex, products.length)} OF{" "}
            {products.length} PIECES
          </p>
          <div className="text-xs tracking-widest text-primary uppercase font-medium">
            Handcrafted Luxury
          </div>
        </div>

        {/* Grid layout ensuring structured spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {currentProducts.map((product) => (
            <Card
              key={product.id}
              style="w-full max-w-sm !p-4 md:flex-col [&_h1]:!text-2xl [&_p]:!text-xs"
              thumbUrl={product.thumbUrl}
              title={product.title}
              subtitle={product.subtitle}
              description={product.description}
              category={product.category}
              gemstone={product.gemstone}
              metal={product.metal}
              price={product.price}
              redirectUrl={`/products/${product.id}`}
            />
          ))}
        </div>

        {/* 3. Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              Previous
            </button>

            <div className="flex gap-1 px-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-lg text-sm transition ${
                      currentPage === pageNumber
                        ? "bg-primary text-black font-semibold"
                        : "hover:bg-white/5 border border-white/10"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
