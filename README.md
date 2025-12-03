# AIBG
AIBG: A Chrome extension to customize background images for top AI chat interfaces like Gemini, ChatGPT, and Kimi. Make your AI conversations truly personal.



# 🎨 AIBG: AI Background Customizer (Chrome Extension)

AIBG (AI Background) is a powerful Chrome Extension designed to personalize your experience on leading AI chat platforms like **Google Gemini**, **ChatGPT**, **Claude** **Kimi**, **Yuanbao**, **DeepSeek**, and **Qwen**. Stop looking at plain, static backgrounds—upload your favorite image and make your AI conversations truly unique.

## ✨ Features

  * **Cross-Platform Support:** Apply your custom background across multiple major AI interfaces with a single setup.
  * **Local Storage (Privacy First):** Images are converted to a Base64 Data URL and stored securely in your browser's local storage (`chrome.storage`), ensuring no external server interaction.
  * **Persistent & Instant Styling:** Styles are loaded and injected immediately upon page load and persist across browser sessions.
  * **Simple UI:** Easy-to-use popup for image upload, save, and clear actions.

## 🚀 Installation and Setup

### Method 1: Installing from the Chrome Web Store (Future)

*(Note: This section is for when the extension is published. For now, use Method 2.)*

1.  Navigate to the **AIBG** page on the Chrome Web Store.
2.  Click **"Add to Chrome"** and confirm the installation.

### Method 2: Installing in Developer Mode (Current)

This is the recommended method for testing the code you are currently developing.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/kylez0101/AIBG.git
    ```
2.  **Open Chrome Extensions Page:**
      * In your Chrome browser, navigate to `chrome://extensions`.
3.  **Enable Developer Mode:**
      * Toggle the **"Developer mode"** switch on (usually in the top right corner).
4.  **Load the Extension:**
      * Click the **"Load unpacked"** button.
      * Select the `AIBG` folder you cloned in Step 1.

## 🖼️ How to Use

1.  Click the **AIBG** icon in your Chrome toolbar.
2.  In the popup window, click **"Choose File"** and upload the image you want to use.
3.  Click the **"Save and Apply Background"** button.
4.  Navigate to or refresh any supported AI page (Gemini, ChatGPT, Kimi). Your new background will appear instantly\!
5.  To revert to the default background, click **"Clear Background"** in the popup.

## ⚙️ Technical Structure

The project is built using vanilla JavaScript, HTML, and CSS, adhering to the **Manifest V3** standard.

| File | Purpose | Key Functionality |
| :--- | :--- | :--- |
| `manifest.json` | Configuration | Defines permissions (`storage`), targeted host domains, and registers `content.js`. |
| `popup.html` / `popup.js` | User Interface | Handles file upload via `FileReader` to convert image to Base64 and stores it using `chrome.storage.local`. |
| `content.js` | Style Injection (Core Logic) | Injected into AI websites. It retrieves the Base64 URL and injects specific CSS rules based on the current domain's hostname. |
| `styles.css` | Extension Styling | Styles the `popup.html` interface itself. |

### ⚠️ A Note on CSS Selectors

AI website interfaces frequently change. The core challenge lies in maintaining the correct **CSS selectors** for the main chat container of each platform.

| Platform | Domain | Current Target Selector (Needs Verification\!) |
| :--- | :--- | :--- |
| **Google Gemini** | `gemini.google.com` | `.main-content-wrapper` |
| **ChatGPT** | `chatgpt.com` | `.h-full.flex-1.overflow-hidden` |
| **Kimi** | `kimi.moonshot.cn` | `.chat-container` |

***Developers are encouraged to use the browser's Dev Tools (F12) to verify these selectors regularly.***

## 🤝 Contribution

Contributions are welcome\! If you find a broken CSS selector or have suggestions for new features (like opacity/blur controls), please open an issue or submit a pull request.

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---------------------------------------------
## 📝 GitHub 仓库描述 (Repository Description)

> **AIBG: 为顶级 AI 聊天界面（Gemini, ChatGPT, Kimi 等）定制背景图像的 Chrome 扩展程序。让你的 AI 聊天体验独一无二。**
> (AIBG: A Chrome extension to customize background images for top AI chat interfaces like Gemini, ChatGPT, and Kimi. Make your AI conversations truly personal.)

---

### 🎨 AIBG (AI Background)

AIBG 是一个强大的 Chrome 扩展程序，专为个性化您的 AI 聊天体验而设计。厌倦了 AI 助手的默认纯色背景？使用 AIBG，您可以轻松上传任何图片，并将其应用为 **Google Gemini**、**ChatGPT**、**Kimi** 等主流 AI Web 客户端的聊天背景。

### ✨ 主要功能

* **多平台支持：** 一次设置，即可应用于 Gemini、ChatGPT、Kimi 等多个 AI 平台。
* **本地图片上传：** 安全地将本地图片转换为 Base64 格式，直接存储在您的浏览器中，无需外部服务器。
* **持久化存储：** 利用 Chrome Storage API，确保您设置的背景在浏览器重启后依然有效。
* **即时应用：** 支持在不刷新页面的情况下，通过内容脚本实时注入和更新 CSS 样式。

### 🚀 如何安装和使用

#### 1. 安装 (开发者模式)

1.  下载或克隆本仓库到您的本地计算机。
   ```bash
    git clone https://github.com/kylez0101/AIBG.git
    ```
2.  打开 Google Chrome 浏览器，输入 `chrome://extensions`。
3.  开启右上角的 **开发者模式**。
4.  点击 **“加载已解压的扩展程序”**。
5.  选择您下载的 `AIBG` 文件夹。

#### 2. 使用步骤

1.  点击浏览器工具栏中的 **AIBG** 图标（弹出窗口）。
2.  点击 **“选择文件”** 并上传您喜欢的背景图片。
3.  点击 **“保存并应用背景”** 按钮。
4.  打开或切换到 Gemini、ChatGPT 或 Kimi 页面，背景将自动应用。
5.  如果需要移除背景，点击弹出窗口中的 **“清除背景”** 按钮即可。

### 💻 技术实现 (针对开发者)

AIBG 的核心是利用浏览器扩展技术来克服网站样式限制：

* **Manifest V3：** 遵循最新的 Chrome 扩展程序标准。
* **Content Script (`content.js`)：** 注入到目标 AI 网站，负责读取用户存储的图片 URL。
* **Host Permissions：** 允许扩展程序在特定的 AI 域名下注入自定义 CSS。
* **Base64 编码：** 图片文件在前端被转换为 Base64 Data URL，通过 `chrome.storage.local` 进行存储。
* **CSS Selector Mapping：** 核心挑战是找到并持续更新每个 AI 平台的主容器 CSS 选择器（如 `gemini.google.com` 对应 `.main-content-wrapper`），以确保样式正确注入。

