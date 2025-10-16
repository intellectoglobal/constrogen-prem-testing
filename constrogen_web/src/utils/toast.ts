import { ToastMessage } from "shared/utils/errorHandler";

/**
 * Simple toast notification system for web
 */
class ToastManager {
  private container: HTMLDivElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    if (typeof document === 'undefined') return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(this.container);
  }

  show(param: ToastMessage) {
    if (!this.container) this.createContainer();
    if (!this.container) return;

    const { toastType = "error", message = "" } = param;
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      min-width: 300px;
      max-width: 500px;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: ${this.getBackgroundColor(toastType)};
      color: white;
      animation: slideIn 0.3s ease-out;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const title = toastType === "error" ? "Error!" : toastType === "success" ? "Success" : "Info";
    
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.95;">${message}</div>
    `;

    this.container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (this.container && this.container.contains(toast)) {
          this.container.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case "success":
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      case "warning":
        return "#faad14";
      case "info":
        return "#1890ff";
      default:
        return "#ff4d4f";
    }
  }
}

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export const toast = new ToastManager();

export const showToast = (param: ToastMessage) => {
  toast.show(param);
};

