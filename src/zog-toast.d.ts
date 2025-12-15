/**
 * Available positions for the toast container.
 */
export type ToastPosition = 
    | 'top-right' 
    | 'top-left' 
    | 'top-center' 
    | 'bottom-right' 
    | 'bottom-left' 
    | 'bottom-center';

/**
 * Configuration options for the ZogToast plugin.
 */
export interface ToastOptions {
    /**
     * Position of the toast notifications on the screen.
     * @default 'bottom-right'
     */
    position?: ToastPosition;

    /**
     * Default duration in milliseconds before a toast is auto-dismissed.
     * Set to 0 to disable auto-dismiss.
     * @default 3000
     */
    defaultDuration?: number;
}

/**
 * The Toast API methods available globally.
 */
export interface ToastApi {
    /**
     * Adds a generic toast notification.
     * @param message The text to display.
     * @param type The style of the toast ('success', 'error', 'warning', 'info').
     * @param duration Optional duration in ms.
     */
    add(message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number): void;

    /**
     * Shows a success notification (Green).
     */
    success(message: string, duration?: number): void;

    /**
     * Shows an error notification (Red).
     */
    error(message: string, duration?: number): void;

    /**
     * Shows a warning notification (Yellow).
     */
    warning(message: string, duration?: number): void;

    /**
     * Shows an informational notification (Blue).
     */
    info(message: string, duration?: number): void;
}

/**
 * The global instance of the Toast API.
 */
export const $toast: ToastApi;

/**
 * The ZogToast plugin object to be used with app.use().
 */
export const ZogToast: {
    /**
     * Installs the toast plugin.
     * @param api The Zog app instance.
     * @param options Plugin configuration options.
     */
    install(api: any, options?: ToastOptions): void;
};

// Global augmentation to allow window.$toast
declare global {
    interface Window {
        $toast: ToastApi;
    }
}
