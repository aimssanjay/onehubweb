import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: string; bgColor: string; textColor: string }> = {
  Active: { color: 'border-green-200', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  Pending: { color: 'border-yellow-200', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  Completed: { color: 'border-blue-200', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  'In Progress': { color: 'border-indigo-200', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
  'Awaiting Content': { color: 'border-orange-200', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  'Under Review': { color: 'border-purple-200', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  Rejected: { color: 'border-red-200', bgColor: 'bg-red-50', textColor: 'text-red-700' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'border-gray-200', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };

  return (
    <Badge 
      variant="outline" 
      className={`${config.bgColor} ${config.color} ${config.textColor} px-3 py-1`}
    >
      {status}
    </Badge>
  );
}
