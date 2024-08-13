import React, { useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import config from '../Config';

const NotificationChecker = ({ user_access }) => {
    const toast = useToast();

    useEffect(() => {
        const checkForNotifications = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/notifications/${user_access}/`);
                if (response.status === 200) {
                    const { message } = response.data;
                    toast({
                        title: 'New Notification',
                        description: message,
                        status: 'info',
                        duration: null, 
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Polling every 1 second
        const intervalId = setInterval(checkForNotifications, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [user_access, toast]);

    return null; // This component doesn't render anything
};

export default NotificationChecker;
