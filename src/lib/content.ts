// Editorial / demo content kept outside of the transactional database layer.
// Blog articles are authored content; reviews are explicitly marked as demo
// data per the project brief and must never be attributed to real people.

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "healthy-routine-for-your-pet",
    category: "نمط حياة",
    title: "خمس عادات يومية تحافظ على صحة حيوانك الأليف",
    excerpt:
      "رعاية الحيوانات الأليفة لا تقتصر على زيارة العيادة فقط، بل تبدأ من عادات بسيطة في المنزل.",
    date: "2026-01-12",
    readTime: "٤ دقائق قراءة",
    image:
      "https://images.pexels.com/photos/14751278/pexels-photo-14751278.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    content: [
      "الروتين اليومي لحيوانك الأليف ينعكس مباشرة على صحته الجسدية والنفسية. ابدأ بتخصيص وقت ثابت للطعام والنشاط البدني كل يوم.",
      "احرص على فحص فرو حيوانك وأسنانه أسبوعيًا للكشف المبكر عن أي تغيرات غير طبيعية.",
      "لا تهمل الزيارات الدورية للعيادة البيطرية حتى في غياب أي أعراض ظاهرة، فالفحص الوقائي يوفر الكثير لاحقًا.",
      "الترابط العاطفي مع حيوانك له أثر حقيقي على صحته؛ خصص وقتًا يوميًا للعب والتواصل.",
    ],
  },
  {
    slug: "bonding-with-your-pet",
    category: "سلوك",
    title: "كيف تبني رابطة ثقة حقيقية مع كلبك أو قطتك",
    excerpt:
      "الثقة بين الحيوان ومالكه أساس كل تدريب وكل علاقة صحية، وهي تُبنى بالتدريج والصبر.",
    date: "2026-01-28",
    readTime: "٥ دقائق قراءة",
    image:
      "https://images.pexels.com/photos/5482608/pexels-photo-5482608.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    content: [
      "تبدأ الثقة من لغة الجسد الهادئة والصوت المطمئن عند التعامل مع حيوانك، خصوصًا في المواقف الجديدة.",
      "كافئ السلوك الجيد فورًا، فالحيوانات تتعلم بالارتباط الزمني القريب بين الفعل والمكافأة.",
      "تجنب العقاب البدني أو الصراخ، فهو يضعف الثقة ويزيد من القلق لدى الحيوان.",
      "الزيارات البيطرية المنتظمة، حين تكون تجربة هادئة وإيجابية، تعزز شعور حيوانك بالأمان في كل بيئة جديدة.",
    ],
  },
  {
    slug: "grooming-and-hygiene-tips",
    category: "العناية والنظافة",
    title: "دليلك لعناية منزلية صحيحة بفراء وجلد حيوانك",
    excerpt:
      "العناية بالنظافة ليست رفاهية، بل جزء أساسي من الوقاية من المشاكل الجلدية والطفيليات.",
    date: "2026-02-09",
    readTime: "٣ دقائق قراءة",
    image:
      "https://images.pexels.com/photos/9952105/pexels-photo-9952105.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    content: [
      "استخدم منتجات عناية مخصصة للحيوانات فقط، فمنتجات العناية البشرية قد تهيّج جلد الحيوان.",
      "التمشيط المنتظم يقلل من تساقط الفرو ويساعد في اكتشاف أي علامات مبكرة للطفيليات.",
      "لا تُفرط في الاستحمام؛ فالتكرار الزائد قد يُجرّد الجلد من زيوته الطبيعية الواقية.",
      "استشر فريقنا البيطري لاختيار نظام عناية يناسب نوع الفراء وحساسية الجلد الخاصة بحيوانك.",
    ],
  },
];

export type DemoReview = {
  initials: string;
  petType: "كلب" | "قطة";
  rating: number;
  text: string;
};

// Clearly marked as demo content — not attributed to verified real customers.
export const demoReviews: DemoReview[] = [
  {
    initials: "س.م",
    petType: "كلب",
    rating: 5,
    text: "تجربة حجز سلسة جدًا والفريق كان متفهمًا لحالة كلبي ومتابعًا بعد الزيارة.",
  },
  {
    initials: "ن.ع",
    petType: "قطة",
    rating: 5,
    text: "عيادة مرتبة وهادئة، وقطتي لم تشعر بالتوتر المعتاد أثناء الكشف.",
  },
  {
    initials: "ر.ط",
    petType: "كلب",
    rating: 4,
    text: "المتجر الإلكتروني عملي جدًا، طلبت غذاء علاجيًا ووصل بسرعة مع شرح واضح للاستخدام.",
  },
];
