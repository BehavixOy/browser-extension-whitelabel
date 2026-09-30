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

## Publish to the stores automatically

The workflow `.github/workflows/publish.yml` is a template. It builds the extension and publishes it to the Chrome Web Store, Firefox Add-ons (AMO) and Microsoft Edge Add-ons. It does not work in this repository, because the store secrets are not set here.

Each store needs a one-time manual setup. After that, the workflow reads the credentials from GitHub secrets. You can use different secret names, but then change the names in the workflow too.

### Chrome Web Store

What to register in the store:
1. Create a Chrome Web Store developer account, or use an existing one. Google charges a one-time fee of $5 for a new account.
2. Upload the first version manually. Fill in the store listing and the Privacy tab. Copy the item ID (the extension ID).
3. In Google Cloud Console, create a project, or use an existing one. Enable the Chrome Web Store API.
4. Configure the OAuth consent screen, then set its publishing status to "In production". If the status stays "Testing", the refresh token expires after 7 days.
5. Create an OAuth client ID. Then get a refresh token for the scope `https://www.googleapis.com/auth/chromewebstore`, for example with `npx chrome-webstore-upload-keys`.

GitHub secrets:
- `CHROME_EXTENSION_ID`: the item ID
- `CHROME_CLIENT_ID`: the OAuth client ID
- `CHROME_CLIENT_SECRET`: the OAuth client secret
- `CHROME_REFRESH_TOKEN`: the refresh token

The `chrome` job uploads the zip and submits the version for review.

### Firefox Add-ons (AMO)

What to register in the store:
1. Create an AMO developer account, or use an existing one.
2. In `src/firefox/manifest.json`, set `browser_specific_settings.gecko.id` to your own add-on ID, for example `extension@yourcompany.com`.
3. Submit the first version manually. The bundle is minified, so AMO asks for the source code. Upload a source zip too.
4. On https://addons.mozilla.org/developers/addon/api/key/, create API credentials. You get a JWT issuer and a JWT secret.

GitHub secrets:
- `FIREFOX_API_ISSUER`: the JWT issuer
- `FIREFOX_API_SECRET`: the JWT secret

The `firefox` job signs the extension on the listed channel with `web-ext`. It uploads the source zip for the reviewer. It does not wait for the review.

### Microsoft Edge Add-ons

What to register in the store:
1. Create a Microsoft Partner Center account for Microsoft Edge, or use an existing one. There is no fee.
2. Submit the first version manually and wait for certification. Certification can take up to 7 business days.
3. In Partner Center, open Publish API and click "Create API credentials". You get a Client ID and an API key. The API key is shown only one time, so save it immediately. Copy the Product ID from the same page too.

GitHub secrets:
- `EDGE_PRODUCT_ID`: the Product ID
- `EDGE_CLIENT_ID`: the Client ID
- `EDGE_API_KEY`: the API key

The `edge` job uploads the zip, waits until the store processes it, and submits the draft for certification.

The Edge API key has an expiry date, so set a reminder for it. Several keys can be active at the same time. To rotate the key, create a new one, update the secret, and let the old key expire.

### Enable the workflow

1. In your GitHub repository, go to Settings → Secrets and variables → Actions. Add each secret there.
2. In `.github/workflows/publish.yml`, remove the comment marks from the `push` trigger.
3. For each release, increase `version` in all three `src/<platform>/manifest.json` files. Each store rejects a version number that it already has.
4. Push a tag with the same version, for example `git tag 1.0.1 && git push origin 1.0.1`.

You can also start the workflow manually from the Actions tab.

## Core Concepts Explained

-   **`service-worker/background.ts`**: This is the extension's central event handler. It runs in the background and is ideal for managing state, listening for browser events (like tab updates or installation), and coordinating communication between different parts of your extension.

-   **`content-scripts/content.ts`**: This script is injected directly into web pages that match the patterns in your `manifest.json`. It can read and manipulate the DOM of the web page, making it perfect for modifying page content or extracting information.

-   **`popup/popup.html` & `popup.ts`**: This is the user interface that appears when a user clicks on your extension's icon in the toolbar. It's a standard HTML page where you can provide options, display information, and trigger actions.

-   **`web-accessible-resources/script.ts`**: Unlike content scripts, which run in an isolated sandbox, these scripts can be loaded by web pages and run in the page's own context. This is useful when you need to interact with a page's JavaScript variables or APIs directly.

---

## Customization

-   **Functionality**: Start adding your custom logic to `background.ts`, `content.ts`, and `popup.ts`.
