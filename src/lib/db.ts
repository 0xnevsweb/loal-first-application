import { User } from '@/types/user';
import Dexie from 'dexie';

class UserDatabase extends Dexie {
    users: Dexie.Table<User, string>;

    constructor() {
        super('UserDatabase');
        this.version(1).stores({
            users: 'id, uuid, email, isFavorite',
        });
        this.users = this.table('users');
    }
}

export const db = new UserDatabase();