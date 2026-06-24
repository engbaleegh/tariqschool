import type { Locale } from "@/i18n.config";

export type LocalizedItem = {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  date: string;
  category?: string;
  categoryAr?: string;
};

export const schoolInfo = {
  name: {
    en: "Tariq Bin Ziyad Al-Maqatin School",
    ar: "مجمع طارق بن زياد المقاطن",
  },
  tagline: {
    en: "56 years of educational excellence and community service",
    ar: "٥٦ عاماً من التميز التعليمي وخدمة المجتمع",
  },
  phone: "+967773408338",
  email: "info@tariq-school.com",
  whatsapp: "967773408338",
  address: {
    en: "Al-Maqatin, Ibb Governorate, Yemen",
    ar: "اليمن، محافظة إب، المقاطن",
  },
};

export const stats = [
  { value: "1,200+", labelEn: "Students", labelAr: "طالب وطالبة" },
  { value: "25", labelEn: "Teachers", labelAr: "معلم ومدرس" },
  { value: "56", labelEn: "Years Since Opening", labelAr: "عاماً منذ الافتتاح" },
  { value: "98%", labelEn: "Graduation Rate", labelAr: "نسبة التخرج" },
];

export const announcements: LocalizedItem[] = [
  {
    id: "1",
    slug: "semester-registration",
    title: "Semester Registration Opens",
    titleAr: "فتح التسجيل للفصل الدراسي",
    excerpt: "Registration for the new semester is now open for all grades.",
    excerptAr: "التسجيل للفصل الدراسي الجديد مفتوح الآن لجميع الصفوف.",
    date: "2025-06-01",
    category: "Academic",
    categoryAr: "أكاديمي",
  },
  {
    id: "2",
    slug: "parent-meeting",
    title: "Parent-Teacher Meeting",
    titleAr: "اجتماع أولياء الأمور",
    excerpt: "Join us for the quarterly parent-teacher conference.",
    excerptAr: "انضموا إلينا في اجتماع أولياء الأمور الفصلي.",
    date: "2025-05-28",
    category: "Events",
    categoryAr: "فعاليات",
  },
  {
    id: "3",
    slug: "sports-day",
    title: "Annual Sports Day",
    titleAr: "اليوم الرياضي السنوي",
    excerpt: "Students will participate in various athletic competitions.",
    excerptAr: "سيشارك الطلاب في مختلف المسابقات الرياضية.",
    date: "2025-05-20",
    category: "Sports",
    categoryAr: "رياضة",
  },
];

export const blogPosts: LocalizedItem[] = [
  {
    id: "1",
    slug: "stem-fair-highlights",
    title: "STEM Fair Highlights",
    titleAr: "أبرز معرض العلوم والتقنية",
    excerpt: "Our students showcased innovative projects at the annual STEM fair.",
    excerptAr: "عرض طلابنا مشاريع مبتكرة في معرض العلوم والتقنية السنوي.",
    date: "2025-05-15",
  },
  {
    id: "2",
    slug: "reading-week",
    title: "Reading Week Success",
    titleAr: "نجاح أسبوع القراءة",
    excerpt: "Students read over 5,000 books during our reading week initiative.",
    excerptAr: "قرأ الطلاب أكثر من 5000 كتاب خلال مبادرة أسبوع القراءة.",
    date: "2025-05-10",
  },
];

export const activities: LocalizedItem[] = [
  {
    id: "1",
    slug: "science-club",
    title: "Science Club",
    titleAr: "نادي العلوم",
    excerpt: "Hands-on experiments and science exploration for curious minds.",
    excerptAr: "تجارب عملية واستكشاف علمي للعقول الفضولية.",
    date: "2025-06-01",
  },
  {
    id: "2",
    slug: "art-workshop",
    title: "Art Workshop",
    titleAr: "ورشة الفنون",
    excerpt: "Creative arts sessions every Wednesday after school.",
    excerptAr: "جلسات فنية إبداعية كل يوم أربعاء بعد الدوام.",
    date: "2025-05-25",
  },
];

export const events = [
  {
    id: "1",
    title: "Graduation Ceremony",
    titleAr: "حفل التخرج",
    date: "2025-06-15",
    time: "10:00 AM",
    location: { en: "Main Auditorium", ar: "القاعة الرئيسية" },
  },
  {
    id: "2",
    title: "Science Exhibition",
    titleAr: "معرض العلوم",
    date: "2025-06-20",
    time: "9:00 AM",
    location: { en: "Science Building", ar: "مبنى العلوم" },
  },
];

export const teachers = [
  { id: "1", name: "Dr. Sarah Ahmed", nameAr: "د. سارة أحمد", subject: "Mathematics", subjectAr: "الرياضيات", department: "Science" },
  { id: "2", name: "Mr. Omar Hassan", nameAr: "أ. عمر حسن", subject: "Physics", subjectAr: "الفيزياء", department: "Science" },
  { id: "3", name: "Ms. Layla Faris", nameAr: "أ. ليلى فارس", subject: "English Literature", subjectAr: "الأدب الإنجليزي", department: "Languages" },
];

export const galleryAlbums = [
  { id: "1", slug: "graduation-2025", title: "Graduation 2025", titleAr: "تخرج 2025", count: 24 },
  { id: "2", slug: "sports-day-2025", title: "Sports Day 2025", titleAr: "اليوم الرياضي 2025", count: 18 },
  { id: "3", slug: "science-fair", title: "Science Fair", titleAr: "معرض العلوم", count: 32 },
];

export const downloads = [
  { id: "1", title: "School Calendar 2025-26", titleAr: "التقويم المدرسي 2025-26", type: "PDF", size: "2.4 MB" },
  { id: "2", title: "Uniform Guidelines", titleAr: "دليل الزي المدرسي", type: "PDF", size: "1.1 MB" },
  { id: "3", title: "Admission Form", titleAr: "نموذج القبول", type: "PDF", size: "890 KB" },
];

export const aboutContent = {
  mission: {
    en: "To provide a world-class education that nurtures academic excellence, moral integrity, and lifelong learning.",
    ar: "تقديم تعليم عالمي المستوى يعزز التميز الأكاديمي والنزاهة الأخلاقية والتعلم مدى الحياة.",
  },
  vision: {
    en: "To be a leading school that inspires students to become responsible global citizens and future leaders.",
    ar: "أن نكون مدرسة رائدة تلهم الطلاب ليصبحوا مواطنين عالميين مسؤولين وقادة المستقبل.",
  },
  history: {
    en: "Founded 56 years ago, Tariq Bin Ziyad Al-Maqatin School has grown into a vibrant community dedicated to excellence in education.",
    ar: "تأسس مجمع طارق بن زياد المقاطن منذ ٥٦ عاماً، ونما ليصبح مجتمعاً تعليمياً نابضاً بالحياة ملتزماً بالتميز.",
  },
};

export const principalMessage = {
  name: { en: "Dr. Khalid Al-Rashid", ar: "د. خالد الراشد" },
  title: { en: "School Principal", ar: "مدير المدرسة" },
  message: {
    en: "Welcome to Tariq Bin Ziyad Al-Maqatin School. For 56 years we have been committed to providing every student with the knowledge, values, and skills to succeed.",
    ar: "أهلاً بكم في مجمع طارق بن زياد المقاطن. منذ ٥٦ عاماً نلتزم بتزويد كل طالب بالمعرفة والقيم والمهارات اللازمة للنجاح.",
  },
};

export const achievementsPlaceholder = [
  { id: "1", title: "National Science Olympiad Winners", titleAr: "فائزون في الأولمبياد الوطني للعلوم", year: 2025, description: "Three students placed in the top 10 nationally.", descriptionAr: "حصل ثلاثة طلاب على مراكز ضمن العشرة الأوائل وطنياً." },
  { id: "2", title: "Accredited International Curriculum", titleAr: "منهج دولي معتمد", year: 2024, description: "Full accreditation from international education boards.", descriptionAr: "اعتماد كامل من مجالس التعليم الدولية." },
];

export const honorStudentsPlaceholder = [
  { id: "1", name: "Fatima Al-Mansour", nameAr: "فاطمة المنصور", grade: "Grade 12", gradeAr: "الصف الثاني عشر", achievement: "Valedictorian 2025", achievementAr: "الأولى على الدفعة 2025", academicYear: "2024-2025" },
  { id: "2", name: "Youssef Ibrahim", nameAr: "يوسف إبراهيم", grade: "Grade 11", gradeAr: "الصف الحادي عشر", achievement: "Academic Excellence Award", achievementAr: "جائزة التميز الأكاديمي", academicYear: "2024-2025" },
];

export const regulationsPlaceholder = [
  { id: "1", title: "Student Code of Conduct", titleAr: "قواعد سلوك الطلاب", content: "All students are expected to demonstrate respect, responsibility, and integrity in all school activities.", contentAr: "يُتوقع من جميع الطلاب إظهار الاحترام والمسؤولية والنزاهة في جميع الأنشطة المدرسية." },
  { id: "2", title: "Attendance Policy", titleAr: "سياسة الحضور", content: "Students must maintain a minimum attendance rate of 90% to be eligible for examinations.", contentAr: "يجب على الطلاب الحفاظ على نسبة حضور لا تقل عن 90% ليكونوا مؤهلين للامتحانات." },
];

export const clubsPlaceholder = [
  { id: "1", name: "Robotics Club", nameAr: "نادي الروبوتات", description: "Design and program robots for regional competitions.", descriptionAr: "تصميم وبرمجة الروبوتات للمسابقات الإقليمية.", supervisor: "Mr. Hassan Ali" },
  { id: "2", name: "Debate Society", nameAr: "نادي المناظرات", description: "Develop public speaking and critical thinking skills.", descriptionAr: "تطوير مهارات الإلقاء والتفكير النقدي.", supervisor: "Ms. Nora Salem" },
];

export const departmentsPlaceholder = [
  { id: "1", name: "Science Department", nameAr: "قسم العلوم", description: "Mathematics, Physics, Chemistry, and Biology.", descriptionAr: "الرياضيات والفيزياء والكيمياء والأحياء.", headName: "Dr. Sarah Ahmed", headNameAr: "د. سارة أحمد" },
  { id: "2", name: "Languages Department", nameAr: "قسم اللغات", description: "Arabic, English, and French language studies.", descriptionAr: "دراسات اللغة العربية والإنجليزية والفرنسية.", headName: "Ms. Layla Faris", headNameAr: "أ. ليلى فارس" },
];

export const parentResourcesPlaceholder = [
  { id: "1", title: "Parent Handbook", titleAr: "دليل أولياء الأمور", description: "Essential information for parents about school policies and procedures.", descriptionAr: "معلومات أساسية لأولياء الأمور حول سياسات وإجراءات المدرسة.", link: "#" },
  { id: "2", title: "Homework Support Guide", titleAr: "دليل دعم الواجبات", description: "Tips and resources to help your child with homework.", descriptionAr: "نصائح وموارد لمساعدة طفلك في الواجبات المنزلية.", link: "#" },
];

export const servicesPlaceholder = [
  { id: "1", name: "School Transportation", nameAr: "النقل المدرسي", description: "Safe and reliable bus service covering major areas.", descriptionAr: "خدمة حافلات آمنة وموثوقة تغطي المناطق الرئيسية.", icon: "🚌" },
  { id: "2", name: "Cafeteria", nameAr: "المقصف", description: "Healthy meals prepared daily by certified nutritionists.", descriptionAr: "وجبات صحية تُحضَّر يومياً من قبل أخصائيي تغذية معتمدين.", icon: "🍽️" },
  { id: "3", name: "Health Clinic", nameAr: "العيادة الصحية", description: "On-site nursing staff available during school hours.", descriptionAr: "طاقم تمريض في الموقع متاح خلال ساعات الدوام.", icon: "🏥" },
];

export const calendarEventsPlaceholder = [
  { id: "1", title: "First Day of School", titleAr: "أول يوم دراسي", startDate: "2025-09-01", type: "SEMESTER" },
  { id: "2", title: "Mid-Term Exams", titleAr: "امتحانات منتصف الفصل", startDate: "2025-11-10", type: "EXAM" },
  { id: "3", title: "Winter Break", titleAr: "إجازة الشتاء", startDate: "2025-12-20", type: "HOLIDAY" },
];

export const faqItems = [
  {
    q: "What are the school hours?",
    qAr: "ما هي أوقات الدوام المدرسي؟",
    a: "School hours are 7:30 AM to 2:30 PM, Sunday through Thursday.",
    aAr: "أوقات الدوام من 7:30 صباحاً إلى 2:30 مساءً، من الأحد إلى الخميس.",
  },
  {
    q: "How do I apply for admission?",
    qAr: "كيف أتقدم للقبول؟",
    a: "Download the admission form from our Downloads page or visit the admissions office.",
    aAr: "حمّل نموذج القبول من صفحة التحميلات أو قم بزيارة مكتب القبول.",
  },
];

export const translations = {
  en: {
    home: "Home",
    about: "About",
    announcements: "Announcements",
    blog: "Blog",
    activities: "Activities",
    teachers: "Teachers",
    gallery: "Gallery",
    results: "Results",
    downloads: "Downloads",
    calendar: "Calendar",
    contact: "Contact",
    principal: "Principal's Message",
    achievements: "Achievements",
    honorBoard: "Honor Board",
    graduates: "Graduates",
    regulations: "Regulations",
    faq: "FAQ",
    clubs: "Clubs",
    departments: "Departments",
    parentResources: "Parent Resources",
    services: "Services",
    search: "Search",
    readMore: "Read More",
    viewAll: "View All",
    latestAnnouncements: "Latest Announcements",
    upcomingEvents: "Upcoming Events",
    quickLinks: "Quick Links",
    searchPlaceholder: "Search the website...",
    contactUs: "Contact Us",
    sendMessage: "Send Message",
    name: "Name",
    email: "Email",
    message: "Message",
    studentId: "Student ID",
    academicYear: "Academic Year",
    searchResults: "Search Results",
    noResults: "No results found.",
    backTo: "Back to",
  },
  ar: {
    home: "الرئيسية",
    about: "عن المدرسة",
    announcements: "الإعلانات",
    blog: "المدونة",
    activities: "الأنشطة",
    teachers: "المعلمون",
    gallery: "المعرض",
    results: "النتائج",
    downloads: "التحميلات",
    calendar: "التقويم",
    contact: "اتصل بنا",
    principal: "كلمة المدير",
    achievements: "الإنجازات",
    honorBoard: "لوحة الشرف",
    graduates: "الخريجون",
    regulations: "اللوائح",
    faq: "الأسئلة الشائعة",
    clubs: "الأندية",
    departments: "الأقسام",
    parentResources: "موارد أولياء الأمور",
    services: "الخدمات",
    search: "بحث",
    readMore: "اقرأ المزيد",
    viewAll: "عرض الكل",
    latestAnnouncements: "أحدث الإعلانات",
    upcomingEvents: "الفعاليات القادمة",
    quickLinks: "روابط سريعة",
    searchPlaceholder: "ابحث في الموقع...",
    contactUs: "تواصل معنا",
    sendMessage: "إرسال الرسالة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    studentId: "رقم الطالب",
    academicYear: "العام الدراسي",
    searchResults: "نتائج البحث",
    noResults: "لم يتم العثور على نتائج.",
    backTo: "العودة إلى",
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function localePath(locale: Locale, path = "") {
  const base = `/${locale}`;
  return path ? `${base}/${path}` : base;
}
