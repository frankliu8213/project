import { RotateCcw } from 'lucide-react';

interface RestoreButtonProps {
  onRestore: () => void;
}

export function RestoreButton({ onRestore }: RestoreButtonProps) {
  return (
    <button
      onClick={onRestore}
      className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
    >
      <RotateCcw className="w-5 h-5" />
      <span>恢复普通账户</span>
    </button>
  );
}