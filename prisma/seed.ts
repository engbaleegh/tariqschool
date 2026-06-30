import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient, UserRole, CategoryType, EventType, GalleryCategory } from "../src/generated/prisma";

const connectionString = process.env.POSTGRES_PRISMA_URL;
const pool = connectionString ? new Pool({ connectionString }) : undefined;
const db = pool
  ? new PrismaClient({ adapter: new PrismaPg(pool) })
  : new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("Admin@123", 12);

  await db.user.upsert({
    where: { email: "admin@tariq-school.com" },
    update: { password },
    create: {
      email: "admin@tariq-school.com",
      password,
      name: "مدير المدرسة",
      role: UserRole.SUPER_ADMIN,
    },
  });

  const settings = [
    { key: "school_name", value: "Tariq Bin Ziyad Al-Maqatin School", valueAr: "مجمع طارق بن زياد المقاطن", group: "general" },
    { key: "school_vision", value: "To provide excellence in education and nurture future leaders.", valueAr: "تقديم التميز في التعليم ورعاية قادة المستقبل.", group: "about" },
    { key: "school_mission", value: "Empowering students through innovative learning and character development.", valueAr: "تمكين الطلاب من خلال التعلم المبتكر وتنمية الشخصية.", group: "about" },
    { key: "principal_message", value: "Welcome to Tariq Bin Ziyad Al-Maqatin School. We are committed to academic excellence.", valueAr: "مرحباً بكم في مجمع طارق بن زياد المقاطن. نحن ملتزمون بالتميز الأكاديمي.", group: "about" },
    { key: "contact_email", value: "info@tariq-school.com", group: "contact" },
    { key: "contact_phone", value: "+967777818303", group: "contact" },
    { key: "contact_address", value: "Al-Maqatin, Ibb Governorate, Yemen", valueAr: "اليمن، محافظة إب، المقاطن", group: "contact" },
    { key: "whatsapp_number", value: "967777818303", group: "contact" },
    { key: "facebook_url", value: "https://facebook.com/tariqschool", group: "social" },
    { key: "twitter_url", value: "https://twitter.com/tariqschool", group: "social" },
    { key: "instagram_url", value: "https://instagram.com/tariqschool", group: "social" },
  ];

  for (const setting of settings) {
    await db.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  const announcementCat = await db.category.upsert({
    where: { slug: "general-announcements" },
    update: {},
    create: { name: "General", nameAr: "عام", slug: "general-announcements", type: CategoryType.ANNOUNCEMENT },
  });

  await db.announcement.upsert({
    where: { slug: "welcome-new-academic-year" },
    update: {},
    create: {
      title: "Welcome to the New Academic Year 2025-2026",
      titleAr: "مرحباً بالعام الدراسي الجديد 2025-2026",
      slug: "welcome-new-academic-year",
      content: "We warmly welcome all students and parents to the new academic year. Classes begin on September 1st.",
      contentAr: "نرحب بجميع الطلاب وأولياء الأمور في العام الدراسي الجديد. تبدأ الدروس في الأول من سبتمبر.",
      excerpt: "Classes begin September 1st",
      excerptAr: "تبدأ الدروس في الأول من سبتمبر",
      isPublished: true,
      publishedAt: new Date(),
      categoryId: announcementCat.id,
    },
  });

  const blogCat = await db.category.upsert({
    where: { slug: "school-news" },
    update: {},
    create: { name: "School News", nameAr: "أخبار المدرسة", slug: "school-news", type: CategoryType.BLOG },
  });

  await db.article.upsert({
    where: { slug: "science-fair-2025" },
    update: {},
    create: {
      title: "Annual Science Fair 2025",
      titleAr: "معرض العلوم السنوي 2025",
      slug: "science-fair-2025",
      content: "Our students showcased amazing projects at the annual science fair.",
      contentAr: "عرض طلابنا مشاريع مذهلة في معرض العلوم السنوي.",
      excerpt: "Students showcase innovative projects",
      excerptAr: "الطلاب يعرضون مشاريع مبتكرة",
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(),
      categoryId: blogCat.id,
    },
  });

  await db.teacher.createMany({
    skipDuplicates: true,
    data: [
      { fullName: "Dr. Ahmed Al-Rashid", fullNameAr: "د. أحمد الرashid", jobTitle: "Principal", jobTitleAr: "مدير المدرسة", department: "Administration", departmentAr: "الإدارة", email: "principal@tariq-school.com", isActive: true, order: 1 },
      { fullName: "Sarah Johnson", fullNameAr: "سارة جونson", jobTitle: "Mathematics Teacher", jobTitleAr: "معلمة رياضيات", department: "Mathematics", departmentAr: "الرياضيات", email: "sarah@tariq-school.com", isActive: true, order: 2 },
      { fullName: "Mohammed Hassan", fullNameAr: "محمد حسan", jobTitle: "Science Teacher", jobTitleAr: "معلم علوم", department: "Science", departmentAr: "العلوم", email: "mohammed@tariq-school.com", isActive: true, order: 3 },
    ],
  });

  await db.event.create({
    data: {
      title: "Sports Day 2025",
      titleAr: "يوم الرياضة 2025",
      slug: "sports-day-2025",
      description: "Annual sports day with various competitions and activities for all grade levels.",
      descriptionAr: "يوم رياضي سنوي مع مسابقات وأنشطة متنوعة لجميع المراحل الدراسية.",
      eventDate: new Date("2025-11-15"),
      type: EventType.ACTIVITY,
      isPublished: true,
    },
  });

  const album = await db.galleryAlbum.create({
    data: {
      title: "School Activities",
      titleAr: "أنشطة المدرسة",
      slug: "school-activities",
      category: GalleryCategory.ACTIVITIES,
      isPublished: true,
    },
  });

  await db.galleryImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", alt: "Students in classroom", albumId: album.id, order: 1 },
      { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800", alt: "School library", albumId: album.id, order: 2 },
    ],
  });

  await db.fAQ.createMany({
    data: [
      { question: "What are the school hours?", questionAr: "ما هي ساعات الدوام المدرسي؟", answer: "School hours are from 7:30 AM to 2:30 PM, Sunday through Thursday.", answerAr: "ساعات الدوام من 7:30 صباحاً إلى 2:30 مساءً، من الأحد إلى الخميس.", order: 1 },
      { question: "How do I register my child?", questionAr: "كيف أسجل ابني/ابنتي؟", answer: "Registration forms are available in the Downloads section or at the school office.", answerAr: "نماذج التسجيل متوفرة في قسم التحميلات أو في مكتب المدرسة.", order: 2 },
    ],
  });

  await db.department.createMany({
    data: [
      { name: "Mathematics", nameAr: "الرياضيات", description: "Building strong mathematical foundations.", descriptionAr: "بناء أساسات رياضية قوية.", order: 1 },
      { name: "Science", nameAr: "العلوم", description: "Exploring the wonders of science.", descriptionAr: "استكشاف عجائب العلوم.", order: 2 },
      { name: "Languages", nameAr: "اللغات", description: "Arabic and English language excellence.", descriptionAr: "التميز في اللغة العربية والإنجليزية.", order: 3 },
    ],
  });

  await db.club.createMany({
    data: [
      { name: "Robotics Club", nameAr: "نادي الروبوتics", description: "Building and programming robots.", descriptionAr: "بناء وبرمجة الروبوتات.", order: 1 },
      { name: "Art Club", nameAr: "النادي الفني", description: "Creative arts and crafts.", descriptionAr: "الفنون الإبداعية والحرف.", order: 2 },
    ],
  });

  await db.homepageBanner.create({
    data: {
      title: "Welcome to Aldar School",
      titleAr: "مرحباً بكم في مدرسة الدار",
      subtitle: "Excellence in Education Since 1990",
      subtitleAr: "التميز في التعليم منذ 1990",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920",
      order: 1,
      isActive: true,
    },
  });

  console.log("Seed completed!");
  console.log("Admin login: admin@tariq-school.com / Admin@123");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
