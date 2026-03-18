---
title: React useState နဲ့ useEffect ကို မှန်မှန်ကန်ကန် သုံးနည်း
pubDatetime: 2026-03-15T08:19:54.188Z
description: React beginner တွေ မကြာခဏ ကြုံတွေ့ရတဲ့ useState နဲ့ useEffect ပြဿနာတွေနဲ့ သူတို့ကို ဘယ်လို ဖြေရှင်းမလဲ။
tags: ["react", "javascript", "hooks"]
draft: false
---

<p>React hooks တွေ ကျွမ်းကျင်ဖို့ syntax ကို memorize ဖို့ မလိုဘဲ pattern တွေကို နားလည်ဖို့ လိုပါတယ်။</p>
<h2>useState — State ကို ဘယ်ကနေ ထိန်းကွပ်မလဲ</h2>
<p>State ကို component ထဲမှာ ထားသင့်လား၊ parent မှာ lift up လုပ်သင့်လား ဆိုတာ ဆုံးဖြတ်ဖို့ rule of thumb တစ်ခုက — "state ကို use လုပ်တဲ့ lowest common ancestor မှာ ထားပါ"။</p>
<h2>useEffect — Dependency Array ကို မမေ့ပါနဲ့</h2>
<p>useEffect ထဲမှာ သုံးတဲ့ variable တိုင်းကို dependency array ထဲ ထည့်ပါ။ ESLint exhaustive-deps rule ကို enable ထားရင် ပိုကောင်းပါတယ်။</p>
<h2>흔한 အမှားများ</h2>
<ul>
<li>Infinite loop — dependency array ထဲမှာ object/array literal ထည့်မိတာ</li>
<li>Stale closure — async callback ထဲမှာ outdated state ကို ဖတ်မိတာ</li>
<li>Missing cleanup — subscription တွေ၊ timer တွေကို return function ထဲ clear မလုပ်တာ</li>
</ul>
<p>Hooks တွေကို မှန်မှန်ကန်ကန် သုံးတတ်ရင် React app ရဲ့ performance နဲ့ maintainability တက်လာပါတယ်။</p>
