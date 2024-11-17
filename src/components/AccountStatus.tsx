import { Crown } from 'lucide-react';

interface AccountStatusProps {
  isPremium: boolean;
}

export function AccountStatus({ isPremium }: AccountStatusProps) {
  return (
    <div className="text-center">
      {isPremium ? (
        <div className="flex items-center justify-center space-x-2">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-800">高级帐户</h1>
        </div>
      ) : (
        <h1 className="text-2xl font-bold text-gray-800">普通账户</h1>
      )}
    </div>
  );
}