import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ToastBanner from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const counter = useRef(0);

  const show = useCallback((message, tone = "success") => {
    counter.current += 1;
    setToast({ id: counter.current, message, tone });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  const value = useMemo(() => ({ show, hide, toast }), [show, hide, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastBanner toast={toast} onHide={hide} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext) ?? { show: () => {}, hide: () => {}, toast: null };
}
