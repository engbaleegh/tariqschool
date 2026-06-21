"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputTypes } from "@/constants/enums";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  locale?: string;
  searchPlaceholder?: string;
};

function cellText(row: Record<string, unknown>, key: string) {
  const value = row[key];
  if (value == null) return "";
  return String(value);
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No records found.",
  className,
  locale = "en",
  searchPlaceholder,
}: DataTableProps<T>) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const searchableKeys = useMemo(
    () => columns.filter((c) => c.searchable !== false).map((c) => c.key),
    [columns]
  );

  const filtered = useMemo(() => {
    let rows = [...data];
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((row) =>
        searchableKeys.some((key) => cellText(row, key).toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = cellText(a, sortKey).toLowerCase();
        const bv = cellText(b, sortKey).toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [data, query, searchableKeys, sortKey, sortDir]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type={InputTypes.SEARCH}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            searchPlaceholder ?? (isAr ? "بحث في الجدول..." : "Search table...")
          }
          className="w-full rounded-lg border border-slate-300 bg-white py-2 ps-9 pe-3 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          dir={isAr ? "rtl" : "ltr"}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} className={col.className} />
              ))}
            </colgroup>
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-500",
                      col.sortable !== false && "cursor-pointer select-none hover:text-slate-700",
                      col.className
                    )}
                    onClick={
                      col.sortable !== false ? () => toggleSort(col.key) : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortKey === col.key && (
                        <span aria-hidden>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    {isAr ? "لا توجد نتائج مطابقة" : "No matching records"}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-start text-sm text-slate-700 dark:text-slate-200",
                          col.key === "actions" ? "whitespace-nowrap" : "break-words",
                          col.className
                        )}
                      >
                        {col.render ? col.render(row) : cellText(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
