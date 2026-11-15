"use client";

import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartItem,
  getCartItems,
  removeFromCart,
  syncGuestCartToAccount,
} from "@/utils/cart";
import { supabase } from "@/utils/supabase";
import { Trash, ShoppingBag, ArrowLeft, CheckCircle } from "@boxicons/react";
import jsPDF from "jspdf";

export default function CartPage() {
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

    // 2. Prepare text summary for WhatsApp (separate from the PDF file)
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

    router.push("/contact");
  };

  return (
    <div className="p-6 bg-base-200/50 min-h-screen space-y-6 text-base-content font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-base-content/60 mt-0.5">
            {isLoggedIn
              ? "Synced with your account orders"
              : "Saved locally on this device"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-1 bg-base-100 hover:bg-base-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="btn btn-sm btn-primary text-white normal-case font-medium gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Proceed to Checkout (GH₵{subtotal.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold">Your Items</h2>
            <span className="badge badge-sm badge-neutral/10 font-bold">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="text-sm font-bold font-mono text-emerald-600">
            Total: GH₵{subtotal.toFixed(2)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="text-xs text-base-content/50 uppercase border-b border-base-200">
                <th>Product</th>
                <th>Category</th>
                <th>Specs (Metal / Gem)</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="border-b border-base-200/50"
                  >
                    <td colSpan={7}>
                      <div className="skeleton h-6 w-full"></div>
                    </td>
                  </tr>
                ))
              ) : cartItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-base-content/50 text-sm"
                  >
                    Your cart is empty. Browse our collection to add items!
                  </td>
                </tr>
              ) : (
                cartItems.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-base-200/40 border-b border-base-200/50"
                  >
                    <td>
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-lg bg-base-200 border border-base-300/50">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-[10px] text-base-content/40 font-medium">
                                N/A
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-base-content truncate">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-[11px] text-base-content/60 truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-ghost font-medium text-xs">
                        {item.category || "Jewelry"}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs space-y-0.5">
                        <div className="font-medium text-base-content/80">
                          {item.metal || "—"}
                        </div>
                        <div className="text-[11px] text-base-content/50">
                          {item.gemstone || "No gemstone"}
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-base-content/70 font-mono">
                      GH₵{Number(item.price).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge badge-sm badge-neutral/10 font-semibold font-mono">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="text-xs font-bold text-emerald-600 font-mono">
                      GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.productId}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 btn-square"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}