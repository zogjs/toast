
# 🍞 ZogToast

A lightweight, elegant, and fully reactive toast notification system designed specifically for **Zog.js**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Size](https://img.shields.io/badge/size-6kb-green.svg)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

## ✨ Features

- **Zero Dependencies**: Works directly with Zog.js core.
- **Automatic Styling**: Injects its own CSS—no extra files to import.
- **Positioning**: 6 configurable positions (e.g., `top-right`, `bottom-center`).
- **Smart Animations**: Smooth entry/exit animations based on screen position.
- **Types**: Built-in support for `success`, `error`, `warning`, and `info`.
- **Global Access**: Accessible via `window.$toast` or anywhere in your app logic.

## 🚀 Installation

```bash
npm install zogjs @zogjs/toast
```

```javascript
import { use, createApp } from 'zogjs';
import { ZogToast } from '@zogjs/toast';
```

## 🛠 Usage

### 1. Register the Plugin
In your main application entry point (e.g., `main.js`), register the plugin using `use()`. You can pass configuration options here.

```javascript
// main.js
import { createApp, use } from 'zogjs';
import { ZogToast } from '@zogjs/toast';

// Install with options
use(ZogToast, {
    position: 'top-right', // 'top-right', 'top-left', 'bottom-center', etc.
    defaultDuration: 3000  // Time in ms before auto-dismiss
});

createApp(() => {
    return {
        title: 'My Zog App'
    };
}).mount('#app');
```

### 2. Triggering Toasts
You can trigger notifications from anywhere in your application logic or directly from your HTML templates.

#### In JavaScript:
```javascript
// Inside a function or setup block
$toast.success('Post saved successfully!');
$toast.error('Connection failed.');
$toast.warning('Battery low.');
$toast.info('New version available.');
```

#### In HTML Template:
```html
<button @click="$toast.success('Item added to cart!')">
    Add to Cart
</button>

<button @click="$toast.error('Action denied', 5000)">
    Delete Item
</button>
```

## ⚙️ Configuration

You can pass an options object when installing the plugin:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `String` | `'bottom-right'` | Where toasts appear on screen. |
| `defaultDuration` | `Number` | `3000` | Duration (ms) before auto-dismiss. Set to `0` to disable. |

### Available Positions
* `top-right`
* `top-left`
* `top-center`
* `bottom-right`
* `bottom-left`
* `bottom-center`

## 📚 API Reference

The global `$toast` object provides the following methods:

### `$toast.success(message, [duration])`
Displays a green success notification with a checkmark icon.

### `$toast.error(message, [duration])`
Displays a red error notification.

### `$toast.warning(message, [duration])`
Displays a yellow warning notification.

### `$toast.info(message, [duration])`
Displays a blue informational notification.

### `$toast.add(message, type, [duration])`
Generic method to add a toast manually.
- **type**: `'success' | 'error' | 'warning' | 'info'`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
