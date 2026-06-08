# TRR Vercel JSX

แปลงจาก Google Apps Script HTML เป็น Next.js JSX สำหรับ Vercel

## Pages
- `/customer` หน้า Showcase + Catalog
- `/tracker` บันทึกข้อมูล Build ลง Supabase table `builds`
- `/admin` จัดการ Showcase, Catalog, Customer Settings

## Environment Variables on Vercel
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Required Supabase tables
ใช้ตาราง `builds` เดิมของคุณ และเพิ่ม 2 ตารางนี้สำหรับ Settings/Catalog:

```sql
create table if not exists app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists catalog_items (
  category text not null,
  name text not null,
  image_url text,
  details text,
  shopee1 text,
  shopee2 text,
  lazada text,
  other text,
  updated_at timestamptz default now(),
  primary key (category, name)
);
```

> API routes ใช้ `SUPABASE_SERVICE_ROLE_KEY` บน server จึงไม่ต้องเปิด RLS สำหรับหน้า admin/tracker ถ้า key ถูกตั้งถูกต้องใน Vercel
