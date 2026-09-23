# Doxy Electricals — Online Shop

A simple, working e-commerce site built with plain HTML, CSS and JavaScript
(no build tools, no frameworks needed) with WhatsApp checkout and an admin
dashboard. This README answers the common "how do I..." questions in plain
language.

## 1. Which file opens the website?
`index.html` is the homepage — this is what visitors see first.
Other pages: `shop.html`, `product.html`, `cart.html`, `about.html`, `contact.html`.

## 2. Which file contains the products?
`js/services/productService.js`. Look for the `DEFAULT_PRODUCTS` list near
the top — that's the starting product catalog. Once the site has run once in
a browser, products actually live in the browser's **localStorage** (so
admin changes are saved), and this file is only used to create that starting
data the very first time.

## 3. How does the admin dashboard work?
Go to `admin/index.html` (on a deployed site this is simply **/admin/**).
Log in, and you'll see a sidebar with Dashboard, Products, Categories,
Inventory, Orders, Store Settings and Website Settings. Everything you
change there is saved to the browser's localStorage and shows up on the
storefront immediately.

## 4. Admin demo login details
- Username: `admin`
- Password: `admin123`

This is clearly a **demo login only** — it's checked in the browser, not on
a server, so it is not secure. See point 16 below.

## 5. How to change the Doxy WhatsApp number
Two ways:
- **Easiest:** In the admin dashboard, go to **Store Settings → WhatsApp
  Number** and save. Every WhatsApp button on the site updates immediately.
- **In code:** open `js/services/settingsService.js` and change
  `whatsappNumber` inside `DEFAULT_SETTINGS`. Use digits only, with the
  country code, no `+` or spaces (e.g. `2348012345678`).

You only ever need to set this in **one place** — every page reads it from
there through `js/whatsapp.js`.

## 6. How to change the business phone number
Admin → Store Settings → Business Phone. (Or edit `businessPhone` in
`settingsService.js`.)

## 7. How to change the business address
Admin → Store Settings → Business Address. (Or edit `address` in
`settingsService.js`.)

## 8. How admin adds a product
Admin → Products → **+ Add New Product**, fill the form, click **Save
Product**. It appears in the shop right away.

## 9. How admin changes a product price
Admin → Products → find the product → **Edit** → change the Price field →
Save. The storefront shows the new price instantly.

## 10. How admin marks a product out of stock
Admin → Products (or Inventory) → find the product → **Mark Out of Stock**.
The product stays visible on the site but "Add to Cart" is replaced with
"Ask About Availability" (which opens WhatsApp with a ready-made question).
Click the button again to mark it back in stock.

Note: products also automatically show "Low Stock" once quantity drops to 5
or below, and "Out of Stock" once quantity hits 0 — you can set quantity in
Admin → Inventory.

## 11. How admin deletes a product
Admin → Products → find the product → **Delete** → confirm in the popup.
Deleting cannot be undone.

## 12. How to add product images
Right now the site uses **image URLs** (a link to an image already hosted
somewhere), not file uploads. In the product form, paste the image link into
the "Product Image URL" field. You can host images for free on places like
Imgur, Cloudinary, or your own GitHub repo. File upload support can be added
later once the project is connected to a real backend (see point 16).

## 13. How to run the website locally
You don't need to install anything special. Because the pages use plain
JavaScript files (not React build tools), you can:
1. Open the `tose` folder.
2. Double-click `index.html` to open it in your browser, **or** for the most
   reliable experience, run a simple local server from inside the folder,
   for example:
   ```
   npx serve .
   ```
   or (if you have Python installed):
   ```
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## 14. How to push the project to GitHub
1. Create a new repository on GitHub.
2. In a terminal, inside the `tose` folder:
   ```
   git init
   git add .
  git commit -m "Initial Doxy Electricals website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

## 15. Which folder/files to upload to Netlify
Upload the **entire `tose` folder** (everything: `index.html`, `css/`,
`js/`, `admin/`, and so on) — there is no build step, no `dist` folder, and
nothing to compile. If deploying from GitHub, just connect the repo in
Netlify and leave the build command empty with the publish directory set to
the project root (`/` or wherever this folder sits in your repo).

## 16. What must be replaced before this is a real production website
This is a **frontend demo**. Before real customers and real money are
involved:
- **Admin login** must be replaced with real authentication (Supabase Auth,
  Firebase Auth, etc.) — the current login only checks a hardcoded
  username/password in the browser and is not secure.
- **Product/category/order/settings data** currently lives in the browser's
  localStorage, which means it's only saved on the device that changed it,
  and can be cleared by clearing browser data. This should move to a real
  database (Supabase or Firebase are both good fits, and the code is already
  organized into `productService.js`, `categoryService.js`,
  `orderService.js`, `settingsService.js`, `authService.js` so this swap
  doesn't require rebuilding the app — you just rewrite what happens inside
  each function).
- **Images** should move from external URLs to a proper image host or file
  upload system.
- **Payments**: the current version routes every order through WhatsApp.
  When you're ready for real online payments, Paystack is a natural fit for
  a Nigerian business and can be added without changing the rest of the
  site.
- Replace all placeholder text (business address, phone, sample prices,
  demo images) with Doxy's real information before launch.

---

## Project structure
```
index.html            Homepage
shop.html              Shop with search/filter/sort
product.html            Product detail page
cart.html               Cart + WhatsApp checkout
about.html / contact.html / 404.html
css/
  styles.css             Main styles
  responsive.css          Mobile/tablet breakpoints
  admin.css               Admin dashboard styles
js/
  services/               Data layer (swap localStorage for a DB later)
    productService.js, categoryService.js, cartService.js,
    orderService.js, settingsService.js, authService.js
  whatsapp.js              Single source for all WhatsApp messages/links
  ui.js                    Shared header/footer/product card rendering
  home.js, shop.js, product.js, cart.js, contact.js   Page-specific logic
admin/
  index.html               Admin login + dashboard (visit as /admin/)
  js/                       Admin-only screens (products, categories,
                             inventory, orders, settings)
```

## Testing checklist (all confirmed working in this build)
Homepage, Shop, Search, Category filtering, Price sorting, Product details,
Add to cart, Remove from cart, Change quantity, Cart totals, Cart
persistence (localStorage), Individual product WhatsApp enquiry, Full cart
WhatsApp order, Admin login, Add/Edit/Delete product, Change price, Change
stock, Mark out of stock, Add/Edit/Delete category, Edit settings, Orders
list + status updates, Mobile navigation, Admin mobile sidebar, Broken image
fallback, 404 page.
