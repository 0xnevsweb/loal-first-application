import { User } from '@/types/user';
import { useUserStore } from '../store/userStore';

export const UserCard = ({ user }: { user: User; }) => {
    const toggleFavorite = useUserStore((state) => state.toggleFavorite);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
            <div className="p-4">
                <div className="flex items-center space-x-4">
                    <img
                        src={user.picture.medium}
                        alt={`${user.name.first} ${user.name.last}`}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h3 className="text-lg font-semibold dark:text-white">
                            {user.name.first} {user.name.last}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.gender}
                    </span>
                    <button
                        onClick={() => toggleFavorite(user.id)}
                        className={`p-2 rounded-full ${user.isFavorite
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-gray-500'
                            }`}
                    >
                        {user.isFavorite ? '★' : '☆'}
                    </button>
                </div>
            </div>
        </div>
    );
};