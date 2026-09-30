# Whitelabel integration of Behavix Browser SDK

Find the documentation at: https://docs.behavix.io/audience/meter/browser-sdk

---

## Getting Started

Follow these steps to get the boilerplate up and running.

### 1. Installation

1. Replace all string `YOUR_APP_NAME` with your app name.
2. Replace `MY_TERMS_OF_SERVICE_LINK` with link to your terms of service or remove it from the config object to use the default Behavix terms of service
3. Replace `MY_PRIVACY_POLICY_LINK` with link to your privacy policy or remove it from the config object to use the default Behavix privacy policy 
4. Replace the images in `src/assets` to your app icons

Install the development dependencies

```bash
# Install dependencies
npm install
```

After this replace in `src/service-worker/background.ts` the string YOUR_API_KEY with the provided api key.

### 2. Building the Extension

You can build the extension in two modes:

**For Development (with live-reloading):**

This command will watch for file changes and automatically rebuild the extension.

```bash
npm run build -- --watch
```

Please note that you need to refresh the extension files manually from chrome://extensions after each change (see step 3)

**For Production:**

This command will create an optimized, minified build in the `dist/chrome` folder. To build for another browser, add the platform name: `npm run build -- edge` or `npm run build -- firefox`. The output goes to `dist/edge` or `dist/firefox`.

```bash
npm run build
```
### 3. Loading the Extension in Chrome

Once you have built the extension, you can load it into your browser:

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** using the toggle in the top-right corner.
3.  Click the **Load unpacked** button.
4.  Select the `dist/chrome` folder from the project directory.

Your extension should now be installed and active!

---
## Set User

To make the matching of your user id to behavix user id, call the `BehavixSDK.setUser()` function. 
See `src/service-worker/background.ts` and the commented call to `setUser()`

## Core Concepts Explained

-   **`service-worker/background.ts`**: This is the extension's central event handler. It runs in the background and is ideal for managing state, listening for browser events (like tab updates or installation), and coordinating communication between different parts of your extension.

-   **`content-scripts/content.ts`**: This script is injected directly into web pages that match the patterns in your `manifest.json`. It can read and manipulate the DOM of the web page, making it perfect for modifying page content or extracting information.

-   **`popup/popup.html` & `popup.ts`**: This is the user interface that appears when a user clicks on your extension's icon in the toolbar. It's a standard HTML page where you can provide options, display information, and trigger actions.

-   **`web-accessible-resources/script.ts`**: Unlike content scripts, which run in an isolated sandbox, these scripts can be loaded by web pages and run in the page's own context. This is useful when you need to interact with a page's JavaScript variables or APIs directly.

---

## Customization

-   **Functionality**: Start adding your custom logic to `background.ts`, `content.ts`, and `popup.ts`.
