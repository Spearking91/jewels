import { supabase } from "@/utils/supabase";

export interface CartItem {
  id?: string;
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

const NOTIFY_EVENT = "cart-updated";

const notifyCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFY_EVENT));
  }
};

/**
 * Helper to ensure we have a user (either logged-in or automatically provisioned anonymous user)
 */
async function getOrCreateUserSession() {
  let { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Automatically sign in anonymously if no session exists
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Error creating anonymous session:", error.message);
      return null;
    }
    user = data.user;
  }
  return user;
}

export async function getCartItems(): Promise<CartItem[]> {
  const { data: { user } } = await supabase.auth.getUser();

  // If there's no user session yet, they don't have a database cart
  if (!user) return [];

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
}

export async function addToCart(item: CartItem): Promise<{ success: boolean; error?: string }> {
  // 1. Automatically get or create an anonymous/permanent user session
  const user = await getOrCreateUserSession();
  if (!user) {
    return { success: false, error: "Could not establish user session for cart." };
  }

  // 2. Check if product already exists in this user's cart
  const { data: existing } = await supabase
    .from("order")
    .select("*")
    .eq("userId", user.id)
    .eq("productId", item.productId)
    .eq("status", "cart")
    .single();

  if (existing) {
    const { error } = await supabase
      .from("order")
      .update({
        quantity: Number(existing.quantity) + item.quantity,
      })
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
  } else {
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

  notifyCartUpdate();
  return { success: true };
}

export async function removeFromCart(productId: string, orderId?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (orderId) {
    await supabase.from("order").delete().eq("id", orderId);
  } else {
    await supabase.from("order").delete().eq("userId", user.id).eq("productId", productId).eq("status", "cart");
  }

  notifyCartUpdate();
}

export async function syncGuestCartToAccount(): Promise<void> {
  // (Optional migration hook if you used localStorage previously)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || typeof window === "undefined") return;

  const legacyCart = localStorage.getItem("guest_jewelry_cart");
  if (!legacyCart) return;

  try {
    const guestItems: CartItem[] = JSON.parse(legacyCart);
    for (const item of guestItems) {
      await addToCart(item);
    }
    localStorage.removeItem("guest_jewelry_cart");
  } catch (e) {
    console.error("Error syncing legacy cart:", e);
  }
  notifyCartUpdate();
}