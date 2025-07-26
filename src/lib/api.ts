export const fetchUsers = async (page: number = 1, size: number = 12) => {
    try {
        const response = await fetch(
            `https://randomuser.me/api/?page=${page}&results=${size}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.map((user: any) => ({
            id: user.login.uuid,
            uuid: user.login.uuid,
            gender: user.gender,
            name: user.name,
            email: user.email,
            picture: user.picture,
            isFavorite: false,
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};