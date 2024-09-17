// useSyncLocalStorage.js
import axios from 'axios';
import { useEffect } from 'react';

const useSyncLocalStorage = () => {
    const syncLocalStorageWithDatabase = async () => {
        const savedBoxes = JSON.parse(localStorage.getItem('taskBoxes')) || [];
        const token = localStorage.getItem('token');

        try {
            for (const box of savedBoxes) {
                await axios.put(`/api/task-boxes/${box._id}`, box, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            console.log('Successfully synced with the database.');
        } catch (error) {
            console.error('Error syncing with the database:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            syncLocalStorageWithDatabase();
        }, 60000); // Sync every 60 seconds or adjust as needed

        return () => clearInterval(interval);
    }, []);
};

export default useSyncLocalStorage;
