'use client';

import { useState, useTransition } from 'react';
import { updateInquiryStatus } from '@/lib/action';

interface InquiryStatusSelectorProps {
  inquiryId: string;
  currentStatus: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';
}

const statusOptions: Array<{ value: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED'; label: string; color: string }> = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'CLOSED', label: 'Closed', color: 'bg-green-100 text-green-800' },
];

export default function InquiryStatusSelector({ inquiryId, currentStatus }: InquiryStatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (newStatus: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED') => {
    if (newStatus === status) return;

    setError(null);
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, newStatus);
      if (result.success) {
        setStatus(newStatus);
      } else {
        setError(result.error || 'Failed to update status');
        // Revert to previous status on error
        setStatus(status);
      }
    });
  };

  const currentStatusOption = statusOptions.find(opt => opt.value === status);

  return (
    <div className="flex flex-col gap-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as typeof status)}
        disabled={isPending}
        className={`px-3 py-1 rounded-full text-xs font-medium border-2 border-transparent hover:border-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer transition ${
          currentStatusOption?.color || 'bg-gray-100 text-gray-800'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
