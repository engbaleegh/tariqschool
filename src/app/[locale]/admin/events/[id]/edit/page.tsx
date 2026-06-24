import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/EventForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

function parseImages(images: unknown): string[] {
  if (!images || !Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string");
}

export default async function EditEventPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const event = await db.event.findUnique({ where: { id } }).catch(() => null);
  if (!event) notFound();

  return (
    <div>
      <PageHeader title={isAr ? "تعديل فعالية" : "Edit event"} description={event.titleAr ?? event.title} />
      <EventForm
        locale={locale}
        mode="edit"
        eventId={id}
        defaultValues={{
          title: event.title,
          titleAr: event.titleAr ?? undefined,
          description: event.description,
          descriptionAr: event.descriptionAr ?? undefined,
          eventDate: event.eventDate.toISOString().split("T")[0],
          isPublished: event.isPublished,
          images: parseImages(event.images),
        }}
      />
    </div>
  );
}
