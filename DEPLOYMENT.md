# How to Add the Punkin Project to Your Website

To get this steampunk generator running on your own website, follow these simple steps:

## Option 1: The "Easy Way" (Iframe Embedding)
If you already have a website (Wix, Squarespace, WordPress, etc.), you can embed the app using an `iframe`.

1. Deploy the app to a service like **Vercel** or **Netlify** (see Option 2).
2. Copy your deployed URL (e.g., `https://punkin-project.vercel.app`).
3. Add this code to your website's HTML:
```html
<iframe 
  src="YOUR_DEPLOYED_URL" 
  style="width:100%; height:800px; border:none;" 
  title="Punkin Project Steampunk Generator">
</iframe>
```

---

## Option 2: Professional Deployment (Vercel/Netlify)
This is the best way to host the app as its own standalone page.

### 1. Export the Code
*   In **Google AI Studio**, go to the **Settings** menu (top right).
*   Select **Export to GitHub** or **Download as ZIP**.

### 2. Get Your Own API Key
*   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
*   Create a new API Key. **Keep this secret!**

### 3. Deploy to Vercel (Recommended)
1. Create a free account at [Vercel.com](https://vercel.com).
2. Connect your GitHub repository (or upload the ZIP files).
3. **Crucial Step:** In the Vercel dashboard, go to **Settings > Environment Variables**.
4. Add a new variable:
    *   **Key:** `GEMINI_API_KEY`
    *   **Value:** (Paste your API key from step 2)
5. Click **Deploy**.

---

## Technical Details for Developers
*   **Framework:** React 19 + Vite 6
*   **Styling:** Tailwind CSS 4
*   **AI Engine:** Google Gemini API (`gemini-2.5-flash-image`)
*   **Build Command:** `npm run build`
*   **Output Folder:** `dist/`

### Security Note
The current setup uses the API key on the client side for simplicity. For a high-traffic production site, it is recommended to move the AI calls to a small backend server (like a Vercel Serverless Function) to keep your API key hidden from the browser.
