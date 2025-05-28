'use client';

import { useRouter } from 'next/navigation';

export default function LogOut() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the auth_token cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    router.refresh();
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Logout
    </button>
  );
}
