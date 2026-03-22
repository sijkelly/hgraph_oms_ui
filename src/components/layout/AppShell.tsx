import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import { registerShortcuts } from "@/lib/shortcuts";

export default function AppShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    return registerShortcuts((action) => {
      switch (action) {
        case "new-order":
          navigate("/orders");
          break;
        case "refresh":
          queryClient.invalidateQueries();
          break;
      }
    });
  }, [navigate, queryClient]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
