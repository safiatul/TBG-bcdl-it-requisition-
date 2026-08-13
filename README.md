# BCDL IT Requisition — Shared (সবার জন্য এক) ভার্সন

আগের ভার্সনে ডেটা প্রতিটা browser/PC-তে আলাদা আলাদা সেভ হচ্ছিল। এই ভার্সনে একটা
**Netlify Function + Netlify Blobs** (ফ্রি, বিল্ট-ইন ডেটাবেজ, আলাদা কোনো সাইনআপ লাগে না)
ব্যবহার করা হয়েছে, যাতে সবাই যে ডেটা ইনপুট দেবে সেটা **সবার জন্যই** সেভ ও দেখা যাবে।

⚠️ **গুরুত্বপূর্ণ:** Netlify-এর সাধারণ drag-and-drop upload (app.netlify.com/drop) দিয়ে
এই অ্যাপ ডিপ্লয় করলে shared data কাজ করবে না — কারণ ওই পদ্ধতিতে Functions চলে না।
এই অ্যাপ চালাতে হলে **GitHub-এর মাধ্যমে** Netlify-তে কানেক্ট করতে হবে (একবার সেটআপ,
এরপর থেকে সবকিছু স্বয়ংক্রিয়)।

## ধাপ ১ — GitHub-এ কোড আপলোড করুন

1. [github.com](https://github.com) এ একটা ফ্রি অ্যাকাউন্ট বানান (না থাকলে)।
2. **New repository** বাটনে ক্লিক করুন। নাম দিন যা খুশি, যেমন `bcdl-it-requisition`।
   Public বা Private — যেকোনোটা রাখতে পারেন।
3. রিপোজিটরি তৈরি হওয়ার পর **"Add file" → "Upload files"**-এ ক্লিক করুন।
4. এই zip ফাইলের ভেতরের **সব ফাইল ও ফোল্ডার** (এই README সহ) সিলেক্ট করে বা টেনে
   (drag & drop) সেখানে ছেড়ে দিন। `node_modules` ও `dist` ফোল্ডার এখানে নেই —
   সেগুলো লাগবেও না।
5. নিচে **"Commit changes"** বাটনে ক্লিক করে আপলোড শেষ করুন।

## ধাপ ২ — Netlify-কে GitHub-এর সাথে কানেক্ট করুন

1. [app.netlify.com](https://app.netlify.com) এ লগইন করুন।
2. **"Add new site" → "Import an existing project"** ক্লিক করুন।
3. **"Deploy with GitHub"** সিলেক্ট করে আপনার GitHub অ্যাকাউন্ট অনুমোদন (authorize) করুন।
4. একটু আগে বানানো `bcdl-it-requisition` রিপোজিটরিটা সিলেক্ট করুন।
5. Netlify স্বয়ংক্রিয়ভাবে build settings ধরে ফেলবে (এই প্রজেক্টে থাকা `netlify.toml`
   ফাইল থেকে) — কিছু পরিবর্তন করার দরকার নেই। **"Deploy"** ক্লিক করুন।
6. ১-২ মিনিট অপেক্ষা করুন — বিল্ড শেষ হলে আপনি একটা ফ্রি ডোমেইন পাবেন, যেমন:
   `https://your-site-name.netlify.app`
   (চাইলে Site settings থেকে এই নামটা বদলাতে পারবেন।)

এই লিংকটাই সবার সাথে শেয়ার করুন — যে কেউ এই লিংকে ঢুকে ডেটা ইনপুট দিলে সেটা
সবাই দেখতে পাবে, কারণ এখন সব ডেটা Netlify-এর backend-এ (browser-এ নয়) সেভ হচ্ছে।

## আগের সাইট থাকলে কী করবেন?

আগে যে সাইটটা drag-and-drop দিয়ে বানিয়েছিলেন, সেটা মুছে ফেলার দরকার নেই — শুধু
উপরের ধাপ অনুসরণ করে **নতুন একটা সাইট** বানান (GitHub থেকে)। কাজ হয়ে গেলে চাইলে
পুরনোটা Netlify dashboard থেকে ডিলিট করে দিতে পারেন, অথবা নতুন সাইটের নামটা
পুরনোটার মতো করে নিতে পারেন (Site settings → Change site name)।

## টেকনিক্যাল নোট

- `src/App.jsx` — মূল অ্যাপ (আগের ডিজাইন অপরিবর্তিত)।
- `src/storage.js` — `window.storage` API-এর replacement। `shared: true`
  ডেটা (items, departments, employee access, সব requests) যায়
  Netlify Function-এ; `shared: false` ডেটা (কে সাইন-ইন করে আছে) থাকে
  ওই browser-এর localStorage-এ।
- `netlify/functions/storage.js` — আসল shared backend, Netlify Blobs
  দিয়ে ডেটা সেভ করে। এটা প্রতি Netlify সাইটের সাথে বিল্ট-ইন — আলাদা
  কোনো ডেটাবেজ অ্যাকাউন্ট বানানোর দরকার নেই।

কোনো ধাপে আটকে গেলে স্ক্রিনশট দিয়ে জানান, একসাথে ঠিক করে দেব।
