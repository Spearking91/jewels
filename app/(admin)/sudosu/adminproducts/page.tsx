"use client";

import Statcard from "@/components/statcard";
import { ProductList } from "@/lib/db";
import { supabase } from "@/utils/supabase";
import {
  Plus,
  DotsHorizontalRounded,
  ArrowInDownSquareHalf,
  Trash,
  ArrowUp,
  Box,
  BoxAlt,
  Edit,
  X,
  TrendingUp,
  TrendingDown,
} from "@boxicons/react";
import { useEffect, useState } from "react";

export interface Card {
  title: string;
  value: string;
  description: string;
  stat: string;
  isPositive?: boolean;
  MainIcon?: any;
  SecondaryIcon: any;
}

const PRODUCTS_PER_PAGE = 30;

const initialFormState = {
  title: "",
  subtitle: "",
  category: "",
  description: "",
  selling_price: "",
  cost_price: "",
  quantity: "",
  gemstone: "",
  metal: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");

  // Modal & Form States (Add)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductList | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching products:", error);
        setError(error);
      } else {
        setProducts((data as ProductList[]) ?? []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
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

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection (Add)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle file selection (Edit)
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEditSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeEditSelectedFile = (index: number) => {
    setEditSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImageUrl = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const uploadedImageUrls: string[] = [];

      for (const file of selectedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jewelry")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("jewelry")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          uploadedImageUrls.push(publicUrlData.publicUrl);
        }
      }

      const payload = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        selling_price: formData.selling_price,
        cost_price: formData.cost_price,
        quantity: formData.quantity,
        gemstone: formData.gemstone.trim(),
        metal: formData.metal.trim(),
        imageUrl: uploadedImageUrls,
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from("products")
        .insert([payload])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      if (data) {
        setProducts((prev) => [data as ProductList, ...prev]);
        setCurrentPage(1);
      }

      setFormData(initialFormState);
      setSelectedFiles([]);
      setIsSubmitting(false);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error adding product:", err);
      setFormError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal with pre-filled product details
  const openEditModal = (product: ProductList) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title || "",
      subtitle: product.subtitle || "",
      category: product.category || "",
      description: product.description || "",
      selling_price: String(product.selling_price ?? ""),
      cost_price: String(product.cost_price ?? ""),
      quantity: String(product.quantity ?? ""),
      gemstone: product.gemstone || "",
      metal: product.metal || "",
    });
    // Normalize imageUrl to always be string[]
    let images: string[] = [];
    if (Array.isArray(product.imageUrl)) {
      images = product.imageUrl;
    } else if (
      typeof product.imageUrl === "string" &&
      product.imageUrl.trim() !== ""
    ) {
      images = [product.imageUrl];
    }

    setExistingImageUrls(images);
    setEditSelectedFiles([]);
    setEditFormError(null);
    setIsEditModalOpen(true);
  };

  // Handle Product Update
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdating(true);
    setEditFormError(null);

    try {
      const newUploadedUrls: string[] = [];

      for (const file of editSelectedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jewelry")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("jewelry")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          newUploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      const combinedImageUrls = [...existingImageUrls, ...newUploadedUrls];

      const payload = {
        title: editFormData.title.trim(),
        subtitle: editFormData.subtitle.trim(),
        category: editFormData.category.trim(),
        description: editFormData.description.trim(),
        selling_price: editFormData.selling_price,
        cost_price: editFormData.cost_price,
        quantity: editFormData.quantity,
        gemstone: editFormData.gemstone.trim(),
        metal: editFormData.metal.trim(),
        imageUrl: combinedImageUrls,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);

      if (data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? (data as ProductList) : p,
          ),
        );
      }

      setIsUpdating(false);
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error("Error updating product:", err);
      setEditFormError(err.message || "An unexpected error occurred.");
      setIsUpdating(false);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) throw new Error(deleteError.message);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const totalQuantity = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0,
  );
  const totalCost = products.reduce(
    (sum, p) => sum + (Number(p.cost_price) || 0),
    0,
  );
  const totalSales = products.reduce(
    (sum, p) => sum + (Number(p.selling_price) || 0),
    0,
  );
  const totalProfit = totalSales - totalCost;

  const cards: Card[] = [
    {
      title: "Total Product Number",
      value: products.length.toLocaleString(),
      description: "vs. 14,653 last period",
      stat: "15.5%",
      isPositive: true,
      MainIcon: Box,
      SecondaryIcon: TrendingUp,
    },
    {
      title: "Total Quantity Available",
      value: totalQuantity.toLocaleString(),
      description: "vs. 5,732 last period",
      stat: "8.4%",
      isPositive: true,
      MainIcon: BoxAlt,
      SecondaryIcon: TrendingUp,
    },
    {
      title: "Total profit",
      value: `GH₵ ${totalProfit.toLocaleString()}`,
      description: "vs. 3,294 last period",
      stat: "10.5%",
      isPositive: false,
      MainIcon: TrendingUp,
      SecondaryIcon: TrendingDown,
    },
  ];

  return (
    <div className="p-6 bg-base-200/50 min-h-screen space-y-6 text-base-content font-sans">
      {/* --- Top Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFormError(null);
              setSelectedFiles([]);
              setIsModalOpen(true);
            }}
            className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-1 bg-base-100 hover:bg-base-200"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button className="btn btn-sm btn-primary normal-case font-medium gap-1">
            <ArrowInDownSquareHalf className="w-4 h-4" />
            Download xlsx
          </button>
        </div>
      </div>

      {/* --- Stat Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Statcard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            MainIcon={card.MainIcon}
          />
        ))}
      </div>

      {/* --- Products Table --- */}
      <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Products List</h2>
            <span className="badge badge-sm badge-neutral/10 font-bold">
              {products.length} items
            </span>
          </div>
          <button className="btn btn-ghost btn-xs btn-circle">
            <DotsHorizontalRounded className="w-4 h-4 text-base-content/50" />
          </button>
        </div>

        {error && (
          <div className="alert alert-error text-sm mb-4">
            <span>Failed to load products: {error.message}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="text-xs text-base-content/50 uppercase border-b border-base-200">
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Specs (Metal / Gem)</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
                    className="border-b border-base-200/50"
                  >
                    <td colSpan={9}>
                      <div className="skeleton h-4 w-full"></div>
                    </td>
                  </tr>
                ))
              ) : currentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-base-content/50 text-sm"
                  >
                    No products found. Click &quot;Add Product&quot; to create
                    one.
                  </td>
                </tr>
              ) : (
                currentProducts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-base-200/40 border-b border-base-200/50"
                  >
                    <td className="text-xs text-base-content/60 font-mono">
                      {item.id.slice(0, 8)}...
                    </td>
                    <td>
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-lg bg-base-200 border border-base-300/50">
                            {item.imageUrl && item.imageUrl.length > 0 ? (
                              <img
                                src={item.imageUrl[0]}
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
                        {item.category || "Uncategorized"}
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
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${
                          Number(item.quantity) <= 5
                            ? "badge-error/15 text-error"
                            : Number(item.quantity) <= 20
                              ? "badge-warning/15 text-warning"
                              : "badge-success/15 text-success"
                        }`}
                      >
                        {item.quantity} in stock
                      </span>
                    </td>
                    <td className="text-xs text-base-content/70 font-mono">
                      GH₵{Number(item.cost_price).toFixed(2)}
                    </td>
                    <td className="text-xs font-bold text-emerald-600 font-mono">
                      GH₵{Number(item.selling_price).toFixed(2)}
                    </td>
                    <td className="text-xs text-base-content/70 font-mono">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-ghost btn-xs btn-square text-base-content/70 hover:text-primary"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          disabled={deletingId === item.id}
                          className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                          title="Delete Product"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-base-200">
            <span className="text-xs text-base-content/60">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)}
              </span>{" "}
              of <span className="font-semibold">{products.length}</span>{" "}
              products
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
                    onChange={handleInputChange}
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

      {/* --- Add Product Modal --- */}
      {isModalOpen && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-xs">
          <div className="modal-box max-w-2xl bg-base-100 border border-base-200 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="font-bold text-lg">Add New Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error text-xs mt-4 py-2.5">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Title *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Subtitle
                    </span>
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Category *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Metal
                    </span>
                  </label>
                  <input
                    type="text"
                    name="metal"
                    value={formData.metal}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Gemstone
                    </span>
                  </label>
                  <input
                    type="text"
                    name="gemstone"
                    value={formData.gemstone}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Cost Price (GH₵) *
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="cost_price"
                    required
                    value={formData.cost_price}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Selling Price (GH₵) *
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="selling_price"
                    required
                    value={formData.selling_price}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Quantity *
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                  className="textarea textarea-bordered textarea-sm w-full"
                />
              </div>

              <div className="form-control space-y-2">
                <label className="label py-0">
                  <span className="label-text text-xs font-semibold">
                    Upload Images
                  </span>
                </label>
                <label className="border-2 border-dashed border-base-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-base-200/30">
                  <ArrowUp className="w-6 h-6 text-base-content/50 mb-1" />
                  <span className="text-xs font-medium text-base-content/70">
                    Click to browse images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-base-200/60 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <span className="truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(idx)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-action pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* --- Edit Product Modal --- */}
      {isEditModalOpen && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-xs">
          <div className="modal-box max-w-2xl bg-base-100 border border-base-200 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="font-bold text-lg">Edit Product</h3>
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

            <form onSubmit={handleUpdateProduct} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Title *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Subtitle
                    </span>
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={editFormData.subtitle}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Category *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Metal
                    </span>
                  </label>
                  <input
                    type="text"
                    name="metal"
                    value={editFormData.metal}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Gemstone
                    </span>
                  </label>
                  <input
                    type="text"
                    name="gemstone"
                    value={editFormData.gemstone}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Cost Price (GH₵) *
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="cost_price"
                    required
                    value={editFormData.cost_price}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Selling Price (GH₵) *
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="selling_price"
                    required
                    value={editFormData.selling_price}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Quantity *
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    required
                    value={editFormData.quantity}
                    onChange={handleEditFormChange}
                    className="input input-bordered input-sm w-full font-mono"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="textarea textarea-bordered textarea-sm w-full"
                />
              </div>

              {/* Existing Images Management */}
              {existingImageUrls.length > 0 && (
                <div className="form-control space-y-1.5">
                  <label className="label py-0">
                    <span className="label-text text-xs font-semibold">
                      Existing Images
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {existingImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-base-300 group"
                      >
                        <img
                          src={url}
                          alt={`Product ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImageUrl(idx)}
                          className="absolute inset-0 bg-black/50  flex items-center justify-center opacity-0 group-hover:opacity-150 transition-opacity"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="form-control space-y-2">
                <label className="label py-0">
                  <span className="label-text text-xs font-semibold">
                    Add More Images
                  </span>
                </label>
                <label className="border-2 border-dashed border-base-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-base-200/30">
                  <ArrowUp className="w-5 h-5 text-base-content/50 mb-1" />
                  <span className="text-xs font-medium text-base-content/70">
                    Click to browse new images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                </label>
                {editSelectedFiles.length > 0 && (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {editSelectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-base-200/60 px-3 py-1 rounded-lg text-xs"
                      >
                        <span className="truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEditSelectedFile(idx)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    "Update Product"
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

export default AdminProducts;
