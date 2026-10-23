import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ConfirmDialog from "../ui/ConfirmDialog";
import { SidebarContext } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { loading } = useData();
  
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  
  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer or logout dialog is open
  useEffect(() => {
    document.body.style.overflow = open || confirmLogout ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, confirmLogout]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }


  const handleLogout = () => {
  setConfirmLogout(false);
  setOpen(false);
  logout();
  toast.success("Logged out safely.");
  navigate("/login");
};

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, confirmLogout, setConfirmLogout }}
    >
      <div className="flex min-h-screen">
        <Sidebar />

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out of AeroTrack?"
        description="You'll need to sign in again to access flight logs and fleet data."
        confirmLabel="Log out"
        cancelLabel="Stay"
        tone="danger"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </SidebarContext.Provider>
    
  );
}