import { UserButton } from '@clerk/nextjs';
import { getCurrentUserFromDB } from '@/lib/action';

const Header = async () => {
    const user = await getCurrentUserFromDB();
    
    const displayName = user?.name || user?.businessName || 'Admin';

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="w-full px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Left Section - Logo and Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user?.businessName || 'Admin Dashboard'}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome back!
                            </p>
                        </div>
                    </div>

                    {/* Right Section - User Info and Actions */}
                    <div className="flex items-center gap-6">
                        {/* User Info */}
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-sm font-medium text-gray-800">
                                {displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.role || 'ADMIN'}
                            </p>
                        </div>

                        {/* User Button */}
                        <div className="flex items-center">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Business Info Bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase">Business Email:</span>
                        <span className="text-sm text-gray-800">{user?.businessEmail || 'Not set'}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
