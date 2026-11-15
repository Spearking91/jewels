import { supabase } from "@/utils/supabase";

export interface CartItem {
  id?: string; // order row UUID
  productId: string;
  title: string;
  subtitle?: string;
  category?: string;
  metal?: string;
  gemstone?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const LOCAL_CART_KEY = "guest_jewelry_cart";

const notifyCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
};

export async function getCartItems(): Promise<CartItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Fetch from public.order joined with products table for details
    const { data, error } = await supabase
      .from("order")
      .select(`
        id,
        quantity,
        productId,
        products (
          title,
          subtitle,
          category,
          metal,
          gemstone,
          selling_price,
          imageUrl
        )
      `)
      .eq("userId", user.id)
      .eq("status", "cart")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart from Supabase:", error);
      return [];
    }

    // Map database result to CartItem interface
    return (data || []).map((row: any) => ({
      id: row.id,
      productId: row.productId,
      quantity: Number(row.quantity),
      title: row.products?.title || "Product",
      subtitle: row.products?.subtitle || "",
      category: row.products?.category || "",
      metal: row.products?.metal || "",
      gemstone: row.products?.gemstone || "",
      price: Number(row.products?.selling_price || 0),
      imageUrl: row.products?.imageUrl?.[0] || "",
    }));
  } else {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(LOCAL_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  }
}

export async function addToCart(item: CartItem): Promise<{ success: boolean; error?: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if this product is already in the user's cart
    const { data: existing } = await supabase
      .from("order")
      .select("*")
      .eq("userId", user.id)
      .eq("productId", item.productId)
      .eq("status", "cart")
      .single();

    if (existing) {
      // Update quantity if it exists
      const { error } = await supabase
        .from("order")
        .update({
          quantity: Number(existing.quantity) + item.quantity,
        })
        .eq("id", existing.id);

      if (error) return { success: false, error: error.message };
    } else {
      // Insert new cart row referencing products(id)
      const { error } = await supabase.from("order").insert([
        {
          userId: user.id,
          productId: item.productId,
          quantity: item.quantity,
          status: "cart",
        },
      ]);

      if (error) return { success: false, error: error.message };
    }
  } else {
    // Anonymous Visitor -> Save to localStorage cache
    const currentCart = await getCartItems();
    const existingIndex = currentCart.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(currentCart));
  }

  notifyCartUpdate();
  return { success: true };
}

export async function removeFromCart(productId: string, orderId?: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && orderId) {
    await supabase.from("order").delete().eq("id", orderId);
  } else {
    const currentCart = await getCartItems();
    const updated = currentCart.filter((item) => item.productId !== productId);
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updated));
  }

  notifyCartUpdate();
}

export async function syncGuestCartToAccount(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || typeof window === "undefined") return;

  const saved = localStorage.getItem(LOCAL_CART_KEY);
  if (!saved) return;

  const guestItems: CartItem[] = JSON.parse(saved);
  for (const item of guestItems) {
    await addToCart(item);
  }
  localStorage.removeItem(LOCAL_CART_KEY);
  notifyCartUpdate();
}