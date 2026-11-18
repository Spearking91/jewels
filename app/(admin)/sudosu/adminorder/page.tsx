"use client";

import Statcard from "@/components/statcard";
import { supabase } from "@/utils/supabase";
import {
  DotsHorizontalRounded,
  ArrowInDownSquareHalf,
  Trash,
  Edit,
  X,
  ShoppingBag,
  User,
  CheckCircle,
  Clock,
  TrendingUp,
} from "@boxicons/react";
import { useEffect, useState } from "react";

export interface OrderItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: string;
  created_at: string;
  products?: {
    title: string;
    subtitle?: string;
    category?: string;
    metal?: string;
    gemstone?: string;
    selling_price: number;
    imageUrl?: string[];
  };
}

export interface UserOrdersGroup {
  userId: string;
  orders: OrderItem[];
  totalItems: number;
  totalAmount: number;
}

const ORDERS_PER_PAGE = 15;

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>("1");
  const [editStatus, setEditStatus] = useState<string>("cart");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // Action / Loading States
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        id,
        userId,
        productId,
        quantity,
        status,
        created_at,
        products (
          title,
          subtitle,
          category,
          metal,
          gemstone,
          selling_price,
          imageUrl
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching orders:", error);
      setError(error);
    } else {
      setOrders((data as unknown as OrderItem[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group orders by user ID
  const groupedByUser: UserOrdersGroup[] = Object.values(
    orders.reduce((acc: { [key: string]: UserOrdersGroup }, order) => {
      const uid = order.userId || "guest-unknown";
      if (!acc[uid]) {
        acc[uid] = {
          userId: uid,
          orders: [],
          totalItems: 0,
          totalAmount: 0,
        };
      }
      acc[uid].orders.push(order);
      acc[uid].totalItems += Number(order.quantity) || 0;
      const price = Number(order.products?.selling_price) || 0;
      acc[uid].totalAmount += price * (Number(order.quantity) || 0);
      return acc;
    }, {}),
  );

  const totalPages = Math.ceil(groupedByUser.length / ORDERS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const currentGroups = groupedByUser.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );

  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputSubmit = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>,
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter")
      return;

    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
    } else {
      setInputPage(String(currentPage));
    }
  };

  // Trigger Supabase RPC to fulfill order and deduct stock
  const handleFulfillOrder = async (orderId: string) => {
    if (
      !confirm(
        "Fulfill this order and deduct the ordered quantity from inventory?",
      )
    )
      return;
    setActionLoadingId(orderId);

    try {
      const { error: rpcError } = await supabase.rpc("fulfill_order_item", {
        p_order_id: orderId,
      });

      if (rpcError) throw new Error(rpcError.message);

      // Refresh orders list to reflect status change
      await fetchOrders();
    } catch (err: any) {
      console.error("Error fulfilling order:", err);
      alert(`Failed to fulfill order: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (order: OrderItem) => {
    setEditingOrder(order);
    setEditQuantity(String(order.quantity));
    setEditStatus(order.status || "cart");
    setEditFormError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setIsUpdating(true);
    setEditFormError(null);

    try {
      const { data, error: updateError } = await supabase
        .from("order")
        .update({
          quantity: parseInt(editQuantity, 10),
          status: editStatus,
        })
        .eq("id", editingOrder.id)
        .select(
          `
          id,
          userId,
          productId,
          quantity,
          status,
          created_at,
          products (
            title,
            subtitle,
            category,
            metal,
            gemstone,
            selling_price,
            imageUrl
          )
        `,
        )
        .single();

      if (updateError) throw new Error(updateError.message);

      if (data) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editingOrder.id ? (data as unknown as OrderItem) : o,
          ),
        );
      }

      setIsUpdating(false);
      setIsEditModalOpen(false);
      setEditingOrder(null);
    } catch (err: any) {
      console.error("Error updating order:", err);
      setEditFormError(err.message || "An unexpected error occurred.");
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order item?")) return;
    setDeletingId(id);

    try {
      const { error: deleteError } = await supabase
        .from("order")
        .delete()
        .eq("id", id);

      if (deleteError) throw new Error(deleteError.message);

      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) {
      console.error("Error deleting order:", err);
      alert(`Failed to delete order: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) =>
      sum +
      (Number(o.products?.selling_price) || 0) * (Number(o.quantity) || 0),
    0,
  );
  const activeCartsCount = orders.filter((o) => o.status === "cart").length;

  return (
    <div className="p-6 bg-base-200/50 min-h-screen space-y-6 text-base-content font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Orders</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Manage orders, fulfill stock purchases, and track user carts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchOrders}
            className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-1 bg-base-100 hover:bg-base-200"
          >
            Refresh Data
          </button>
          <button className="btn btn-sm btn-primary normal-case font-medium gap-1">
            <ArrowInDownSquareHalf className="w-4 h-4" />
            Download xlsx
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Statcard
          title="Total Order Line Items"
          value={totalOrdersCount.toLocaleString()}
          description="Across all user sessions"
          MainIcon={ShoppingBag}
        />
        <Statcard
          title="Gross Order Value"
          value={`GH₵ ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Calculated from active order items"
          MainIcon={TrendingUp}
        />
        <Statcard
          title="Active Cart Statuses"
          value={activeCartsCount.toLocaleString()}
          description="Items currently sitting in carts"
          MainIcon={Clock}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">
              Orders Categorized by User ID
            </h2>
            <span className="badge badge-sm badge-neutral/10 font-bold">
              {groupedByUser.length} Unique Users
            </span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error text-sm">
            <span>Failed to load orders: {error.message}</span>
          </div>
        )}

        {loading ? (
          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="skeleton h-20 w-full rounded-xl"
              ></div>
            ))}
          </div>
        ) : currentGroups.length === 0 ? (
          <div className="card bg-base-100 p-12 text-center rounded-2xl shadow-sm border border-base-200/60 text-base-content/50 text-sm">
            No orders or cart items found in the database.
          </div>
        ) : (
          currentGroups.map((group) => (
            <div
              key={group.userId}
              className="card bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden"
            >
              <div className="bg-base-200/60 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-base-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-base-content flex items-center gap-2">
                      <span>User ID: {group.userId}</span>
                      <span className="badge badge-xs badge-primary/20 text-primary font-normal">
                        {group.orders.length}{" "}
                        {group.orders.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-base-content/70">
                    Total Items:{" "}
                    <strong className="text-base-content">
                      {group.totalItems}
                    </strong>
                  </span>
                  <span className="text-emerald-600 font-bold">
                    Subtotal: GH₵ {group.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="text-[11px] text-base-content/50 uppercase border-b border-base-200 bg-base-100">
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Metal / Gemstone</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.orders.map((item) => {
                      const unitPrice =
                        Number(item.products?.selling_price) || 0;
                      const imageUrl = item.products?.imageUrl?.[0];
                      const isCompleted = item.status === "completed";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-base-200/40 border-b border-base-200/40"
                        >
                          <td className="text-xs text-base-content/60 font-mono">
                            {item.id.slice(0, 8)}...
                          </td>
                          <td>
                            <div className="flex items-center gap-3 max-w-xs">
                              <div className="avatar">
                                <div className="w-9 h-9 rounded-lg bg-base-200 border border-base-300/50 overflow-hidden shrink-0">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={item.products?.title || "Product"}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center w-full h-full text-[9px] text-base-content/40">
                                      N/A
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-base-content truncate">
                                  {item.products?.title || "Unknown Product"}
                                </div>
                                <div className="text-[11px] text-base-content/60 truncate">
                                  {item.products?.category || "Uncategorized"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-xs space-y-0.5">
                              <div className="font-medium text-base-content/80">
                                {item.products?.metal || "—"}
                              </div>
                              <div className="text-[11px] text-base-content/50">
                                {item.products?.gemstone || "No gemstone"}
                              </div>
                            </div>
                          </td>
                          <td className="text-xs font-mono font-bold">
                            {item.quantity}
                          </td>
                          <td className="text-xs text-base-content/70 font-mono">
                            GH₵ {unitPrice.toFixed(2)}
                          </td>
                          <td>
                            <span
                              className={`badge badge-sm font-semibold capitalize ${
                                item.status === "cart"
                                  ? "badge-ghost text-base-content/70"
                                  : isCompleted
                                    ? "badge-success/15 text-success"
                                    : "badge-info/15 text-info"
                              }`}
                            >
                              {item.status || "cart"}
                            </span>
                          </td>
                          <td className="text-xs text-base-content/60 font-mono">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Fulfill / Deduct Stock Button */}
                              <button
                                onClick={() => handleFulfillOrder(item.id)}
                                disabled={
                                  isCompleted || actionLoadingId === item.id
                                }
                                className={`btn btn-xs gap-1 normal-case font-medium ${
                                  isCompleted
                                    ? "btn-ghost text-success/60 cursor-not-allowed"
                                    : "btn-success btn-outline"
                                }`}
                                title={
                                  isCompleted
                                    ? "Already Fulfilled"
                                    : "Fulfill Order & Deduct Stock"
                                }
                              >
                                {actionLoadingId === item.id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                <span className="text-[11px]">
                                  {isCompleted ? "Fulfilled" : "Fulfill"}
                                </span>
                              </button>

                              <button
                                onClick={() => openEditModal(item)}
                                className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-primary"
                                title="Edit Order Item"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(item.id)}
                                disabled={deletingId === item.id}
                                className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                                title="Delete Order Item"
                              >
                                {deletingId === item.id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <Trash className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-base-200 bg-base-100 p-4 rounded-2xl shadow-sm">
            <span className="text-xs text-base-content/60">
              Showing users{" "}
              <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(startIndex + ORDERS_PER_PAGE, groupedByUser.length)}
              </span>{" "}
              of <span className="font-semibold">{groupedByUser.length}</span>
            </span>

            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {totalPages > 2 && (
                <div className="join-item flex items-center px-3 bg-base-100 border border-base-300 gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    onKeyDown={handleInputSubmit}
                    onBlur={handleInputSubmit}
                    className="input input-xs w-12 text-center font-mono p-0 focus:outline-none"
                  />
                  <span className="text-xs text-base-content/60 font-mono">
                    / {totalPages}
                  </span>
                </div>
              )}
              <button
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingOrder && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-xs">
          <div className="modal-box max-w-md bg-base-100 border border-base-200 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="font-bold text-lg">Edit Order Item</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editFormError && (
              <div className="alert alert-error text-xs mt-4 py-2.5">
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateOrder} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    Product
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={editingOrder.products?.title || "Unknown Product"}
                  className="input input-bordered input-sm w-full bg-base-200/50 text-base-content/70"
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    User ID
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={editingOrder.userId}
                  className="input input-bordered input-sm w-full font-mono bg-base-200/50 text-base-content/70 text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Quantity *
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Status *
                    </span>
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="select select-bordered select-sm w-full text-xs"
                  >
                    <option value="cart">Cart</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="modal-action pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-sm btn-primary"
                >
                  {isUpdating ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminOrders;
