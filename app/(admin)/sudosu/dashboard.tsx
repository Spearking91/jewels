import {
  Calendar,
  ChevronDown,
  Plus,
  TrendingUp,
  TrendingDown,
  Paperclip,
  Microphone,
  DotsHorizontalRounded,
  Building,
  StoreAlt,
  Truck,
  ArrowDownLeftStrokeSquare,
  ExpandLeft,
  CaretBigRight,
  Eye,
  Group,
  CursorPointer,
  ShoppingBag,
} from "@boxicons/react";

import Statcard from "@/components/statcard";
import LinegraphProduct from "@/components/linegraphproduct";
import Simplecard from "@/components/simplecard";
import BarchartDays from "@/components/barchart";
import Gaugechart from "@/components/gaugechart";
import { Card, ProductList } from "@/lib/db";
import { supabase } from "@/utils/supabase";
import { connection } from "next/server";

// Ensure Vercel always fetches fresh analytics on request
export const dynamic = "force-dynamic";

const profitData = [
  { date: "1 Jan", current: 4000, previous: 3800 },
  { date: "4 Jan", current: 3900, previous: 3600 },
  { date: "8 Jan", current: 8500, previous: 5200 },
  { date: "12 Jan", current: 7200, previous: 6100 },
  { date: "15 Jan", current: 12324, previous: 5563 },
  { date: "22 Jan", current: 9800, previous: 7100 },
  { date: "29 Jan", current: 13500, previous: 8900 },
];

const barData = [
  { day: "Sun", value: 3200 },
  { day: "Mon", value: 4500 },
  { day: "Tue", value: 8162, highlight: true },
  { day: "Wed", value: 3100 },
  { day: "Thu", value: 2400 },
  { day: "Fri", value: 5200 },
  { day: "Sat", value: 4100 },
];

const gaugeData = [
  { name: "Progress", value: 68, fill: "#10b981" },
  { name: "Remaining", value: 32, fill: "#f3f4f6" },
];

const simple = [
  { title: "Retailers", value: "2,884", Icon: StoreAlt },
  { title: "Distributors", value: "1,432", Icon: Truck, color: "success" },
  { title: "Wholesalers", value: "562", Icon: Building, color: "warning" },
];

// Helper to calculate percentage change safely
function calcGrowth(current: number, previous: number) {
  if (previous === 0)
    return { pct: current > 0 ? "100%" : "0%", isPositive: true };
  const diff = ((current - previous) / previous) * 100;
  return {
    pct: `${Math.abs(diff).toFixed(1)}%`,
    isPositive: diff >= 0,
  };
}

// Fetch live analytics & product stats on the server
async function getDashboardMetrics() {
  await connection(); // <-- 2. Await connection here to declare this as a dynamic request-time call

  const now = new Date();
  const threeMinsAgo = new Date(now.getTime() - 3 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const sixtyDaysAgo = new Date(
    now.getTime() - 60 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [onlineRes, recentEventsRes, productsRes] = await Promise.all([
    // 1. Active sessions in last 3 minutes
    supabase
      .from("site_analytics")
      .select("session_id")
      .gte("created_at", threeMinsAgo),

    // 2. Last 60 days of analytics to compare current 30d vs previous 30d
    supabase
      .from("site_analytics")
      .select("session_id, event_type, created_at")
      .gte("created_at", sixtyDaysAgo),

    // 3. Products for low stock & total stock count
    supabase
      .from("products")
      .select("*")
      .order("quantity", { ascending: true }),
  ]);

  // --- Calculate Online Now ---
  const onlineSessions = new Set(
    (onlineRes.data ?? []).map((row) => row.session_id),
  );
  const currentlyOnline = onlineSessions.size;

  // --- Calculate 30d vs Previous 30d Visitors & Page Views ---
  const events = recentEventsRes.data ?? [];
  const currentVisitors = new Set<string>();
  const prevVisitors = new Set<string>();
  let currentViews = 0;
  let prevViews = 0;

  for (const ev of events) {
    const isCurrentPeriod = ev.created_at >= thirtyDaysAgo;
    if (isCurrentPeriod) {
      currentVisitors.add(ev.session_id);
      if (ev.event_type === "pageview") currentViews++;
    } else {
      prevVisitors.add(ev.session_id);
      if (ev.event_type === "pageview") prevViews++;
    }
  }

  const visitorGrowth = calcGrowth(currentVisitors.size, prevVisitors.size);
  const viewGrowth = calcGrowth(currentViews, prevViews);

  // --- Products & Low Stock ---
  const allProducts = (productsRes.data as ProductList[]) ?? [];
  const totalStock = allProducts.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  const lowStockProducts = allProducts
    .filter((item) => Number(item.quantity) < 10)
    .slice(0, 5);

  // Build dynamic cards
  const cards: Card[] = [
    {
      title: "Users Currently Online",
      value: currentlyOnline.toLocaleString(),
      description: "Active in last 3 mins",
      stat: "Live",
      isPositive: true,
      MainIcon: Eye,
      SecondaryIcon: TrendingUp,
    },
    {
      title: "Visitors (30d)",
      value: currentVisitors.size.toLocaleString(),
      description: `vs. ${prevVisitors.size.toLocaleString()} last period`,
      stat: visitorGrowth.pct,
      isPositive: visitorGrowth.isPositive,
      MainIcon: Group,
      SecondaryIcon: visitorGrowth.isPositive ? TrendingUp : TrendingDown,
    },
    {
      title: "Page Views (30d)",
      value: currentViews.toLocaleString(),
      description: `vs. ${prevViews.toLocaleString()} last period`,
      stat: viewGrowth.pct,
      isPositive: viewGrowth.isPositive,
      MainIcon: CursorPointer,
      SecondaryIcon: viewGrowth.isPositive ? TrendingUp : TrendingDown,
    },
    {
      title: "Total Inventory Units",
      value: totalStock.toLocaleString(),
      description: `Across ${allProducts.length} products`,
      stat: `${lowStockProducts.length} low stock`,
      isPositive: lowStockProducts.length === 0,
      MainIcon: ShoppingBag,
      SecondaryIcon: lowStockProducts.length === 0 ? TrendingUp : TrendingDown,
    },
  ];

  return { cards, lowStockProducts };
}

export default async function Dashboard() {
  const { cards, lowStockProducts } = await getDashboardMetrics();

  return (
    <div className="p-6 bg-base-200/50 min-h-screen space-y-6 text-base-content font-sans">
      {/* --- Top Header & Action Controls --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-2 bg-base-100">
            <Calendar className="w-4 h-4 text-base-content/60" />
            <span>Last 30 Days</span>
          </div>

          {/* <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-2 bg-base-100"
            >
              <span>Last 30 days</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </div>
          </div> */}
          {/* 
          <button className="btn btn-sm btn-outline border-base-300 normal-case font-normal gap-1 bg-base-100">
            <Plus className="w-4 h-4" />
            Add widget
          </button> */}
          <button className="btn btn-sm btn-primary normal-case font-medium gap-1 ">
            <ArrowDownLeftStrokeSquare className="w-4 h-4" />
            Export
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
            SecondaryIcon={card.SecondaryIcon}
            stat={card.stat}
            isPositive={card.isPositive}
          />
        ))}
      </div>

      {/* --- Main Dashboard Body Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Total Profit Area Chart */}
          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold">Total Profit</h2>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-extrabold tracking-tight">
                $446.7K
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="badge badge-success/15 text-success text-xs font-semibold border-0">
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" /> 24.4%
                </span>
                <span className="text-xs text-base-content/50">
                  vs. last period
                </span>
              </div>
            </div>

            <LinegraphProduct profitData={profitData} />
            <div className="mt-6 pt-6 border-t border-base-200">
              <div className="text-xs font-bold text-base-content/70 mb-3">
                Customers
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {simple.map((item, index) => (
                  <Simplecard
                    key={index}
                    title={item.title}
                    Icon={item.Icon}
                    value={item.value}
                    color={item.color as any}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Products Table */}
          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold">Low Stock Products</h2>
              <button className="btn btn-ghost btn-xs btn-circle">
                <DotsHorizontalRounded className="w-4 h-4 text-base-content/50" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="text-xs text-base-content/50 uppercase border-b border-base-200">
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Selling Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-xs text-base-content/50"
                      >
                        No low stock products found.
                      </td>
                    </tr>
                  ) : (
                    lowStockProducts.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-base-200/40 border-b border-base-200/50"
                      >
                        <td className="text-xs text-base-content/60 font-mono">
                          {item.id.slice(0, 8)}...
                        </td>
                        <td>
                          <div className="flex items-center gap-2 max-w-xs">
                            <div className="avatar">
                              <div className="w-8 h-8 rounded-lg bg-base-200 border border-base-300/50">
                                {item.imageUrl && item.imageUrl.length > 0 ? (
                                  <img
                                    src={item.imageUrl[0]}
                                    alt={item.title}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full text-[9px] text-base-content/40">
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-base-content truncate block">
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span className="text-[10px] text-base-content/60 truncate block">
                                  {item.subtitle}
                                </span>
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
                          <span
                            className={`badge badge-sm font-semibold ${
                              Number(item.quantity) <= 5
                                ? "badge-error/15 text-error"
                                : Number(item.quantity) <= 20
                                  ? "badge-warning/15 text-warning"
                                  : "badge-success/15 text-success"
                            }`}
                          >
                            {item.quantity} left
                          </span>
                        </td>
                        <td className="text-xs font-bold text-emerald-600 font-mono">
                          GH₵{Number(item.selling_price).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Section (1 Column) */}
        <div className="space-y-6">
          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-bold">Most Day Active</h2>
              <button className="btn btn-ghost btn-xs btn-circle">
                <DotsHorizontalRounded className="w-4 h-4 text-base-content/50" />
              </button>
            </div>
            <BarchartDays barData={barData} />
          </div>

          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60 text-center">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-bold">Repeat Customer Rate</h2>
              <button className="btn btn-ghost btn-xs btn-circle">
                <DotsHorizontalRounded className="w-4 h-4 text-base-content/50" />
              </button>
            </div>
            <Gaugechart gaugeData={gaugeData} />
          </div>

          <div className="card bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200/60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold">AI Assistant</h2>
              <button className="btn btn-ghost btn-xs btn-circle">
                <ExpandLeft className="w-3.5 h-3.5 text-base-content/50" />
              </button>
            </div>

            <div className="h-28 flex items-center justify-center my-2">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-300 shadow-lg shadow-blue-500/40 animate-pulse">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
              </div>
            </div>

            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="input input-sm input-bordered w-full pr-16 pl-8 rounded-full text-xs bg-base-200/40 focus:outline-none"
              />
              <Paperclip className="w-3.5 h-3.5 absolute left-3 top-2.5 text-base-content/40 cursor-pointer" />
              <div className="absolute right-1.5 top-1 flex items-center gap-1">
                <button className="btn btn-xs btn-circle btn-ghost">
                  <Microphone className="w-3.5 h-3.5 text-base-content/50" />
                </button>
                <button className="btn btn-xs btn-circle btn-primary text-white">
                  <CaretBigRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
