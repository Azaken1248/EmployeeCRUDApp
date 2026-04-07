import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: faCircleCheck,
    className: "toast-success",
  },
  error: {
    icon: faCircleExclamation,
    className: "toast-error",
  },
  warning: {
    icon: faTriangleExclamation,
    className: "toast-warning",
  },
  info: {
    icon: faCircleInfo,
    className: "toast-info",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextToastId = useRef(0);

  const dismiss = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const show = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = 3500,
    }) => {
      if (!title && !message) {
        return null;
      }

      const id = nextToastId.current;
      nextToastId.current += 1;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      if (duration > 0 && typeof window !== "undefined") {
        window.setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const toasterApi = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, title = "Success", options = {}) =>
        show({
          type: "success",
          title,
          message,
          ...options,
        }),
      error: (message, title = "Action failed", options = {}) =>
        show({
          type: "error",
          title,
          message,
          ...options,
        }),
      warning: (message, title = "Check required fields", options = {}) =>
        show({
          type: "warning",
          title,
          message,
          ...options,
        }),
      info: (message, title = "Heads up", options = {}) =>
        show({
          type: "info",
          title,
          message,
          ...options,
        }),
    }),
    [dismiss, show],
  );

  return (
    <ToastContext.Provider value={toasterApi}>
      {children}

      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const toastMeta = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

          return (
            <article key={toast.id} className={`toast-card ${toastMeta.className}`}>
              <span className="toast-icon">
                <FontAwesomeIcon icon={toastMeta.icon} />
              </span>

              <div className="toast-copy">
                {toast.title ? <p className="toast-title">{toast.title}</p> : null}
                {toast.message ? <p className="toast-message">{toast.message}</p> : null}
              </div>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="toast-dismiss"
                aria-label="Dismiss notification"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </article>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToaster = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToaster must be used inside ToastProvider.");
  }

  return context;
};
