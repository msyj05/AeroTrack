import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ConfirmDialog from "./ConfirmDialog";
import { SidebarContext } from "./SidebarContext";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setConfirmLogout(false);
    setOpen(false);
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