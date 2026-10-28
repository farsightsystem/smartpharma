"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  KeyRound, Store, DollarSign, ArrowDownUp, FileSpreadsheet, Lock,
  Printer, CheckCircle2, AlertTriangle, Coins, RefreshCw, PlusCircle,
  ArrowDownRight, ArrowUpRight, ShieldCheck, Plus, LogOut, Settings,
  ChevronDown
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { PosShift, CashDrop, XReportData, ZReportData } from "@/types";

interface PosShiftManagerProps {
  activeShift: PosShift | null | undefined;
  isLoading?: boolean;
}

const sectionVariants: any = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function PosShiftManager({ activeShift, isLoading }: PosShiftManagerProps) {
  const queryClient = useQueryClient();

  // Dialog states
  const [openShiftDialogOpen, setOpenShiftDialogOpen] = useState(false);
  const [cashDropDialogOpen, setCashDropDialogOpen] = useState(false);
  const [xReportDialogOpen, setXReportDialogOpen] = useState(false);
  const [closeShiftDialogOpen, setCloseShiftDialogOpen] = useState(false);
  const [zReportResultModalOpen, setZReportResultModalOpen] = useState(false);
  const [completedZReport, setCompletedZReport] = useState<ZReportData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Form states - Open Shift
  const [openingFloat, setOpeningFloat] = useState("500");
  const [openNotes, setOpenNotes] = useState("");

  // Form states - Cash Movement
  const [movementType, setMovementType] = useState<"DROP" | "PAYOUT" | "FLOAT_ADD">("DROP");
  const [movementAmount, setMovementAmount] = useState("");
  const [movementReason, setMovementReason] = useState("");

  // Form states - Close Shift
  const [actualCashInput, setActualCashInput] = useState("");
  const [closingNotes, setClosingNotes] = useState("");

  // Live X-Report Query
  const xReportQuery = useQuery({
    queryKey: ["shift-x-report", activeShift?.id],
    queryFn: () => (activeShift?.id ? api.shifts.getXReport(activeShift.id) : null),
    enabled: Boolean(activeShift?.id && (xReportDialogOpen || closeShiftDialogOpen)),
    staleTime: 0,
  });

  // Open Shift Mutation
  const openShiftMutation = useMutation({
    mutationFn: (data: { openingCash: number; notes?: string }) => api.shifts.open(data),
    onSuccess: (newShift) => {
      queryClient.invalidateQueries({ queryKey: ["active-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      setOpenShiftDialogOpen(false);
      setOpeningFloat("500");
      setOpenNotes("");
      toast.success(`Shift #${newShift.shiftNumber} opened successfully!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to open shift");
    },
  });

  // Cash Movement Mutation
  const cashDropMutation = useMutation({
    mutationFn: (data: { shiftId: string; type: "DROP" | "PAYOUT" | "FLOAT_ADD"; amount: number; reason: string }) =>
      api.shifts.drop(data),
    onSuccess: (drop) => {
      queryClient.invalidateQueries({ queryKey: ["active-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shift-x-report"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      setCashDropDialogOpen(false);
      setMovementAmount("");
      setMovementReason("");
      const labels = {
        DROP: "Safe drop recorded",
        PAYOUT: "Petty cash payout recorded",
        FLOAT_ADD: "Cash float added to drawer",
      };
      toast.success(labels[drop.type] || "Cash movement recorded");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to record cash movement");
    },
  });

  // Close Shift Mutation
  const closeShiftMutation = useMutation({
    mutationFn: (data: { shiftId: string; actualCash: number; closingNotes?: string }) =>
      api.shifts.close(data),
    onSuccess: async (zReport) => {
      queryClient.invalidateQueries({ queryKey: ["active-shift"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      setCloseShiftDialogOpen(false);
      setActualCashInput("");
      setClosingNotes("");
      setCompletedZReport(zReport);
      setZReportResultModalOpen(true);
      toast.success(`Shift #${zReport.shiftNumber} closed successfully!`);

      if (typeof window.printZReport === "function") {
        try {
          await window.printZReport(zReport);
        } catch {
          // ignore auto-print failure
        }
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to close shift");
    },
  });

  const handleOpenShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(openingFloat);
    if (isNaN(val) || val < 0) {
      toast.error("Please enter a valid opening float amount");
      return;
    }
    openShiftMutation.mutate({ openingCash: val, notes: openNotes.trim() });
  };

  const handleCashMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift?.id) return;
    const amount = parseFloat(movementAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!movementReason.trim()) {
      toast.error("Please provide a reason / reference for this movement");
      return;
    }
    cashDropMutation.mutate({
      shiftId: activeShift.id,
      type: movementType,
      amount,
      reason: movementReason.trim(),
    });
  };

  const handleCloseShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift?.id) return;
    const actual = parseFloat(actualCashInput);
    if (isNaN(actual) || actual < 0) {
      toast.error("Please enter the physical cash counted in drawer");
      return;
    }
    closeShiftMutation.mutate({
      shiftId: activeShift.id,
      actualCash: actual,
      closingNotes: closingNotes.trim(),
    });
  };

  const handlePrintXReport = async () => {
    if (!xReportQuery.data) return;
    if (typeof window.printXReport === "function") {
      const res = await window.printXReport(xReportQuery.data);
      if (res?.success) {
        toast.success("X-Report sent to printer");
      } else {
        toast.error(res?.error || "Failed to print X-Report");
      }
    } else {
      toast.error("Printer interface not available");
    }
  };

  const handlePrintZReport = async () => {
    if (!completedZReport) return;
    if (typeof window.printZReport === "function") {
      const res = await window.printZReport(completedZReport);
      if (res?.success) {
        toast.success("Z-Report sent to printer");
      } else {
        toast.error(res?.error || "Failed to print Z-Report");
      }
    } else {
      toast.error("Printer interface not available");
    }
  };

  const liveExpected = xReportQuery.data?.cashDrawerSummary?.expectedCashInDrawer ?? activeShift?.expectedCash ?? 0;
  const countedNum = parseFloat(actualCashInput || "0");
  const variance = !isNaN(countedNum) ? countedNum - liveExpected : 0;
  const varianceStatus = Math.abs(variance) < 0.01 ? "BALANCED" : variance > 0 ? "OVER" : "SHORT";

  const isShiftOpen = Boolean(activeShift && !isLoading);

  return (
    <>
      {/* ======================================================== */}
      {/* REGISTER STATUS (simplified - big clear state)           */}
      {/* ======================================================== */}
      {!isShiftOpen && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 dark:text-amber-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Register is closed</div>
              <div className="text-sm text-amber-700/80 dark:text-amber-300/80">
                Open a shift with an initial cash float before you can ring up sales.
              </div>
            </div>
          </div>
          <Button
            onClick={() => setOpenShiftDialogOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md h-10 px-5 rounded-md"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Open Register Now
          </Button>
        </motion.div>
      )}

      {/* Active Shift Status Bar (simple, clean) */}
      {activeShift && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-2 bg-surface border border-border rounded-md px-3 py-1.5 text-xs sm:text-sm shrink-0 flex-wrap"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Shift #{activeShift.shiftNumber}</span>
              <span className="text-text-secondary">({activeShift.cashierName || 'You'})</span>
            </div>

            <div className="h-3 w-[1px] bg-border hidden sm:block" />

            <div className="text-text-secondary hidden md:flex items-center gap-3">
              <span>
                Float: <strong className="text-text-primary font-mono">{formatCurrency(activeShift.openingCash)}</strong>
              </span>
              <span>
                Sales: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(activeShift.totalCashSales)}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Simple actions menu */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-8 px-2.5 text-xs border-border hover:bg-surface/50 gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>More</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Simple Actions Dropdown (only when shift is open) */}
      {isShiftOpen && menuOpen && (
        <div className="absolute bottom-[60px] left-3 right-3 bg-surface border border-border rounded-md shadow-lg p-1 z-50 text-xs w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <button
              onClick={() => { setMenuOpen(false); setXReportDialogOpen(true); }}
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-text-primary hover:bg-surface/50 transition-colors text-left cursor-pointer border-b sm:border-b-0 sm:border-r sm:border-border"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">X-Report</span>
              <span className="sm:hidden">X</span>
            </button>
            <button
              onClick={() => { setMenuOpen(false); setCashDropDialogOpen(true); }}
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-text-primary hover:bg-surface/50 transition-colors text-left cursor-pointer border-b sm:border-b-0 sm:border-r sm:border-border"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Cash Drop / Out</span>
              <span className="sm:hidden">Cash</span>
            </button>
            <button
              onClick={() => { setMenuOpen(false); setCloseShiftDialogOpen(true); setActualCashInput(""); setClosingNotes(""); }}
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Close Register (Z)</span>
              <span className="sm:hidden">Close</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: OPEN SHIFT */}
      <Dialog open={openShiftDialogOpen} onOpenChange={setOpenShiftDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <KeyRound className="w-5 h-5" />
              <DialogTitle>Open Register</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Enter the starting cash in your drawer to begin the shift.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOpenShiftSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="opening-float">Opening Cash Float</Label>
              <div className="relative">
                <Input
                  id="opening-float"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(e.target.value)}
                  className="font-mono text-base font-semibold pr-14"
                  placeholder="0.00"
                  autoFocus
                />
                <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-medium">SAR</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[0, 200, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setOpeningFloat(String(preset))}
                    className="px-2 py-0.5 text-xs rounded border border-border hover:bg-surface/50 transition-colors font-mono"
                  >
                    {preset === 0 ? "0 (Zero Float)" : `${preset} SAR`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="open-notes">Opening Notes (Optional)</Label>
              <Input
                id="open-notes"
                type="text"
                value={openNotes}
                onChange={(e) => setOpenNotes(e.target.value)}
                placeholder="e.g. Morning shift, small change ready"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenShiftDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={openShiftMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {openShiftMutation.isPending ? "Opening..." : "Open Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CASH MOVEMENTS */}
      <Dialog open={cashDropDialogOpen} onOpenChange={setCashDropDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
              <DialogTitle>Cash Drawer Movement</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Record cash taken out of or added to the register during this shift.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCashMovementSubmit} className="space-y-4 py-2">
            <Tabs value={movementType} onValueChange={(v) => setMovementType(v as any)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="DROP" className="text-xs">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  Safe Drop
                </TabsTrigger>
                <TabsTrigger value="PAYOUT" className="text-xs">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-1 text-rose-500" />
                  Petty Payout
                </TabsTrigger>
                <TabsTrigger value="FLOAT_ADD" className="text-xs">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Add Float
                </TabsTrigger>
              </TabsList>

              <div className="mt-3 p-2.5 rounded-lg bg-surface border border-border text-xs text-text-secondary">
                {movementType === "DROP" && (
                  <span>
                    <strong>Safe Drop:</strong> Move excess cash to the safe to reduce register liability.
                  </span>
                )}
                {movementType === "PAYOUT" && (
                  <span>
                    <strong>Petty Cash Payout:</strong> Cash paid out for store expenses (courier, supplies, etc.).
                  </span>
                )}
                {movementType === "FLOAT_ADD" && (
                  <span>
                    <strong>Add Float:</strong> Add extra change to the drawer from the safe.
                  </span>
                )}
              </div>
            </Tabs>

            <div className="space-y-1.5">
              <Label htmlFor="movement-amount">Amount</Label>
              <div className="relative">
                <Input
                  id="movement-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="font-mono text-base font-semibold pr-14"
                  placeholder="0.00"
                  autoFocus
                />
                <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-medium">SAR</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMovementAmount(String(preset))}
                    className="px-2 py-0.5 text-xs rounded border border-border hover:bg-surface/50 transition-colors font-mono"
                  >
                    {preset} SAR
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="movement-reason">Reason</Label>
              <Input
                id="movement-reason"
                type="text"
                required
                value={movementReason}
                onChange={(e) => setMovementReason(e.target.value)}
                placeholder={
                  movementType === "DROP"
                    ? "e.g. Excess cash to safe bag #042"
                    : movementType === "PAYOUT"
                      ? "e.g. Courier payment, Receipt #89"
                      : "e.g. Extra change from safe"
                }
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCashDropDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={cashDropMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {cashDropMutation.isPending ? "Recording..." : "Record Movement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: X-REPORT */}
      <Dialog open={xReportDialogOpen} onOpenChange={setXReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
              <DialogTitle>Shift X-Report</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Mid-shift summary of sales so far. Does not close the register.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="space-y-3">
            {xReportQuery.data ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Net Sales</span>
                  <span className="font-mono font-semibold">{formatCurrency(xReportQuery.data.salesSummary?.grossSales ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Cash Sales</span>
                  <span className="font-mono font-semibold text-emerald-600">{formatCurrency(xReportQuery.data.salesSummary?.cashSales?.amount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Card Sales</span>
                  <span className="font-mono font-semibold text-blue-600">{formatCurrency(xReportQuery.data.salesSummary?.cardSales?.amount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border/40 pt-2">
                  <span className="text-text-secondary">Expected Cash in Drawer</span>
                  <span className="font-mono font-semibold">{formatCurrency(xReportQuery.data.cashDrawerSummary?.expectedCashInDrawer ?? 0)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-text-secondary text-sm">
                Loading report…
              </div>
            )}
          </DialogContent>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { setXReportDialogOpen(false); }}>
              Done
            </Button>
            <Button onClick={handlePrintXReport}>
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: CLOSE SHIFT */}
      <Dialog open={closeShiftDialogOpen} onOpenChange={setCloseShiftDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Lock className="w-5 h-5" />
              <DialogTitle>Close Register</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Count the physical cash in your drawer to end the shift and print the Z-Report.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCloseShiftSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="actual-cash">Physical Cash Counted in Drawer</Label>
              <div className="relative">
                <Input
                  id="actual-cash"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(e.target.value)}
                  className="font-mono text-2xl font-bold pr-14"
                  placeholder="0.00"
                  autoFocus
                />
                <span className="absolute right-3 top-3 text-xs text-text-secondary font-medium">SAR</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-secondary">Expected in drawer:</span>
                <span className="text-xs font-mono font-semibold text-text-primary">{formatCurrency(liveExpected)}</span>
              </div>
              {variance !== 0 && (
                <div className="flex items-center gap-1 mt-1 px-2 py-1 rounded-lg text-xs font-medium">
                  {varianceStatus === "BALANCED" ? (
                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Balanced
                    </span>
                  ) : varianceStatus === "OVER" ? (
                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <PlusCircle className="w-3 h-3 mr-1" /> Over by {formatCurrency(variance)}
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Short by {formatCurrency(Math.abs(variance))}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="closing-notes">Closing Notes (Optional)</Label>
              <Textarea
                id="closing-notes"
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                placeholder="e.g. Found extra 50 SAR note, balanced"
                className="h-24"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCloseShiftDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={closeShiftMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {closeShiftMutation.isPending ? "Closing…" : "Close Register & Print Z-Report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: Z-REPORT RESULT */}
      <Dialog open={zReportResultModalOpen} onOpenChange={setZReportResultModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <DialogTitle>Shift Closed</DialogTitle>
            </div>
            <DialogDescription className="text-sm">
              Your Z-Report is ready. It has been sent to the printer automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="space-y-3">
            {completedZReport && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shift #</span>
                  <span className="font-mono font-semibold">{completedZReport.shiftNumber}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border/40 pt-2">
                  <span className="text-text-secondary">Net Sales</span>
                  <span className="font-mono font-semibold">{formatCurrency(completedZReport.salesSummary?.grossSales ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Cash in Drawer</span>
                  <span className="font-mono font-semibold">{formatCurrency(completedZReport.actualCash)}</span>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogFooter className="pt-2">
            <Button onClick={handlePrintZReport}>
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Reprint Z-Report
            </Button>
            <Button type="button" variant="outline" onClick={() => setZReportResultModalOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}