import { createContext, useContext } from "react";

interface SidebarCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  confirmLogout: boolean;
  setConfirmLogout: (v: boolean) => void;
}

export const SidebarContext = createContext<SidebarCtx>({
  open: false,
  setOpen: () => {},
  confirmLogout: false,
  setConfirmLogout: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
