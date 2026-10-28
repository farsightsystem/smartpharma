"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Plus, Printer, UserPlus, Settings, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SetupTask {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: any;
  done: boolean;
}

export default function SetupChecklist() {
  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const [pending, setPending] = useState(false);
  const [tasks, setTasks] = useState<SetupTask[]>([
    {
      id: "products",
      title: "Add your first product",
      subtitle: "Build your medicine catalog so you can start selling",
      href: "/products",
      icon: Plus,
      done: false,
    },
    {
      id: "printer",
      title: "Connect receipt printer",
      subtitle: "Print invoices and receipts for customers",
      href: "/settings",
      icon: Printer,
      done: false,
    },
    {
      id: "staff",
      title: "Add staff members",
      subtitle: "Create accounts for your pharmacy team",
      href: "/users",
      icon: UserPlus,
      done: false,
    },
    {
      id: "settings",
      title: "Set tax rate & currency",
      subtitle: "Configure your pharmacy's operating settings",
      href: "/settings",
      icon: Settings,
      done: false,
    },
    {
      id: "email",
      title: "Verify email address",
      subtitle: "Enable password recovery and notifications",
      href: "/settings",
      icon: Mail,
      done: false,
    },
  ]);

  useEffect(() => {
    const setupPending = localStorage.getItem("pharma360_setup_pending") === "true";
    setPending(setupPending);
    if (setupPending) {
      // Check which tasks might already be done via API data could go here
      // For now, mark all as pending
    }
  }, []);

  const completeSetup = () => {
    localStorage.removeItem("pharma360_setup_pending");
    setPending(false);
  };

  if (!pending) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-accent/5 border border-accent/20 rounded-lg shadow-sm"
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-0 border-0">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <AlertCircle className="h-4 w-4 text-accent" />
            Complete your pharmacy setup
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={completeSetup}
            className="text-xs text-text-secondary"
          >
            I'll do this later
          </Button>
        </CardHeader>
        <CardContent className="pt-0 px-0 pb-0">
          <div className="space-y-2 px-4 pb-4">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => navigate(task.href)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-md border border-border/50 bg-surface hover:bg-surface-2 hover:border-accent/30 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center border border-accent/20 bg-accent/5">
                    <task.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary leading-tight">{task.title}</p>
                    <p className="text-xs text-text-secondary/70 leading-tight">{task.subtitle}</p>
                  </div>
                  <CheckCircle2 className="h-3 w-3 text-text-secondary/40" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}