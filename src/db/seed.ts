import "dotenv/config";
import { db, pool } from "./index";
import {
  clinics,
  branches,
  doctors,
  services,
  products,
  productCategories,
  doctorServices,
  doctorBranches,
  serviceProducts,
} from "./schema";

const img = {
  hero: "https://images.pexels.com/photos/19490691/pexels-photo-19490691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1600",
  intro:
    "https://images.pexels.com/photos/5495141/pexels-photo-5495141.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000",
  svcExam:
    "https://images.pexels.com/photos/7468978/pexels-photo-7468978.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcVaccine:
    "https://images.pexels.com/photos/6235017/pexels-photo-6235017.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcSurgery:
    "https://images.pexels.com/photos/6627704/pexels-photo-6627704.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcDental:
    "https://images.pexels.com/photos/6627689/pexels-photo-6627689.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcXray:
    "https://images.pexels.com/photos/6502039/pexels-photo-6502039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcLab:
    "https://images.pexels.com/photos/6627687/pexels-photo-6627687.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcGrooming:
    "https://images.pexels.com/photos/19145895/pexels-photo-19145895.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  svcParasite:
    "https://images.pexels.com/photos/7469274/pexels-photo-7469274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  doc1: "https://images.pexels.com/photos/32788235/pexels-photo-32788235.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
  doc2: "https://images.pexels.com/photos/6235664/pexels-photo-6235664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
  doc3: "https://images.pexels.com/photos/28644631/pexels-photo-28644631.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
  doc4: "https://images.pexels.com/photos/39550296/pexels-photo-39550296.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960",
  branch1:
    "https://images.pexels.com/photos/4269274/pexels-photo-4269274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300",
  branch2:
    "https://images.pexels.com/photos/38055773/pexels-photo-38055773.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1300",
  prodCatFood:
    "https://images.pexels.com/photos/723130/pexels-photo-723130.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodDogFood:
    "https://images.pexels.com/photos/13581209/pexels-photo-13581209.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodDental:
    "https://images.pexels.com/photos/9248865/pexels-photo-9248865.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodGrooming:
    "https://images.pexels.com/photos/19145879/pexels-photo-19145879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodSupplements:
    "https://images.pexels.com/photos/28959769/pexels-photo-28959769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodParasite:
    "https://images.pexels.com/photos/11702792/pexels-photo-11702792.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodLeash:
    "https://images.pexels.com/photos/38398910/pexels-photo-38398910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodCatToy:
    "https://images.pexels.com/photos/14852081/pexels-photo-14852081.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodDentalChew:
    "https://images.pexels.com/photos/12351707/pexels-photo-12351707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
  prodLitter:
    "https://images.pexels.com/photos/9484964/pexels-photo-9484964.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000",
};

const OPEN_STANDARD = {
  "0": [["10:00", "20:00"]],
  "1": [["10:00", "20:00"]],
  "2": [["10:00", "20:00"]],
  "3": [["10:00", "20:00"]],
  "4": [["10:00", "20:00"]],
  "5": [],
  "6": [["14:00", "20:00"]],
};

const OPEN_BRANCH_TWO = {
  "0": [["11:00", "21:00"]],
  "1": [["11:00", "21:00"]],
  "2": [["11:00", "21:00"]],
  "3": [["11:00", "21:00"]],
  "4": [["11:00", "21:00"]],
  "5": [],
  "6": [["15:00", "21:00"]],
};

async function main() {
  console.log("Seeding database…");

  await db.delete(serviceProducts);
  await db.delete(doctorBranches);
  await db.delete(doctorServices);
  await db.delete(products);
  await db.delete(productCategories);
  await db.delete(services);
  await db.delete(doctors);
  await db.delete(branches);
  await db.delete(clinics);

  const [clinicRow] = await db
    .insert(clinics)
    .values({
      name: "عيادة المخالب الناعمة",
      description: "رعاية بيطرية متكاملة تجمع بين الخبرة الطبية والدفء الإنساني.",
      phone: process.env.PHONE_NUMBER || null,
      email: process.env.CLINIC_EMAIL || null,
      whatsappNumber: process.env.WHATSAPP_NUMBER || null,
      whatsappLink: process.env.WHATSAPP_LINK || null,
      instagramLink: process.env.INSTAGRAM_LINK || null,
    })
    .returning();

  const [branch1, branch2] = await db
    .insert(branches)
    .values([
      {
        clinicId: clinicRow.id,
        name: "فرع العليا",
        slug: "al-olaya",
        address: "طريق الملك فهد، حي العليا",
        city: "الرياض",
        phone: "[PHONE_NUMBER]",
        whatsapp: "[WHATSAPP_NUMBER]",
        googleMapsUrl: "[GOOGLE_MAPS_URL]",
        openingHours: OPEN_STANDARD,
        latitude: "24.713552",
        longitude: "46.675297",
        imageUrl: img.branch1,
      },
      {
        clinicId: clinicRow.id,
        name: "فرع الياسمين",
        slug: "al-yasmin",
        address: "شارع الأمير متعب بن عبدالعزيز، حي الياسمين",
        city: "الرياض",
        phone: "[PHONE_NUMBER]",
        whatsapp: "[WHATSAPP_NUMBER]",
        googleMapsUrl: "[GOOGLE_MAPS_URL]",
        openingHours: OPEN_BRANCH_TWO,
        latitude: "24.822222",
        longitude: "46.634722",
        imageUrl: img.branch2,
      },
    ])
    .returning();

  const [doc1, doc2, doc3, doc4] = await db
    .insert(doctors)
    .values([
      {
        clinicId: clinicRow.id,
        name: "د. سارة المطيري",
        slug: "sara-almutairi",
        specialty: "الطب الباطني العام",
        bio: "تتمتع الدكتورة سارة بخبرة واسعة في التشخيص الباطني للحيوانات الأليفة، وتؤمن بأن الفحص الدقيق والتواصل الهادئ مع المالك هما أساس رعاية حقيقية.",
        experience: "9 سنوات خبرة",
        certificates: ["بكالوريوس الطب البيطري", "زمالة في طب الحيوانات الصغيرة"],
        imageUrl: img.doc1,
      },
      {
        clinicId: clinicRow.id,
        name: "د. خالد العتيبي",
        slug: "khaled-alotaibi",
        specialty: "الجراحة البيطرية",
        bio: "يقود الدكتور خالد قسم الجراحة بدقة عالية واهتمام بأدق التفاصيل، مع التزام تام بأعلى معايير السلامة قبل وبعد العمليات.",
        experience: "12 سنة خبرة",
        certificates: ["ماجستير الجراحة البيطرية", "تدريب متقدم في جراحة العظام"],
        imageUrl: img.doc2,
      },
      {
        clinicId: clinicRow.id,
        name: "د. منى الحربي",
        slug: "mona-alharbi",
        specialty: "طب القطط والأمراض الجلدية",
        bio: "متخصصة في طب القطط والعناية الجلدية، تعمل الدكتورة منى على خلق تجربة فحص هادئة تقلل من توتر الحيوان قدر الإمكان.",
        experience: "7 سنوات خبرة",
        certificates: ["بكالوريوس الطب البيطري", "دبلوم الأمراض الجلدية البيطرية"],
        imageUrl: img.doc3,
      },
      {
        clinicId: clinicRow.id,
        name: "د. فهد القحطاني",
        slug: "fahad-alqahtani",
        specialty: "طب الأسنان والتخدير",
        bio: "يجمع الدكتور فهد بين دقة طب الأسنان البيطري وخبرة واسعة في بروتوكولات التخدير الآمن للحيوانات بمختلف أعمارها.",
        experience: "10 سنوات خبرة",
        certificates: ["بكالوريوس الطب البيطري", "شهادة متقدمة في تخدير الحيوانات"],
        imageUrl: img.doc4,
      },
    ])
    .returning();

  const [svcExam, svcVaccine, svcSurgery, svcDental, svcXray, svcLab, svcGrooming, svcParasite] =
    await db
      .insert(services)
      .values([
        {
          clinicId: clinicRow.id,
          name: "الكشف البيطري",
          slug: "veterinary-examination",
          description: "فحص شامل لتقييم الحالة الصحية العامة لحيوانك الأليف.",
          longDescription:
            "الكشف البيطري الشامل هو نقطة الانطلاق لأي رعاية صحية سليمة. يقوم فريقنا الطبي بفحص دقيق يشمل العلامات الحيوية، الوزن، حالة الفراء والجلد، والسلوك العام، لرسم صورة كاملة عن صحة حيوانك.",
          whatWeProvide: [
            "فحص بدني شامل من الرأس حتى الذيل",
            "قياس العلامات الحيوية ودرجة الحرارة",
            "تقييم الوزن والتغذية",
            "استشارة طبية مفصلة مع التوصيات",
          ],
          whenNeeded: [
            "فحص دوري وقائي كل 6-12 شهرًا",
            "عند ملاحظة أي تغير في السلوك أو الشهية",
            "قبل السفر أو قبل التطعيمات",
          ],
          process: [
            { title: "الاستقبال", description: "تسجيل بيانات الحيوان والتاريخ الصحي." },
            { title: "الفحص السريري", description: "فحص شامل من الطبيب المختص." },
            { title: "التوصيات", description: "خطة رعاية أو علاج إن لزم الأمر." },
          ],
          faq: [
            { question: "كم تستغرق مدة الكشف؟", answer: "عادة بين 20 إلى 30 دقيقة حسب حالة الحيوان." },
            { question: "هل أحتاج لحجز موعد مسبق؟", answer: "نعم، يفضل الحجز المسبق لضمان وقت كافٍ مع الطبيب المناسب." },
          ],
          imageUrl: img.svcExam,
        },
        {
          clinicId: clinicRow.id,
          name: "التطعيم",
          slug: "vaccination",
          description: "برامج تحصين متكاملة تحمي حيوانك من الأمراض المعدية.",
          longDescription:
            "نوفر برنامج تطعيمات مصمم حسب عمر ونوع حيوانك الأليف، مع متابعة دقيقة لمواعيد الجرعات التالية لضمان مناعة مستمرة وفعالة.",
          whatWeProvide: [
            "جدول تطعيمات مخصص لكل حيوان",
            "تطعيمات أساسية وموسمية",
            "سجل تحصين موثق",
          ],
          whenNeeded: ["بدءًا من عمر 6-8 أسابيع للجراء والقطط الصغيرة", "جرعات تنشيطية سنوية"],
          process: [
            { title: "التقييم", description: "مراجعة السجل الصحي وتحديد الجرعة المناسبة." },
            { title: "التطعيم", description: "إعطاء الجرعة ومراقبة الحيوان لبضع دقائق." },
            { title: "المتابعة", description: "تحديد موعد الجرعة التالية." },
          ],
          faq: [{ question: "هل التطعيم مؤلم لحيواني؟", answer: "الإجراء سريع جدًا وغير مؤلم في الغالبية العظمى من الحالات." }],
          imageUrl: img.svcVaccine,
        },
        {
          clinicId: clinicRow.id,
          name: "الجراحة",
          slug: "surgery",
          description: "عمليات جراحية آمنة بإشراف فريق متخصص ومعدات معقمة بالكامل.",
          longDescription:
            "يضم قسم الجراحة لدينا غرفة عمليات مجهزة بالكامل وفريقًا مدربًا على أحدث بروتوكولات التخدير والسلامة، بدءًا من العمليات البسيطة وحتى الحالات الأكثر تعقيدًا.",
          whatWeProvide: ["تقييم ما قبل الجراحة", "بروتوكولات تخدير آمنة", "متابعة ما بعد العملية"],
          whenNeeded: ["الحالات الطارئة", "عمليات التعقيم المخطط لها", "إصابات العظام والأنسجة"],
          process: [
            { title: "الفحص قبل الجراحة", description: "تحاليل وتقييم شامل لجاهزية الحيوان." },
            { title: "العملية", description: "تنفيذ الإجراء الجراحي بإشراف طبي كامل." },
            { title: "التعافي", description: "متابعة ما بعد العملية وخطة تعافٍ واضحة." },
          ],
          faq: [{ question: "هل الجراحة تتطلب مبيتًا في العيادة؟", answer: "يعتمد ذلك على نوع العملية، وسيوضح الطبيب ذلك بعد التقييم." }],
          imageUrl: img.svcSurgery,
        },
        {
          clinicId: clinicRow.id,
          name: "طب الأسنان",
          slug: "dental-care",
          description: "عناية متخصصة بصحة الفم والأسنان للوقاية من الالتهابات واللثة.",
          longDescription:
            "صحة الأسنان جزء غالبًا ما يُغفل عنه في رعاية الحيوانات الأليفة. نقدم تنظيفًا احترافيًا وفحصًا دوريًا للكشف المبكر عن أي مشاكل في اللثة أو الأسنان.",
          whatWeProvide: ["تنظيف أسنان احترافي", "فحص اللثة والأنسجة الداعمة", "استشارات حول العناية المنزلية"],
          whenNeeded: ["رائحة فم غير معتادة", "صعوبة في المضغ", "فحص دوري سنوي"],
          process: [
            { title: "الفحص", description: "تقييم حالة الفم والأسنان." },
            { title: "التنظيف", description: "إزالة الجير والترسبات بأمان." },
            { title: "التوصيات", description: "نصائح للعناية المنزلية المستمرة." },
          ],
          faq: [{ question: "هل تنظيف الأسنان يتطلب تخديرًا؟", answer: "نعم غالبًا، لضمان سلامة الحيوان وراحته أثناء الإجراء." }],
          imageUrl: img.svcDental,
        },
        {
          clinicId: clinicRow.id,
          name: "الأشعة",
          slug: "radiology",
          description: "تصوير تشخيصي دقيق يساعد في الكشف المبكر عن المشاكل الداخلية.",
          longDescription:
            "تساعد الأشعة في تشخيص الكسور وحالات الجهاز الهضمي والتنفسي وغيرها، ونعتمد على أجهزة حديثة توفر صورًا عالية الدقة في وقت قصير.",
          whatWeProvide: ["أشعة سينية رقمية", "تقارير تشخيصية مفصلة", "تنسيق مباشر مع الطبيب المعالج"],
          whenNeeded: ["إصابات العظام المحتملة", "تقييم ما قبل الجراحة", "أعراض تنفسية أو هضمية غير مفسرة"],
          process: [
            { title: "التحضير", description: "تهيئة الحيوان للتصوير بأمان." },
            { title: "التصوير", description: "التقاط الصور اللازمة." },
            { title: "التقرير", description: "مراجعة النتائج مع الطبيب المختص." },
          ],
          faq: [{ question: "هل الأشعة آمنة لحيواني؟", answer: "نعم، الجرعات المستخدمة آمنة وموجهة فقط للمنطقة المطلوبة." }],
          imageUrl: img.svcXray,
        },
        {
          clinicId: clinicRow.id,
          name: "المختبر",
          slug: "laboratory",
          description: "تحاليل دم ومختبر داخلي لتشخيص سريع وموثوق.",
          longDescription:
            "يوفر مختبرنا الداخلي نتائج تحاليل الدم والبول والبراز خلال وقت قصير، مما يساعد الطبيب على اتخاذ قرار علاجي سريع ودقيق.",
          whatWeProvide: ["تحاليل دم شاملة", "فحوصات البول والبراز", "نتائج سريعة داخل العيادة"],
          whenNeeded: ["فحوصات دورية قبل التخدير", "أعراض غير مفسرة", "متابعة أمراض مزمنة"],
          process: [
            { title: "سحب العينة", description: "بأمان وبأقل قدر من التوتر للحيوان." },
            { title: "التحليل", description: "تحليل العينة داخل مختبر العيادة." },
            { title: "النتائج", description: "مراجعة النتائج مع الطبيب المعالج." },
          ],
          faq: [{ question: "متى تظهر النتائج؟", answer: "غالبية التحاليل الأساسية تظهر خلال ساعة من سحب العينة." }],
          imageUrl: img.svcLab,
        },
        {
          clinicId: clinicRow.id,
          name: "العناية والتجميل",
          slug: "grooming",
          description: "استحمام وتهذيب فراء احترافي يحافظ على نظافة وراحة حيوانك.",
          longDescription:
            "تساهم جلسات العناية المنتظمة في الحفاظ على صحة الجلد والفراء، وتمنحنا فرصة لاكتشاف أي مشاكل جلدية أو طفيليات في وقت مبكر.",
          whatWeProvide: ["استحمام بمنتجات مخصصة", "تهذيب وتقليم الفراء", "تقليم الأظافر وتنظيف الأذن"],
          whenNeeded: ["كل 4-6 أسابيع حسب نوع الفراء", "قبل المناسبات أو السفر"],
          process: [
            { title: "الاستقبال", description: "تقييم حالة الفراء والجلد." },
            { title: "العناية", description: "استحمام وتهذيب احترافي." },
            { title: "اللمسة الأخيرة", description: "تجفيف وتنعيم نهائي." },
          ],
          faq: [{ question: "هل الجلسة مناسبة للحيوانات القلقة؟", answer: "فريقنا مدرب على التعامل بهدوء مع الحيوانات الحساسة للتجربة." }],
          imageUrl: img.svcGrooming,
        },
        {
          clinicId: clinicRow.id,
          name: "علاج الطفيليات",
          slug: "parasite-control",
          description: "برامج وقاية وعلاج من القراد والبراغيث والديدان الداخلية.",
          longDescription:
            "الطفيليات الخارجية والداخلية قد تسبب مشاكل صحية خطيرة إن أهملت. نقدم خطط وقاية دورية وعلاج فعّال حسب عمر ووزن الحيوان.",
          whatWeProvide: ["برامج وقاية موسمية", "علاج القراد والبراغيث", "علاج الديدان الداخلية"],
          whenNeeded: ["الحكة المستمرة", "ظهور علامات طفيليات ظاهرة", "وقاية دورية كل 3 أشهر"],
          process: [
            { title: "الفحص", description: "تحديد نوع الطفيليات إن وجدت." },
            { title: "العلاج", description: "وصف العلاج المناسب للعمر والوزن." },
            { title: "الوقاية", description: "خطة وقاية مستمرة لتفادي التكرار." },
          ],
          faq: [{ question: "هل العلاج آمن للجراء والقطط الصغيرة؟", answer: "نعم، نحدد الجرعة والمنتج المناسب حسب العمر والوزن بدقة." }],
          imageUrl: img.svcParasite,
        },
      ])
      .returning();

  await db
    .insert(productCategories)
    .values([
      { name: "طعام", slug: "food" },
      { name: "مكملات", slug: "supplements" },
      { name: "العناية", slug: "care" },
      { name: "النظافة", slug: "hygiene" },
      { name: "القطط", slug: "cats" },
      { name: "الكلاب", slug: "dogs" },
      { name: "الإكسسوارات", slug: "accessories" },
      { name: "العناية بالأسنان", slug: "dental" },
    ]);

  const categories = await db.select().from(productCategories);
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const insertedProducts = await db
    .insert(products)
    .values([
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["food"],
        name: "غذاء جاف فاخر للقطط",
        slug: "premium-cat-dry-food",
        brand: "Soft Paws Nutrition",
        description: "غذاء متوازن غنيّ بالبروتين يدعم صحة الجهاز الهضمي ولمعان الفراء لدى القطط البالغة.",
        benefits: ["يدعم صحة الجهاز الهضمي", "يحافظ على لمعان الفراء", "خالٍ من الحبوب المسببة للحساسية"],
        ingredients: ["دجاج طازج", "أرز بني", "زيت السمك", "فيتامينات ومعادن متوازنة"],
        usage: "يقدم حسب وزن القطة، بمعدل وجبتين يوميًا مع توفير ماء عذب باستمرار.",
        warnings: "يُحفظ في مكان جاف وبارد بعيدًا عن متناول الأطفال.",
        specifications: [
          { label: "الوزن", value: "3 كجم" },
          { label: "الفئة العمرية", value: "قطط بالغة" },
        ],
        price: "149.00",
        stock: 42,
        rating: "4.8",
        reviewsCount: 56,
        imageUrl: img.prodCatFood,
        petType: "cat",
        featured: true,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["food"],
        name: "غذاء جاف متكامل للكلاب",
        slug: "complete-dog-dry-food",
        brand: "Soft Paws Nutrition",
        description: "تركيبة غذائية كاملة تمنح كلبك الطاقة والعناصر الغذائية اللازمة لنشاط يومي متوازن.",
        benefits: ["طاقة متوازنة طوال اليوم", "يدعم صحة المفاصل", "نكهة محببة لمعظم السلالات"],
        ingredients: ["لحم بقري", "بطاطا حلوة", "زيت الكانولا", "مزيج فيتامينات"],
        usage: "يُقدم حسب الوزن ومستوى النشاط، مقسمًا على وجبتين يوميًا.",
        warnings: "يُحفظ بعيدًا عن الرطوبة والحرارة المباشرة.",
        specifications: [
          { label: "الوزن", value: "5 كجم" },
          { label: "الفئة العمرية", value: "كلاب بالغة" },
        ],
        price: "189.00",
        stock: 35,
        rating: "4.7",
        reviewsCount: 48,
        imageUrl: img.prodDogFood,
        petType: "dog",
        featured: true,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["dental"],
        name: "جل عناية بالفم والأسنان",
        slug: "oral-care-gel",
        brand: "Soft Paws Dental",
        description: "جل يومي سهل الاستخدام يقلل تراكم الجير ويحافظ على رائحة فم منعشة.",
        benefits: ["يقلل تراكم الجير", "ينعش رائحة الفم", "سهل الاستخدام يوميًا"],
        ingredients: ["مستخلص النعناع", "إنزيمات طبيعية مضادة للبكتيريا"],
        usage: "يوضع على الأسنان مباشرة أو يضاف لماء الشرب يوميًا.",
        warnings: "للاستخدام الخارجي والفموي فقط، يُبعد عن متناول الأطفال.",
        specifications: [{ label: "الحجم", value: "120 مل" }],
        price: "69.00",
        stock: 60,
        rating: "4.6",
        reviewsCount: 31,
        imageUrl: img.prodDental,
        petType: "both",
        featured: true,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["hygiene"],
        name: "شامبو فرو فاخر بزيت الأرغان",
        slug: "argan-grooming-shampoo",
        brand: "Soft Paws Grooming",
        description: "شامبو لطيف على الجلد ينظف بعمق ويمنح الفراء نعومة ولمعانًا طبيعيًا.",
        benefits: ["لطيف على البشرة الحساسة", "يمنح لمعانًا طبيعيًا", "رائحة منعشة تدوم طويلًا"],
        ingredients: ["زيت الأرغان", "خلاصة الصبار", "مكونات لطيفة خالية من الصابون القاسي"],
        usage: "يُدلّك على الفراء المبلل ثم يُشطف جيدًا بالماء الدافئ.",
        warnings: "يُجنّب ملامسة العينين، وفي حال التهيج يُشطف فورًا بالماء.",
        specifications: [{ label: "الحجم", value: "300 مل" }],
        price: "79.00",
        stock: 50,
        rating: "4.9",
        reviewsCount: 64,
        imageUrl: img.prodGrooming,
        petType: "both",
        featured: true,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["supplements"],
        name: "مكمل الحيوية والمفاصل",
        slug: "vitality-joint-supplement",
        brand: "Soft Paws Vital",
        description: "مكمل غذائي يدعم صحة المفاصل ومستوى النشاط لدى الكلاب والقطط النشطة أو المسنّة.",
        benefits: ["يدعم مرونة المفاصل", "يعزز مستوى الطاقة", "مناسب للأعمار المتقدمة"],
        ingredients: ["غلوكوزامين", "أوميغا 3", "فيتامين إي"],
        usage: "حبة واحدة يوميًا مع الطعام، أو حسب إرشاد الطبيب البيطري.",
        warnings: "استشر الطبيب البيطري قبل الاستخدام مع أي أدوية أخرى.",
        specifications: [{ label: "العبوة", value: "60 كبسولة" }],
        price: "99.00",
        stock: 38,
        rating: "4.5",
        reviewsCount: 22,
        imageUrl: img.prodSupplements,
        petType: "both",
        featured: false,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["care"],
        name: "واقي القراد والبراغيث الشهري",
        slug: "monthly-parasite-shield",
        brand: "Soft Paws Protect",
        description: "حماية شهرية فعالة من القراد والبراغيث والطفيليات الخارجية الشائعة.",
        benefits: ["حماية تدوم شهرًا كاملًا", "سهل التطبيق", "مناسب لمختلف الأوزان"],
        ingredients: ["فيبرونيل", "مادة فعالة مضادة للطفيليات معتمدة بيطريًا"],
        usage: "يُطبّق على الجلد بين لوحي الكتف مرة واحدة شهريًا.",
        warnings: "لا يُستخدم للجراء أقل من 8 أسابيع إلا بعد استشارة الطبيب.",
        specifications: [{ label: "العبوة", value: "3 أنابيب" }],
        price: "119.00",
        stock: 27,
        rating: "4.6",
        reviewsCount: 19,
        imageUrl: img.prodParasite,
        petType: "both",
        featured: false,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["accessories"],
        name: "طوق ومقود جلدي فاخر",
        slug: "leather-collar-leash-set",
        brand: "Soft Paws Comfort",
        description: "طقم طوق ومقود من الجلد الطبيعي المعالج، مريح ومتين للاستخدام اليومي.",
        benefits: ["جلد طبيعي معالج", "تصميم مريح وأنيق", "متين للاستخدام اليومي"],
        ingredients: [],
        usage: "يُضبط الطوق بما يتناسب مع محيط رقبة الحيوان مع ترك مساحة لإصبعين.",
        warnings: "يُراقب الحيوان أثناء الاستخدام الأول لضمان الراحة.",
        specifications: [{ label: "المقاس", value: "متوسط - كبير" }],
        price: "139.00",
        stock: 20,
        rating: "4.7",
        reviewsCount: 15,
        imageUrl: img.prodLeash,
        petType: "dog",
        featured: false,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["accessories"],
        name: "لعبة قطط يدوية الصنع",
        slug: "handmade-cat-toy",
        brand: "Soft Paws Play",
        description: "لعبة قماشية آمنة ومحشوة بعشبة القطط لتحفيز النشاط الذهني والحركي.",
        benefits: ["تحفّز الغريزة الطبيعية للعب", "خامات آمنة وصديقة للقطط", "تصميم يدوي متين"],
        ingredients: ["قماش قطني", "حشوة عشبة القطط الطبيعية"],
        usage: "تُقدّم للقطة تحت الإشراف، وتُستبدل عند ظهور علامات تلف.",
        warnings: "غير مخصصة للمضغ الشديد أو الابتلاع.",
        specifications: [{ label: "الحجم", value: "مقاس واحد" }],
        price: "35.00",
        stock: 70,
        rating: "4.8",
        reviewsCount: 27,
        imageUrl: img.prodCatToy,
        petType: "cat",
        featured: false,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["dental"],
        name: "أعواد تنظيف الأسنان الطبيعية",
        slug: "natural-dental-chew-sticks",
        brand: "Soft Paws Dental",
        description: "أعواد مضغ طبيعية تساعد على إزالة الجير وتعزيز صحة اللثة أثناء المضغ اليومي.",
        benefits: ["يقلل تراكم الجير بالمضغ الطبيعي", "يقوّي اللثة", "نكهة طبيعية محببة"],
        ingredients: ["نشا البطاطا", "سليلوز نباتي", "نكهات طبيعية"],
        usage: "يُقدم عود واحد يوميًا كجزء من الروتين الغذائي.",
        warnings: "يُراقب الحيوان أثناء المضغ لتجنب ابتلاع قطع كبيرة.",
        specifications: [{ label: "العبوة", value: "14 قطعة" }],
        price: "55.00",
        stock: 45,
        rating: "4.5",
        reviewsCount: 18,
        imageUrl: img.prodDentalChew,
        petType: "dog",
        featured: false,
      },
      {
        clinicId: clinicRow.id,
        categoryId: catBySlug["hygiene"],
        name: "رمل قطط عالي الامتصاص",
        slug: "smart-clumping-cat-litter",
        brand: "Soft Paws Comfort",
        description: "رمل قطط متكتل عالي الامتصاص يحد من الروائح ويسهل التنظيف اليومي.",
        benefits: ["امتصاص سريع وفعّال", "يحد من انتشار الروائح", "غبار منخفض جدًا"],
        ingredients: ["بنتونيت طبيعي معالج"],
        usage: "يُفرش بارتفاع 5-7 سم في صندوق الفضلات، ويُجدد أسبوعيًا.",
        warnings: "يُبعد عن متناول الأطفال، ولا يُستخدم كغذاء أو علاج.",
        specifications: [{ label: "الوزن", value: "10 كجم" }],
        price: "59.00",
        stock: 40,
        rating: "4.6",
        reviewsCount: 24,
        imageUrl: img.prodLitter,
        petType: "cat",
        featured: false,
      },
    ])
    .returning();

  // Doctor ↔ Service relations
  const serviceMap = {
    exam: svcExam.id,
    vaccine: svcVaccine.id,
    surgery: svcSurgery.id,
    dental: svcDental.id,
    xray: svcXray.id,
    lab: svcLab.id,
    grooming: svcGrooming.id,
    parasite: svcParasite.id,
  };

  await db.insert(doctorServices).values([
    { doctorId: doc1.id, serviceId: serviceMap.exam },
    { doctorId: doc1.id, serviceId: serviceMap.vaccine },
    { doctorId: doc1.id, serviceId: serviceMap.lab },
    { doctorId: doc1.id, serviceId: serviceMap.parasite },
    { doctorId: doc2.id, serviceId: serviceMap.surgery },
    { doctorId: doc2.id, serviceId: serviceMap.xray },
    { doctorId: doc2.id, serviceId: serviceMap.exam },
    { doctorId: doc3.id, serviceId: serviceMap.exam },
    { doctorId: doc3.id, serviceId: serviceMap.grooming },
    { doctorId: doc3.id, serviceId: serviceMap.parasite },
    { doctorId: doc3.id, serviceId: serviceMap.vaccine },
    { doctorId: doc4.id, serviceId: serviceMap.dental },
    { doctorId: doc4.id, serviceId: serviceMap.surgery },
    { doctorId: doc4.id, serviceId: serviceMap.xray },
  ]);

  // Doctor ↔ Branch relations
  await db.insert(doctorBranches).values([
    { doctorId: doc1.id, branchId: branch1.id },
    { doctorId: doc1.id, branchId: branch2.id },
    { doctorId: doc2.id, branchId: branch1.id },
    { doctorId: doc3.id, branchId: branch2.id },
    { doctorId: doc3.id, branchId: branch1.id },
    { doctorId: doc4.id, branchId: branch1.id },
    { doctorId: doc4.id, branchId: branch2.id },
  ]);

  // Service ↔ Product relations
  const productBySlug = Object.fromEntries(insertedProducts.map((p) => [p.slug, p.id]));
  await db.insert(serviceProducts).values([
    { serviceId: serviceMap.dental, productId: productBySlug["oral-care-gel"] },
    { serviceId: serviceMap.dental, productId: productBySlug["natural-dental-chew-sticks"] },
    { serviceId: serviceMap.grooming, productId: productBySlug["argan-grooming-shampoo"] },
    { serviceId: serviceMap.grooming, productId: productBySlug["handmade-cat-toy"] },
    { serviceId: serviceMap.parasite, productId: productBySlug["monthly-parasite-shield"] },
    { serviceId: serviceMap.exam, productId: productBySlug["vitality-joint-supplement"] },
    { serviceId: serviceMap.vaccine, productId: productBySlug["premium-cat-dry-food"] },
    { serviceId: serviceMap.vaccine, productId: productBySlug["complete-dog-dry-food"] },
  ]);

  console.log("Seed complete:", {
    clinic: clinicRow.name,
    branches: 2,
    doctors: 4,
    services: 8,
    products: insertedProducts.length,
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
