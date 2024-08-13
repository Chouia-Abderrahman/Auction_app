import React from 'react';
import { Button, useToast } from '@chakra-ui/react';

const ToastComponent = ({ title, description, status, duration, isClosable, buttonText }) => {
  const toast = useToast();

  const showToast = () => {
    toast({
      title: title || 'Notification',
      description: description || 'This is a toast notification.',
      status: status || 'info',
      duration: duration || 5000,
      isClosable: isClosable !== undefined ? isClosable : true,
    });
  };

  return (
    <Button onClick={showToast}>
      {buttonText || 'Show Toast'}
    </Button>
  );
};

export default ToastComponent;
