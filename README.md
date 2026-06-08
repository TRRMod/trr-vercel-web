# TRR Vercel Web

เว็บ Next.js สำหรับ Deploy บน Vercel พร้อมหน้า:

- `/customer` หน้าโชว์ Build ให้ลูกค้า
- `/tracker` หน้าบันทึกข้อมูล Build
- `/admin` หน้าเปิด/ปิด Public และลบ Build

## วิธีใช้งานบนเครื่อง

```bash
npm install
npm run dev
```

## วิธี Deploy บน Vercel

1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub
2. เข้า https://vercel.com/
3. กด Add New Project
4. Import GitHub Repository
5. ใส่ Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
NEXT_PUBLIC_ADMIN_PIN=ตั้งรหัส Admin เช่น 2468
```

6. กด Deploy

## Supabase Table

ใช้ตารางชื่อ `builds` ตาม column ที่คุณเคยสร้างไว้ เช่น:

- build
- ep
- pcb
- plate
- foam
- stab
- case_name
- switch1 / switch1_qty
- switch2 / switch2_qty
- switch3 / switch3_qty
- keycap
- total_cost
- total_price
- profit
- description
- cover_image
- image_urls
- youtube_build_url
- youtube_sound_url
- is_public

## หมายเหตุ

- หน้า Customer จะดึงเฉพาะ `is_public = true`
- หน้า Tracker ใช้เพิ่มข้อมูลใหม่
- หน้า Admin ใช้ PIN จาก `NEXT_PUBLIC_ADMIN_PIN`
