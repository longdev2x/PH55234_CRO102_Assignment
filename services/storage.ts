import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    AVATAR: 'user_avatar_',
};

export const storage = {
    // Save avatar for a user
    async saveAvatar(userId: string, uri: string) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AVATAR + userId, uri);
        } catch (error) {
            console.error('Error saving avatar:', error);
        }
    },

    // Get avatar for a user
    async getAvatar(userId: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AVATAR + userId);
        } catch (error) {
            console.error('Error getting avatar:', error);
            return null;
        }
    },

    // Remove avatar for a user
    async removeAvatar(userId: string) {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.AVATAR + userId);
        } catch (error) {
            console.error('Error removing avatar:', error);
        }
    }
};
