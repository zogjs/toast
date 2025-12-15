/**
 * ZogToast - Advanced notification system with positioning support.
 * 
 * - Position control via options: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
 */

// Icons (unchanged)
const ICONS = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

const STYLES = `
/* Base Container */
.z-toast-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
    pointer-events: none;
    transition: all 0.3s ease;
}

/* Positioning Classes */
.z-pos-top-right { top: 20px; right: 20px; align-items: flex-end; }
.z-pos-bottom-right { bottom: 20px; right: 20px; align-items: flex-end; }
.z-pos-top-left { top: 20px; left: 20px; align-items: flex-start; }
.z-pos-bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }

/* Center Positioning (Requires transform for centering) */
.z-pos-top-center { top: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
.z-pos-bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; }

/* Toast Item */
.z-toast {
    display: flex;
    align-items: center;
    min-width: 300px;
    max-width: 450px;
    padding: 12px 16px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid transparent;
    pointer-events: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    
    /* Prepare for transition */
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Icons & Colors */
.z-toast-icon { width: 20px; height: 20px; margin-right: 12px; flex-shrink: 0; }
.z-toast-success { border-left-color: #10b981; } .z-toast-success .z-toast-icon { color: #10b981; }
.z-toast-error { border-left-color: #ef4444; } .z-toast-error .z-toast-icon { color: #ef4444; }
.z-toast-warning { border-left-color: #f59e0b; } .z-toast-warning .z-toast-icon { color: #f59e0b; }
.z-toast-info { border-left-color: #3b82f6; } .z-toast-info .z-toast-icon { color: #3b82f6; }

/* Dynamic Entry Animations based on Position */
/* Right Side: Slide from Right */
.z-pos-top-right .z-toast, .z-pos-bottom-right .z-toast { transform: translateX(30px); }

/* Left Side: Slide from Left */
.z-pos-top-left .z-toast, .z-pos-bottom-left .z-toast { transform: translateX(-30px); }

/* Center: Slide from Top or Bottom */
.z-pos-top-center .z-toast { transform: translateY(-30px); }
.z-pos-bottom-center .z-toast { transform: translateY(30px); }

/* Visible State (Reset Transform) */
.z-toast.z-toast-visible {
    opacity: 1;
    transform: translate(0, 0) !important;
}
`;

const injectStyles = () => {
    if (document.getElementById('z-toast-styles')) return;
    const s = document.createElement('style');
    s.id = 'z-toast-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
};

// Global API export
export const $toast = {
    add: () => {},
    success: (m, d) => $toast.add(m, 'success', d),
    error: (m, d) => $toast.add(m, 'error', d),
    warning: (m, d) => $toast.add(m, 'warning', d),
    info: (m, d) => $toast.add(m, 'info', d),
};

export const ZogToast = {
    install(api, options = {}) {
        const { reactive } = api;
        
        // Options with defaults
        const defaultDuration = options.defaultDuration || 3000;
        const position = options.position || 'bottom-right'; // Default position

        injectStyles();

        // Ensure container exists with correct position class
        let container = document.querySelector('.z-toast-container');
        if (!container) {
            container = document.createElement('div');
            // Add base class and position class
            container.className = `z-toast-container z-pos-${position}`;
            document.body.appendChild(container);
        } else {
            // Update position if container already exists (useful for hot-reload or reconfiguration)
            container.className = `z-toast-container z-pos-${position}`;
        }

        // Reactive State (Data Only)
        const state = reactive({ toasts: [] });
        
        // DOM Map to prevent Proxy issues
        const domMap = new Map();

        const removeToast = (id) => {
            const el = domMap.get(id);
            if (el) {
                el.classList.remove('z-toast-visible');
                // Remove from DOM after animation
                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                    domMap.delete(id);
                }, 300);
            }
            // Remove from reactive state
            const index = state.toasts.findIndex(t => t.id === id);
            if (index > -1) state.toasts.splice(index, 1);
        };

        const addToast = (message, type = 'info', duration = defaultDuration) => {
            const id = Date.now() + Math.random().toString(36).substr(2, 9);
            
            // Add to state
            state.toasts.push({ id, message, type, duration });

            // Create DOM
            const el = document.createElement('div');
            el.className = `z-toast z-toast-${type}`;
            el.innerHTML = `
                <div class="z-toast-icon">${ICONS[type] || ICONS.info}</div>
                <div>${message}</div>
            `;
            
            el.addEventListener('click', () => removeToast(id));

            // Smart Append: 
            // If at 'top', usually we want new items at the top? 
            // Standard behavior is append, but let's stick to simple append for now.
            // If you want 'top' positions to push items down, use prepend:
            if (position.startsWith('top')) {
                // For top positions, adding to start looks better naturally
                container.prepend(el); 
            } else {
                container.appendChild(el);
            }

            domMap.set(id, el);

            // Trigger Animation
            // Double RAF ensures the browser registers the initial state before adding the visible class
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classList.add('z-toast-visible');
                });
            });

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration);
            }
        };

        // Bind and Expose
        $toast.add = addToast;
        window.$toast = $toast;
    }
};
