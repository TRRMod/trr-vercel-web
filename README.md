# TRR JSX UI Preserved

ชุดไฟล์ Next.js / JSX ที่แปลงจาก HTML เดิม โดยคง UX/UI ให้ใกล้ต้นฉบับที่สุด

## Pages
- `/customer` - หน้า Customer Showcase
- `/tracker` - หน้า Keyboard Build Tracker
- `/admin` - หน้า Admin Studio

## ENV สำหรับ Vercel
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## ใช้งาน
```bash
npm install
npm run dev
```

## Deploy to Vercel
Import repository นี้เข้า Vercel แล้วตั้ง Environment Variables ด้านบน

## Tracker update notes

Required Vercel env:

```env
NEXT_PUBLIC_ADMIN_PIN=your-one-password
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

If you want to store the new `Remark` field, add this column in Supabase SQL Editor:

```sql
alter table builds add column if not exists remark text;
```

Then redeploy on Vercel.

## Tracker update
- Renamed display label from `ค่าส่งทุน` to `ค่าส่งขาย` on Tracker UI/table while keeping existing database field `shipping_cost`.
- Moved `Remark` field next to `ค่าส่งจริง`.
- Added table record limit selector: 20 / 50 / 100 / 200 / ALL.
