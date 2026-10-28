"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShoppingCart, FileText, Package, Boxes, Users, CreditCard,
  Factory, Building2, Tags, Undo2, Wallet, BarChart3, Receipt, Barcode, Settings,
  LogOut, PanelLeftClose, BrainCircuit, ListChecks, MessageSquare, ShieldCheck, Activity, ScanLine,
  UserCog, KeyRound, Store, Globe, ChevronDown, MoreVertical, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { JOB_ROLE_LABELS } from "@/types";
import { api } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  roles?: string[];
}

interface NavPartition {
  key: string;
  label: string;
  icon: any;
  items: NavItem[];
  direct?: boolean;
}

const tenantNavPartitions: NavPartition[] = [
  {
    key: "home",
    label: "Home",
    icon: LayoutDashboard,
    items: [
      { href: "/dashboard", label: "Analytics & Overview", icon: LayoutDashboard },
      { href: "/reports", label: "Financial Reports", icon: BarChart3, badge: "Beta", badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    ],
    direct: true,
  },
  {
    key: "services",
    label: "Services",
    icon: ShoppingCart,
    items: [
      { href: "/pos", label: "Point of Sale", icon: ShoppingCart },
      { href: "/dispensing", label: "Dispensing & Rx", icon: FileText },
      { href: "/invoices", label: "Invoices", icon: Receipt },
      { href: "/returns", label: "Returns", icon: Undo2 },
      { href: "/customers", label: "Customers & Patients", icon: Users },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: CreditCard,
    items: [
      { href: "/arrears", label: "Customer Arrears", icon: CreditCard },
      { href: "/expenses", label: "Expenses", icon: Wallet },
      { href: "/billing", label: "Subscription & Billing", icon: CreditCard, roles: ["admin", "owner"] },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Boxes,
    items: [
      { href: "/products", label: "Products Master", icon: Package },
      { href: "/stock", label: "Purchasing", icon: Boxes },
      { href: "/inventory", label: "Inventory & Batches", icon: ScanLine },
      { href: "/barcodes", label: "Barcodes", icon: Barcode },
      { href: "/distributors", label: "Distributors", icon: Factory },
      { href: "/companies", label: "Companies", icon: Building2 },
      { href: "/categories", label: "Categories", icon: Tags },
    ],
  },
  {
    key: "ai",
    label: "AI Copilot",
    icon: BrainCircuit,
    items: [
      { href: "/ai", label: "AI Overview", icon: BrainCircuit },
      { href: "/ai/recommendations", label: "AI Recommendations", icon: ListChecks },
      { href: "/ai/chat", label: "AI Chat Assistant", icon: MessageSquare },
      { href: "/ai/approvals", label: "AI Approvals", icon: ShieldCheck },
      { href: "/ai/activity", label: "AI Audit Log", icon: Activity },
    ],
  },
  {
    key: "config",
    label: "Configuration",
    icon: Settings,
    items: [
      { href: "/users", label: "Team & Staff", icon: UserCog, roles: ["admin", "owner"] },
      { href: "/roles", label: "Roles & Permissions", icon: KeyRound, roles: ["admin", "owner"] },
      { href: "/branches", label: "Branches", icon: Store, roles: ["admin", "owner", "manager"] },
      { href: "/settings/ai", label: "LLM Providers", icon: BrainCircuit, roles: ["admin", "owner"] },
      { href: "/settings", label: "System Settings", icon: Settings },
    ],
  },
];

const platformNavPartitions: NavPartition[] = [
  {
    key: "platform",
    label: "Platform",
    icon: Globe,
    items: [
      { href: "/platform", label: "Registered Pharmacies", icon: Globe },
      { href: "/platform", label: "Subscriptions", icon: CreditCard },
    ],
  },
];

function filterItems(items: NavItem[], user: { role?: string; jobRole?: string } | null): NavItem[] {
  const currentRole = (user?.role || "admin").toLowerCase();
  const currentJob = (user?.jobRole || "").toLowerCase();
  return items.filter((item) => {
    if (!item.roles) return true;
    if (currentRole === "admin" || currentRole === "owner") return true;
    if (item.roles.includes(currentRole)) return true;
    if (currentJob && item.roles.includes(currentJob)) return true;
    return false;
  });
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [posWindowCount, setPosWindowCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drillDown, setDrillDown] = useState<NavPartition | null>(null);

  const isPlatform = user?.role === "platform";

  const partitions = useMemo(() => {
    if (isPlatform) return platformNavPartitions;
    return tenantNavPartitions.map((p) => ({
      ...p,
      items: filterItems(p.items, user),
    })).filter((p) => p.items.length > 0);
  }, [isPlatform, user?.role, user?.jobRole]);

  const activePartition = useMemo(() => {
    if (drillDown) return drillDown;
    return partitions.find((p) =>
      p.items.some((item) =>
        pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
      )
    ) ?? null;
  }, [drillDown, partitions, pathname]);

  const isHomeView = !drillDown;

  const fetchWindowCount = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.getPosWindowCount) {
        const count = await window.getPosWindowCount();
        setPosWindowCount(count);
      }
    } catch {}
  }, []);

  const fetchPendingApprovals = useCallback(async () => {
    try {
      const orders = await api.purchaseOrders.list({ status: "PENDING_APPROVAL" });
      setPendingApprovals(orders?.length ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchWindowCount();
  }, [fetchWindowCount]);

  useEffect(() => {
    if (isPlatform) return;
    fetchPendingApprovals();
    const interval = setInterval(fetchPendingApprovals, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingApprovals, isPlatform]);

  const handlePartitionClick = (partition: NavPartition) => {
    if (partition.direct) {
      router.push(partition.items[0].href);
    }
    setDrillDown(partition);
  };

  const handleItemClick = (href: string) => {
    router.push(href);
  };

  const handleBackToHome = () => {
    setDrillDown(null);
  };

  return (
    <aside
      className={cn(
        "h-full bg-surface flex flex-col shrink-0 transition-all duration-300 ease-out relative select-none border-r border-border/80 z-20",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div
        onClick={handleBackToHome}
        className={cn(
          "flex items-center h-16 relative border-b border-border/60 transition-all cursor-pointer hover:bg-surface-2/40",
          collapsed ? "justify-center px-2" : "px-4 justify-between"
        )}
      >
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex items-center justify-center h-16 w-16 shrink-0">
            <Image
              src="/logo.png"
              alt="Pharma 360"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: "0" }}
                className="min-w-0 overflow-hidden text-left"
              >
                <p className="text-lg font-bold text-text-primary truncate tracking-tight leading-tight">
                  {isPlatform ? "Platform Console" : <>Pharma<span className="text-primary">360</span></>}
                </p>
                {isHomeView && (
                  <p className="text-xs text-text-secondary/70 truncate mt-0.5">
                    Home • {partitions.length} sections
                  </p>
                )}
                {!isHomeView && activePartition && (
                  <p className="text-xs text-text-secondary/70 truncate mt-0.5">
                    {activePartition.label}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!collapsed && !isHomeView && (
          <ChevronLeft
            className="h-4 w-4 text-text-secondary hover:text-primary transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); handleBackToHome(); }}
          />
        )}

        
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin" data-sidebar>

        {isHomeView ? (
          <>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-text-secondary/60 select-none"
                >
                  Pharmacy
                </motion.p>
              )}
            </AnimatePresence>

            {partitions.map((partition) => {
              const isActive = activePartition?.key === partition.key;
              const Icon = partition.icon;
              return (
                <button
                  key={partition.key}
                  onClick={() => handlePartitionClick(partition)}
                  className={cn(
                    "group relative flex items-center w-full rounded-md transition-all duration-150 cursor-pointer",
                    collapsed ? "justify-center h-9" : "gap-3 px-3 h-10",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                  )}
                  title={collapsed ? partition.label : undefined}
                >
                  <Icon
                    className={cn(
                      "shrink-0 h-4 w-4",
                      isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium truncate flex-1 text-left"
                      >
                        {partition.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {partition.direct ? (
                    <ChevronRight className="h-3 w-3 shrink-0 text-text-secondary/40 group-hover:text-text-primary" />
                  ) : (
                    <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform duration-200", isActive && "rotate-180")} />
                  )}
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 mb-3">
              <ChevronLeft
                className="h-4 w-4 text-text-secondary hover:text-primary transition-colors cursor-pointer mr-1"
                onClick={handleBackToHome}
              />
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {activePartition?.label}
              </span>
            </div>

            {activePartition?.items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className={cn(
                    "group relative flex items-center w-full rounded-md transition-all duration-150 cursor-pointer",
                    collapsed ? "justify-center h-9" : "gap-3 px-3 h-9",
                    isActive
                      ? "bg-surface-2 text-text-primary font-semibold shadow-2xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2/60"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "shrink-0 h-4 w-4",
                      isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs truncate flex-1 text-left"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.2 rounded-full border",
                        item.badgeColor || "bg-primary/10 text-primary border-primary/20"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.href === "/ai/approvals" && pendingApprovals > 0 && (
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold h-4 min-w-4 px-1 border border-amber-500/30",
                        collapsed ? "absolute top-1 right-1" : "ml-auto"
                      )}
                    >
                      {pendingApprovals}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t border-border/70 p-3 relative bg-surface-2/30">
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "flex items-center rounded-md p-2 hover:bg-surface-2 transition-colors cursor-pointer",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : "SP"}
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: "0" }}
                  className="min-w-0 overflow-hidden text-left"
                >
                  <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {isPlatform ? "Platform Admin" : "Pharma 360 Central"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!collapsed && (
            <MoreVertical className="h-3.5 w-3.5 text-text-secondary opacity-60 hover:opacity-100" />
          )}
        </div>

        {menuOpen && !collapsed && (
          <div className="absolute bottom-16 left-3 right-3 bg-surface border border-border rounded-md shadow-lg p-1.5 space-y-1 z-50 text-xs">
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/change-password");
              }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-text-primary hover:bg-surface-2 transition-colors text-left cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-text-secondary" />
              Change Password
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/settings");
              }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-text-primary hover:bg-surface-2 transition-colors text-left cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-text-secondary" />
              Preferences
            </button>
            <div className="border-t border-border my-1" />
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer font-medium"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-16 h-6 w-6 rounded-full border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-200 z-30 shadow-xs cursor-pointer",
          "hover:scale-105 active:scale-95",
          collapsed && "rotate-180"
        )}
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose className="h-3 w-3" />
      </button>
    </aside>
  );
}