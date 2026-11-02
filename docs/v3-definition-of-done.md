# Definition of Done: `@minkbear/adonis-lucid-soft-deletes` v3.0.0

ห้าม publish `3.0.0` จนกว่าทุกข้อจะผ่านบนเครื่อง local โดยไม่ต้องใช้ CI

ทุกคำสั่งต้องจบด้วย exit code 0 ถ้าแก้โค้ดหลังผ่านข้อ C ไปแล้ว ให้เริ่มตรวจใหม่ตั้งแต่ข้อ C

**สภาพแวดล้อม:** Node 24 ขึ้นไป, `@adonisjs/core@^7`, `@adonisjs/lucid@^22`

## A. การเปลี่ยนแปลงในโค้ด

- [ ] Cherry-pick commit `4682483` จาก PR #33 โดยคงชื่อผู้เขียนเดิม
- [ ] `package.json`: `name` เป็น `@minkbear/adonis-lucid-soft-deletes`
- [ ] `package.json`: `homepage`, `repository`, `bugs` ชี้ไปที่ `minkbear/adonis-lucid-soft-deletes`
- [ ] `package.json`: `engines.node` เป็น `>=24`
- [ ] `package.json`: peer เป็น `@adonisjs/core@^7.0.0` และ `@adonisjs/lucid@^22.1.1`
- [ ] `package.json`: dev dependencies รองรับ v7 (`core@^7`, `lucid@^22`, `assembler@^8`, `@vinejs/vine@^4`, `@dirupt/adonis-lucid-filter`)
- [ ] `configure.ts`: ลงทะเบียน provider เป็น `@minkbear/adonis-lucid-soft-deletes/provider`
- [ ] `README.md`: ใช้ชื่อใหม่ บอกว่า 3.x ต้องใช้ AdonisJS 7 และ Node 24 และมีวิธีย้ายจากแพ็กเกจเดิม
- [ ] `LICENSE.md`: คง copyright ของ Lookin Anton และเพิ่มชื่อผู้ดูแลใหม่
- [ ] ไม่แก้ `version` ด้วยมือ เพราะ `np` จะเปลี่ยนเป็น `3.0.0` ตอน release

## B. เทสต์ใหม่ใน repo

- [ ] Boot provider ด้วย app จริงแล้ว `withTrashed()` ใช้งานได้
- [ ] เรียก `withTrashed()` กับโมเดลที่ไม่มี mixin แล้วโยน exception ที่ถูกต้อง
- [ ] รัน `configure` แล้ว `adonisrc.ts` มี provider ชื่อใหม่

## C. ตรวจใน repo

ติดตั้งใหม่จากศูนย์ทุกครั้ง:

```bash
rm -rf node_modules build
npm install
npm test            # lint, เทสต์ทั้งหมด และ coverage
npm run typecheck
npm run build
```

ถ้าเทสต์แจ้งว่าไม่พบ binding ของ `sqlite3` ให้รัน `npm rebuild sqlite3 @swc/core esbuild` แล้วรันใหม่

- [ ] `npm test` ผ่าน โดยมีเทสต์เดิม 18 ตัวและเทสต์ใหม่จากข้อ B ครบ
- [ ] `npm run typecheck` ผ่าน
- [ ] `npm run build` ผ่าน
- [ ] คำสั่งนี้ไม่พบชื่อแพ็กเกจเดิม:

```bash
grep -rnE "[\"']adonis-lucid-soft-deletes/" build
```

## D. ตรวจเวอร์ชันต่ำสุดที่ประกาศรองรับ

```bash
npm i -D @adonisjs/core@7.0.0 @adonisjs/lucid@22.1.1 --no-save
npm run quick:test
rm -rf node_modules && npm install
```

- [ ] เทสต์ผ่านบน `core@7.0.0` และ `lucid@22.1.1`
- [ ] ถ้าไม่ผ่าน ได้ขยับ peer ขึ้นเป็นเวอร์ชันที่ผ่านจริง แล้วรันข้อ C และ D ใหม่
- [ ] ติดตั้งกลับเป็นเวอร์ชันตาม `package.json` แล้ว

## E. ตรวจในแอป AdonisJS v7 จริง

ใช้ไฟล์ `.tgz` ห้ามใช้ `npm link` และสร้างแอปไว้นอก repo นี้

```bash
# ใน repo นี้ คำสั่งจะแสดงชื่อไฟล์ .tgz ซึ่งยังเป็นเวอร์ชันปัจจุบันใน package.json
npm run build && npm pack

# นอก repo: เลือก API starter และฐานข้อมูล SQLite
npm init adonisjs@latest soft-delete-v7
cd soft-delete-v7
npm i /path/to/<ไฟล์-tgz-จากคำสั่ง-npm-pack>
node ace configure @minkbear/adonis-lucid-soft-deletes
```

ฐานข้อมูลที่ใช้ทดสอบ: SQLite

เขียนข้อที่เกี่ยวกับข้อมูลเป็น functional test ในแอปนั้น เพื่อให้รันซ้ำได้

**การติดตั้งและ build**

- [ ] `adonisrc.ts` มี provider ชื่อใหม่
- [ ] `node ace serve` เริ่มแอปได้ โดยไม่มี error จาก provider
- [ ] `node ace build` ผ่าน
- [ ] `npx tsc --noEmit` ผ่าน รวมถึง type ของ `withTrashed()` และ `onlyTrashed()`

**พฤติกรรมของข้อมูล**

- [ ] `post.delete()`: แถวยังอยู่ในฐานข้อมูล และ `deleted_at` ถูกตั้งค่า
- [ ] `Post.query()` และ `Post.find()`: ไม่เห็นแถวที่ถูกลบ
- [ ] `Post.query().paginate()`: ไม่เห็นแถวที่ถูกลบ และ `total` ถูกต้อง
- [ ] `Post.withTrashed()`: เห็นแถวทั้งหมด
- [ ] `Post.onlyTrashed()`: เห็นเฉพาะแถวที่ถูกลบ
- [ ] `post.restore()`: `deleted_at` กลับเป็น `null`
- [ ] `post.forceDelete()`: แถวหายจากฐานข้อมูลจริง
- [ ] `preload` ของ has-many และ many-to-many: ไม่เห็นแถวที่ถูกลบ
- [ ] `useTransaction` แล้ว rollback: สถานะของแถวกลับเหมือนเดิม

**ข้อยกเว้น:** type error ที่พิสูจน์ได้ว่าเป็นบั๊กเดิมของ 2.1.0 ไม่ขวาง release แต่ต้องระบุเป็น known issue ใน release notes

## F. ตรวจก่อน publish

```bash
npm whoami
npm publish --dry-run
```

- [ ] `npm whoami` แสดงบัญชีที่มีสิทธิ์ใน scope `@minkbear`
- [ ] รายการไฟล์มี `build/index.js` และ provider และไม่มี `build/tests` หรือ `build/bin`
- [ ] Git working tree สะอาด และอยู่บน branch `master`

## เสร็จสมบูรณ์เมื่อ

- [ ] ข้อ A ถึง F ผ่านทั้งหมด
- [ ] `npm run release` ออกเวอร์ชัน `3.0.0` สำเร็จ
- [ ] `npm view @minkbear/adonis-lucid-soft-deletes version` แสดง `3.0.0`
- [ ] ติดตั้งจาก npm ในแอปจากข้อ E แล้วเทสต์ในแอปยังผ่าน
