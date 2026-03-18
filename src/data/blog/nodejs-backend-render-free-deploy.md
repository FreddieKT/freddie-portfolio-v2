---
title: Node.js Backend ကို Render မှာ Free Deploy လုပ်နည်း
pubDatetime: 2026-03-15T08:19:54.684Z
description: "Express.js API တစ်ခုကို Render free tier မှာ deploy လုပ်ပြီး environment variables, CORS, auto-deploy တွေ configure လုပ်နည်း step-by-step။"
tags: ["nodejs", "deployment", "backend"]
draft: false
---

<p>Heroku free tier ပျောက်သွားပြီးနောက် Render ဟာ developer တွေကြားမှာ popular ဖြစ်လာတဲ့ free hosting option တစ်ခုပါ။</p>
<h2>Step 1: Render Account ဖွင့်ပါ</h2>
<p>render.com မှာ GitHub ဖြင့် sign up လုပ်ပါ။ GitHub repo ကို connect လုပ်ပါ။</p>
<h2>Step 2: Web Service Create လုပ်ပါ</h2>
<p>New → Web Service → GitHub repo ရွေးပါ။ Build command: <code>npm install</code>, Start command: <code>node server.js</code>။</p>
<h2>Step 3: Environment Variables</h2>
<p>Render dashboard ထဲမှာ Environment tab ကိုသွားပြီး .env ထဲက variables တွေ ထည့်ပါ — DATABASE_URL, API_KEY စသဖြင့်။ .env file ကို commit မလုပ်ပါနဲ့။</p>
<h2>Step 4: CORS Configure</h2>
<p>Frontend domain ကို ALLOWED_ORIGINS မှာ ထည့်ပါ။</p>
<pre><code>app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));</code></pre>
<h2>Free Tier Limitation</h2>
<p>Render free tier မှာ 15 minutes inactivity ရင် instance sleep ဝင်သွားတယ်။ Production အတွက် paid plan ကို upgrade လုပ်သင့်ပါတယ်။</p>
