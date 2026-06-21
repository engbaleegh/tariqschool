import PageHeader from "@/components/admin/PageHeader";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminSettingsPage({ params }: PageProps) {
  await params;

  let settings: { key: string; value: string; group: string }[] = [];
  try {
    settings = await db.setting.findMany({ orderBy: { group: "asc" } });
  } catch {
    settings = [];
  }

  return (
    <div>
      <PageHeader title="Settings" description="School-wide configuration values." />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Key</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Group</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settings.map((s) => (
              <tr key={s.key}>
                <td className="px-4 py-3 font-medium text-slate-900">{s.key}</td>
                <td className="px-4 py-3 text-slate-600">{s.group}</td>
                <td className="px-4 py-3 text-slate-600">{s.value.slice(0, 80)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
