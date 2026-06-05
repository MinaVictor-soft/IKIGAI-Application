import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import fs from 'fs';

const doc = new Document({
  sections: [{
    properties: {
      page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } },
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: 'IKIGAI Quest', bold: true, size: 56, font: 'Arial' }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: 'دليل لوحة التحكم الإدارية', bold: true, size: 40, font: 'Arial' }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        children: [
          new TextRun({ text: 'منصة المؤتمرات التفاعلية المُلعّبة', size: 28, font: 'Arial', color: '666666' }),
        ],
      }),

      // ==================== Page 1: Dashboard ====================
      heading('١. لوحة المعلومات (Dashboard)'),
      para('الصفحة الرئيسية بعد تسجيل الدخول، تعرض إحصائيات سريعة عن المنصة:'),
      bullet('إجمالي المستخدمين المسجلين'),
      bullet('عدد الجلسات النشطة'),
      bullet('إجمالي الحضور'),
      bullet('إجمالي النقاط الممنوحة'),
      bullet('عدد المسابقات النشطة'),
      spacer(),
      note('يتم تحديث الإحصائيات تلقائياً عند فتح الصفحة.'),

      // ==================== Page 2: Users ====================
      heading('٢. إدارة المستخدمين (Users)'),
      para('صفحة شاملة لإدارة جميع مستخدمي المنصة:'),
      spacer(),

      subheading('الميزات:'),
      bullet('عرض قائمة المستخدمين مع الفلترة حسب الدور (مشترك، مشرف، مسؤول)'),
      bullet('إنشاء مستخدم جديد (الاسم، البريد، كلمة المرور، الدور)'),
      bullet('تعيين المجموعة (Tribe) لكل مستخدم'),
      bullet('تعديل النقاط (إضافة أو خصم XP)'),
      bullet('عرض تفاصيل المستخدم عبر النقر على اسمه'),
      spacer(),

      subheading('تفاصيل المستخدم (4 تبويبات):'),
      bullet('المعلومات: البيانات الأساسية + رمز QR الشخصي + تعديل النقاط'),
      bullet('الجلسات: قائمة الجلسات التي حضرها + نقاط كل جلسة'),
      bullet('المسابقات: نتائج المسابقات (ناجح/راسب) + الدرجات + النقاط'),
      bullet('المكافآت: المكافآت التي حصل عليها + التاريخ + المبلغ'),
      spacer(),

      subheading('العمليات المجمّعة:'),
      bullet('حذف جميع حسابات المشتركين (SUPER_ADMIN فقط)'),

      // ==================== Page 3: Tribes ====================
      heading('٣. المجموعات (Tribes)'),
      para('إدارة المجموعات/الفرق التي ينتمي إليها المشتركون:'),
      bullet('إنشاء مجموعة جديدة (الاسم، اللون، الوصف، الحد الأقصى للأعضاء)'),
      bullet('تعديل بيانات المجموعة'),
      bullet('عرض عدد الأعضاء وإجمالي نقاط المجموعة'),
      bullet('كل مجموعة لها لون مميز يظهر في جميع الصفحات'),

      // ==================== Page 4: Sessions ====================
      heading('٤. الجلسات (Sessions)'),
      para('إدارة جلسات المؤتمر والحضور:'),
      spacer(),

      subheading('إدارة الجلسات:'),
      bullet('إنشاء جلسة جديدة (العنوان، المتحدث، المكان، التاريخ، الوقت، نقاط المكافأة، السعة)'),
      bullet('تعديل بيانات الجلسة'),
      bullet('تغيير حالة الجلسة: مجدولة ← نشطة ← مكتملة'),
      bullet('إعادة إنشاء رمز QR للجلسة'),
      spacer(),

      subheading('رمز QR:'),
      bullet('عرض رمز QR كصورة (SVG) بجودة عالية'),
      bullet('نسخ الرمز للمشاركة'),
      bullet('يمكن طباعة الرمز أو عرضه على الشاشة'),
      spacer(),

      subheading('الحضور:'),
      bullet('النقر على بطاقة الجلسة يفتح قائمة الحاضرين'),
      bullet('عرض عدد الحاضرين / السعة الكلية'),
      bullet('عرض إجمالي النقاط الممنوحة'),
      bullet('كل حاضر يظهر مع لون مجموعته'),

      // ==================== Page 5: Quizzes ====================
      heading('٥. المسابقات (Quizzes)'),
      para('نظام المسابقات التفاعلية مع التقييم التلقائي:'),
      spacer(),

      subheading('إنشاء مسابقة:'),
      bullet('العنوان + الوصف'),
      bullet('نقاط المكافأة (XP)'),
      bullet('نسبة النجاح (%)'),
      bullet('المهلة الزمنية (بالثواني)'),
      spacer(),

      subheading('إضافة الأسئلة:'),
      bullet('اختيار من متعدد (4 خيارات)'),
      bullet('صح / خطأ'),
      bullet('إجابة قصيرة'),
      bullet('لكل سؤال: الإجابة الصحيحة + التوضيح + النقاط + الترتيب'),
      spacer(),

      subheading('إدارة الحالة:'),
      bullet('مسودة (DRAFT) → نشطة (ACTIVE) → مغلقة (CLOSED)'),
      spacer(),

      subheading('عرض النتائج:'),
      bullet('النقر على بطاقة المسابقة يفتح تفاصيل كاملة'),
      bullet('إحصائيات: إجمالي المشاركات، الناجحين، الراسبين، متوسط الدرجة'),
      bullet('قائمة المشاركين مع الدرجة ونتيجة النجاح/الرسوب'),
      bullet('عرض الأسئلة مع الإجابات الصحيحة'),

      // ==================== Page 6: XP & Leaderboard ====================
      heading('٦. النقاط والترتيب (XP & Leaderboard)'),
      para('إدارة نقاط الخبرة والمستويات:'),
      spacer(),

      subheading('ترتيب فردي:'),
      bullet('قائمة المستخدمين مرتبة حسب النقاط'),
      bullet('عرض المستوى الحالي + لون المجموعة'),
      spacer(),

      subheading('ترتيب المجموعات:'),
      bullet('إجمالي نقاط كل مجموعة'),
      bullet('عدد الأعضاء'),
      spacer(),

      subheading('منح النقاط:'),
      bullet('اختيار المستخدم من القائمة'),
      bullet('تحديد المبلغ (1-500)'),
      bullet('كتابة السبب'),
      spacer(),

      subheading('المستويات (Levels):'),
      bullet('إنشاء مستويات (مثال: برونزي 0-100، فضي 101-300، ذهبي 301+)'),
      bullet('كل مستوى: اسم + ترتيب + حد أدنى XP + حد أقصى + لون + شارة'),
      bullet('التعيين التلقائي: عند منح نقاط يتم ترقية المستخدم تلقائياً'),
      bullet('إعادة حساب جميع المستويات بضغطة واحدة'),

      // ==================== Page 7: Bonus ====================
      heading('٧. المكافآت (Bonus)'),
      para('نظام مكافآت QR للتوزيع خلال المؤتمر:'),
      spacer(),

      subheading('إنشاء مكافأة QR:'),
      bullet('مقدار النقاط (1-500)'),
      bullet('التسمية (مثال: مكافأة ورشة العمل)'),
      bullet('الحد الأقصى للمطالبات'),
      spacer(),

      subheading('إدارة المكافآت:'),
      bullet('عرض جميع رموز QR المنشأة'),
      bullet('لكل رمز: عدد المطالبات / الحد الأقصى + الحالة (نشط/معطّل)'),
      bullet('تعطيل الرمز لإيقافه'),
      bullet('عرض رمز QR كصورة جاهزة للطباعة'),
      spacer(),

      subheading('عرض المطالبات:'),
      bullet('النقر على أيقونة العين أو عدد المطالبات'),
      bullet('يظهر قائمة بجميع المستخدمين الذين استلموا المكافأة'),
      bullet('لكل مستخدم: الاسم + البريد + تاريخ الاستلام'),
      spacer(),

      subheading('المنحة المباشرة (Staff Award):'),
      bullet('منح نقاط مباشرة لمستخدم عبر مسح رمز QR الشخصي'),
      bullet('يستخدم من قبل المشرفين في الموقع'),

      // ==================== Page 8: Sports ====================
      heading('٨. الرياضة (Sports)'),
      para('إدارة دوري كرة القدم المصاحب للمؤتمر:'),
      spacer(),

      subheading('الفرق:'),
      bullet('إنشاء فريق (الاسم، اللون، الحد الأقصى للقائمة)'),
      bullet('إضافة لاعبين من قائمة المستخدمين (مع خانات اختيار)'),
      bullet('إزالة لاعبين'),
      bullet('عرض تفاصيل الفريق: اللاعبين + نقاطهم الرياضية والمؤتمرية'),
      spacer(),

      subheading('المباريات:'),
      bullet('جدولة مباراة (الفريق المضيف، الضيف، التاريخ، المكان)'),
      bullet('بدء المباراة'),
      bullet('إنهاء المباراة بإدخال النتيجة'),
      bullet('إضافة أحداث (هدف، تمريرة، بطاقة صفراء/حمراء، تبديل)'),
      spacer(),

      subheading('الترتيب:'),
      bullet('جدول الترتيب التلقائي'),
      bullet('عدد المباريات، الفوز، التعادل، الخسارة، فارق الأهداف، النقاط'),

      // ==================== Page 9: General Features ====================
      heading('٩. الميزات العامة'),
      spacer(),

      subheading('دعم اللغة العربية:'),
      bullet('جميع النصوص والأزرار والعناوين مترجمة للعربية'),
      bullet('اتجاه من اليمين لليسار (RTL) تلقائي'),
      bullet('زر التبديل بين العربية والإنجليزية'),
      bullet('اللغة الافتراضية: العربية'),
      spacer(),

      subheading('الأمان:'),
      bullet('تسجيل دخول بـ JWT (رمز وصول 15 دقيقة + رمز تجديد 7 أيام)'),
      bullet('صلاحيات حسب الدور (مشترك، مشرف، مسؤول، مسؤول أعلى)'),
      bullet('تشفير كلمات المرور (bcrypt)'),
      spacer(),

      subheading('تجربة المستخدم:'),
      bullet('تحديث البيانات تلقائياً بدون إعادة تحميل'),
      bullet('إشعارات نجاح/خطأ لكل عملية'),
      bullet('تأكيد قبل العمليات الحساسة (الحذف)'),
      bullet('تصميم متجاوب يعمل على جميع الشاشات'),
      bullet('رموز QR بجودة عالية (SVG, Error Correction Level H)'),

      // ==================== Credentials ====================
      heading('١٠. بيانات الدخول'),
      spacer(),
      para('البريد: admin@ikigai.quest'),
      para('كلمة المرور: Ikigai@2026'),
      para('الرابط: http://localhost:5175'),
    ],
  }],
});

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: 'Arial' })],
  });
}

function subheading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, font: 'Arial' })],
  });
}

function para(text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 24, font: 'Arial' })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 24, font: 'Arial' })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}

function note(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: '💡 ', size: 24 }),
      new TextRun({ text, size: 22, font: 'Arial', italics: true, color: '555555' }),
    ],
  });
}

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('docs/IKIGAI_Admin_Guide_AR.docx', buffer);
console.log('✅ Generated: docs/IKIGAI_Admin_Guide_AR.docx');
