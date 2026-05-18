import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, X } from 'lucide-react';
import type { ChangeHistory } from '../../../types/profile.type';

const pageSize = 6;

type HistoryDrawerProps = {
  isOpen: boolean;
  isLoading: boolean;
  history: ChangeHistory[];
  onClose: () => void;
};

export function HistoryDrawer({ isOpen, isLoading, history, onClose }: HistoryDrawerProps) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(history.length / pageSize));

  const pageItems = useMemo(() => {
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * pageSize;
    return history.slice(start, start + pageSize);
  }, [history, page, pageCount]);

  if (!isOpen) {
    return null;
  }

  const currentPage = Math.min(page, pageCount);

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close change history"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl shadow-slate-950/30">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              <Clock3 size={16} />
              Change History
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Profile updates</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-100 p-5 text-sm text-slate-500">
              Loading change history...
            </div>
          ) : history.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Old Value</th>
                    <th className="px-4 py-3">New Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {formatField(item.field)}
                      </td>
                      <td className="max-w-[14rem] px-4 py-4 text-slate-500">
                        <HistoryValue value={item.old_value} />
                      </td>
                      <td className="max-w-[14rem] px-4 py-4 text-slate-800">
                        <HistoryValue value={item.new_value} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No change history yet.</p>
              <p className="mt-1 text-sm text-slate-400">
                Updates to contact, skills, and profile photo will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            {history.length ? `${history.length} records` : 'No records'}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading || !history.length}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="min-w-20 text-center text-sm font-semibold text-slate-500">
              {currentPage} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount || isLoading || !history.length}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function HistoryValue({ value }: { value: string }) {
  return (
    <span className="block whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-3 py-2">
      {value || '-'}
    </span>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatField(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
