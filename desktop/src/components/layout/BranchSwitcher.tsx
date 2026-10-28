import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { Branch } from "@/types";

const BRANCH_KEY = "pharma360_selected_branch";

export default function BranchSwitcher() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadBranches() {
      setIsLoading(true);
      try {
        const data = await api.branches.list();
        setBranches(data);
        if (!selectedBranchId && data.length > 0) {
          const current = user?.branchId || data[0]?.id;
          setSelectedBranchId(current);
          localStorage.setItem(BRANCH_KEY, current);
        } else if (selectedBranchId === "") {
          const saved = localStorage.getItem(BRANCH_KEY);
          if (saved) setSelectedBranchId(saved);
        }
      } catch {
        // Silent fail - branches may not be configured yet
      } finally {
        setIsLoading(false);
      }
    }
    loadBranches();
  }, [user?.branchId, selectedBranchId]);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const handleSelect = async (branchId: string) => {
    setSelectedBranchId(branchId);
    setIsOpen(false);
    localStorage.setItem(BRANCH_KEY, branchId);
    // Reload to apply branch context across the app
    window.location.reload();
  };

  if (isLoading || branches.length === 0) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer rounded-md",
          "hover:bg-surface/50 border border-transparent hover:border-border/40"
        )}
      >
        <span className="truncate max-w-[120px]">
          {selectedBranch?.name || user?.branchName || "Main Branch"}
        </span>
        <ChevronDown className="h-3 w-3 shrink-0 opacity-70 transition-transform duration-200" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-72 bg-surface border border-border rounded-md shadow-xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-border/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary/60">
                Select Branch
              </p>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer",
                    branch.id === selectedBranchId
                      ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  )}
                >
                  {branch.id === selectedBranchId && (
                    <span className="w-3 h-3 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  )}
                  <span className="truncate flex-1">{branch.name}</span>
                  {branch.address && (
                    <span className="text-[10px] text-text-secondary/50 ml-auto whitespace-nowrap">
                      {branch.address}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}