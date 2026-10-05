# المخالب الناعمة

منصة عيادة بيطرية عربية مبنية بـ Next.js، مع نسخة ثابتة للنشر على GitHub Pages.

## الرابط المنشور

https://nassifmhm302-beep.github.io/soft-paws-veterinary-platform/

## التشغيل المحلي

```bash
npm install
npm run dev
```

## النشر

يتم البناء تلقائياً عبر GitHub Actions عند الدفع إلى فرع `main`، ثم النشر إلى GitHub Pages.

إذا ظهر فشل أول تشغيل بسبب أن Pages غير مفعّلة، افتح `Settings → Pages` في المستودع، واختر `Source: GitHub Actions` من قسم **Build and deployment**، ثم أعد تشغيل Workflow باسم `Deploy to GitHub Pages`.

## ملاحظة مهمة

GitHub Pages يستضيف الملفات الثابتة فقط. لذلك تعمل الصفحات التعريفية والمتجر وسلة المشتريات المحلية، بينما تحتاج نماذج الحجز والتواصل وإتمام الطلب إلى خادم Next.js وقاعدة PostgreSQL وربط بيانات العيادة حتى تحفظ الطلبات وترسلها فعلياً. ملفات الـAPI الأصلية محفوظة في `src/server-api` لتجهيز نشر ديناميكي لاحقاً.
