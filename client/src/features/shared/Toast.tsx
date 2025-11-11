import { Toast } from "radix-ui";
import { useState, useCallback } from "react";
import "./toast.css";
import { ToastContext } from "./hooks";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "error" | "success" | "info";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: "error" | "success" | "info" = "info",
    ) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, title, description, type }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            className={`toast-root toast-${toast.type}`}
            onOpenChange={(open) => !open && removeToast(toast.id)}
          >
            <Toast.Title className="toast-title">{toast.title}</Toast.Title>
            {toast.description && (
              <Toast.Description className="toast-description">
                {toast.description}
              </Toast.Description>
            )}
            <Toast.Close className="toast-close">×</Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="toast-viewport" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
