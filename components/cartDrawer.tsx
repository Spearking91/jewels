"use client";

import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CartItem,
  getCartItems,
  removeFromCart,
  syncGuestCartToAccount,
} from "../utils/cart";
import { supabase } from "../utils/supabase";
import { Trash, ShoppingBag, CheckCircle, X } from "@boxicons/react";
import jsPDF from "jspdf";

const cartDrawer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCart = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    if (user) {
      await syncGuestCartToAccount();
    }

    const items = await getCartItems();
    setCartItems(items);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  const handleDelete = async (item: CartItem) => {
    setDeletingId(item.productId);
    await removeFromCart(item.productId, item.id);
    setCartItems((prev) => prev.filter((i) => i.productId !== item.productId));
    setDeletingId(null);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const doc = new jsPDF();

    // Add Store Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ORDER INVOICE / CART SUMMARY", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Items: ${totalItems}`, 14, 34);

    // Build Table Rows for PDF
    const tableRows = cartItems.map((item, index) => [
      index + 1,
      item.title,
      item.metal || "—",
      item.gemstone || "—",
      item.quantity,
      `GHc ${Number(item.price).toFixed(2)}`,
      `GHc ${(Number(item.price) * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["#", "Product", "Metal", "Gemstone", "Qty", "Price", "Subtotal"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [20, 20, 20] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 50;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: GHc ${subtotal.toFixed(2)}`, 14, finalY + 12);

    // 1. Download PDF locally to device
    doc.save(`Order_Invoice_${Date.now()}.pdf`);

    // 2. Prepare text summary for WhatsApp
    const orderSummaryText = cartItems
      .map(
        (i) =>
          `• ${i.quantity}x ${i.title} (${i.metal || "Standard"}) - GHc${(
            Number(i.price) * i.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    sessionStorage.setItem(
      "checkout_order",
      `Hello! I would like to place an order for the following items:\n\n${orderSummaryText}\n\n*Grand Total: GHc ${subtotal.toFixed(
        2,
      )}*\n\n*(Note: I have downloaded and attached my PDF invoice to this chat)*`,
    );

    // Close drawer by unchecking the input (optional or handled by router push)
    const checkbox = document.getElementById(
      "cart-drawer-toggle",
    ) as HTMLInputElement;
    if (checkbox) checkbox.checked = false;

    router.push("/contact");
  };

  return (
    <div className="drawer drawer-end z-50">
      <input
        id="cart-drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* The drawer content wraps the rest of your app layout */}
      {children}
      <div className="drawer-content flex flex-col">
        {/* You can place a trigger button anywhere, e.g., in your Navbar/TitleBar */}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="cart-drawer-toggle"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu bg-base-100 text-base-content min-h-full w-96 sm:w-[450px] p-6 flex flex-col justify-between shadow-2xl">
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-base-300">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Your Shopping Cart</h2>
                <span className="badge badge-sm badge-neutral/10 font-bold">
                  {totalItems}
                </span>
              </div>
              <label
                htmlFor="cart-drawer-toggle"
                className="btn btn-sm btn-ghost btn-square"
              >
                <X className="w-5 h-5" />
              </label>
            </div>

            <p className="text-xs text-base-content/60 mt-2">
              {isLoggedIn
                ? "Synced with your account orders"
                : "Saved locally on this device"}
            </p>

            {/* Cart Items List */}
            <div className="mt-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="skeleton h-16 w-full rounded-xl"
                  ></div>
                ))
              ) : cartItems.length === 0 ? (
                <div className="text-center py-16 text-base-content/50 text-sm">
                  Your cart is empty. Browse our collection to add pieces!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-base-200/50 border border-base-300/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-base-200 border border-base-300 shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-[10px] text-base-content/40">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-base-content truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-base-content/60 truncate">
                          {item.metal || "Standard"} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-bold font-mono text-emerald-600 mt-0.5">
                          GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.productId}
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10 btn-square shrink-0"
                      title="Remove"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Drawer Footer & Checkout Action */}
          <div className="pt-4 border-t border-base-300 space-y-4">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-base-content/70">Subtotal:</span>
              <span className="font-bold text-emerald-600 text-base">
                GH₵{subtotal.toFixed(2)}
              </span>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full gap-2 normal-case font-medium shadow-lg shadow-primary/20"
              >
                <CheckCircle className="w-5 h-5" />
                Proceed to Checkout ({totalItems} items)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default cartDrawer;
