---
title: Supabase ကို Side Project မှာ ဘာကြောင့် ရွေးချယ်သင့်သလဲ
pubDatetime: 2026-03-15T08:19:54.340Z
description: "Firebase အစား Supabase ကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ — open source, PostgreSQL, real-time, auth အားလုံး built-in။"
tags: ["supabase", "backend", "database"]
draft: false
---

<p>Side project တစ်ခု စတင်တဲ့အချိန်မှာ backend setup အတွက် အချိန်ကုန်ချင်မှာ မဟုတ်ဘူး။ Supabase က ဒီ pain point ကို ဖြေရှင်းပေးပါတယ်။</p>
<h2>ဘာကောင်းတာလဲ</h2>
<ul>
<li><strong>PostgreSQL</strong> — real relational database, NoSQL ကို force မလုပ်</li>
<li><strong>Auth</strong> — email, OAuth (Google, GitHub) built-in</li>
<li><strong>Storage</strong> — file upload အတွက် S3-compatible bucket</li>
<li><strong>Real-time</strong> — database changes ကို WebSocket ဖြင့် subscribe လုပ်နိုင်</li>
<li><strong>Free tier</strong> — side project အတွက် လုံလောက်တယ်</li>
</ul>
<h2>Row Level Security (RLS)</h2>
<p>Supabase ရဲ့ RLS policy တွေက database level မှာ ခွင့်ပြုချက် စစ်ပေးတယ်။ Backend code မပါဘဲ data ကို protect လုပ်နိုင်တယ်။</p>
<p>Side project တစ်ခုကို quickly ship လုပ်ချင်ရင် Supabase ဟာ best choice တွေထဲမှာ ပါပါတယ်။</p>
