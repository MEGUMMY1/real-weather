import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Icon, type IconList } from "./Icon";
import { ToastContext } from "./ToastContext";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
}

const ToastItem = ({ toast }: ToastItemProps) => {
  const getToastStyles = () => {
    switch (toast.type || "info") {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getIcon = (): IconList => {
    switch (toast.type || "info") {
      case "success":
        return "check";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <div
      className={`${getToastStyles()} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[90vw] pointer-events-auto animate-slideDown`}
      role="alert"
    >
      <Icon icon={getIcon()} size="sm" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
    </div>
  );
};
