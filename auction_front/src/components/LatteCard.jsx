import React, { useState, useEffect } from 'react';
import { Card, 
    useToast, 
    CardBody, 
    CardFooter, 
    Flex, 
    Image, 
    Stack, 
    Heading, 
    Text, 
    IconButton, 
    Button, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    useDisclosure, 
    FormControl, 
    FormLabel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Checkbox,
    Box, 
    Input } from '@chakra-ui/react';
import defaultImage from '../images/item_placeholder.png';
import config from '../Config';
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const LatteCard = ({ item, fetchItems, showEditDelete, onBidClick }) => {
    const { picture, name, description, starting_price, current_price, auction_end_time, id, bids } = item;
    const imageUrl = picture ? `${config.backendUrl}${picture}` : defaultImage;
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
        name: name || '',
        description: description || '',
        starting_price: starting_price || '',
        picture: null,
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [autoBiddingActive, setAutoBiddingActive] = useState(false);
    if (showEditDelete == true){
        var user_access = 'admin'
    }else{
        var user_access = 'user'
    }

    useEffect(() => {
        // Function to calculate the remaining time
        const calculateTimeLeft = () => {
            const endTime = new Date(auction_end_time).getTime();
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                return 'Auction Ended';
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours}h ${minutes}m`;
        };

        // Update countdown every minute
        const interval = setInterval(() => {
            setCountdown(calculateTimeLeft());
        }, 60000);

        // Initial call
        setCountdown(calculateTimeLeft());

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [auction_end_time]);

    const handleEdit = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('starting_price', formData.starting_price);
            if (formData.picture) {
                data.append('picture', formData.picture);
            }
            await axios.put(`${config.backendUrl}/items/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'user-access': 'admin',
                },
            });
            setIsEditMode(false);
            fetchItems();
            toast({
                title: 'Success',
                description: "Item updated successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: "Error updating item",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const deleteItem = async () => {
        try {
            await axios.delete(`${config.backendUrl}/items/${id}`);
            fetchItems();
            toast({
                title: 'Success',
                description: "Item deleted successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: "Error deleting item",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };
    const handleAutoBiddingToggle = async (e) => {
        const isActive = e.target.checked;
        if (showEditDelete == true){
            var user_access = 'admin'
        }else{
            var user_access = 'user'
        }
        try {
            if (isActive) {
                // Activate auto-bidding: Add item to the auto-bidding config
                await axios.put(
                    `${config.backendUrl}/autobid-config/${user_access}/add-item/${item.id}/`,
                    null, // No need for request body in this case
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast({
                    title: 'Auto-bidding Activated',
                    description: 'Item added to auto-bidding list successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setAutoBiddingActive(true);
            } else {
                // Deactivate auto-bidding: Remove item from the auto-bidding config
                await axios.delete(
                    `${config.backendUrl}/autobid-config/${user_access}/add-item/${item.id}/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast({
                    title: 'Auto-bidding Deactivated',
                    description: 'Item removed from auto-bidding list successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setAutoBiddingActive(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Specific handling for 404 error
                toast({
                    title: 'Configuration Required',
                    description: 'You need to configure auto-bidding first.',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
            toast({
                title: 'Error',
                description: `Error ${isActive ? 'activating' : 'deactivating'} auto-bidding`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
            console.error('Error in auto-bidding toggle:', error);

        }
    };
    const handlePlaceBidOpen = async () => {
        try {
            // Perform the GET request when the modal opens
            const response = await axios.get(`${config.backendUrl}/autobid-config/${user_access}/add-item/${item.id}/`);
            const { autoBiddingActive } = response.data.item_exists; // Adjust based on the actual response structure
            console.log()
            // Set the checkbox state based on the response
            setAutoBiddingActive(response.data.item_exists);
    
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    
        // Open the modal
        onOpen();
    };

    

    return (
        <>
            <Card borderColor="grey" direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline' maxW={{ base: '100%', sm: '100%' }}>
                <Image objectFit='cover' maxW={{ base: '100%', sm: '200px' }} src={imageUrl || defaultImage} alt={name} />
                <Stack>
                    <CardBody>
                        <Heading size='md'>{name}</Heading>
                        <Text mt={2} fontWeight='bold'>
                            Current price: {current_price}
                        </Text>
                        <Text mt={2} fontWeight='bold'>
                            Number of Bids: {bids.length}
                        </Text>
                    </CardBody>
                    <CardFooter p={2}>
                        <Button variant='solid' colorScheme='teal' onClick={handlePlaceBidOpen}>
                            Place Bid
                        </Button>
                    </CardFooter>
                </Stack>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justify='center' mb={4}>
                            <Image src={imageUrl || defaultImage} alt={name} mb={4} />
                        </Flex>
                        {isEditMode ? (
                            <>
                                <FormControl id='name' mb={4}>
                                    <FormLabel>Name</FormLabel>
                                    <Input name='name' value={formData.name} onChange={handleChange} />
                                </FormControl>
                                <FormControl id='description' mb={4}>
                                    <FormLabel>Description</FormLabel>
                                    <Input name='description' value={formData.description} onChange={handleChange} />
                                </FormControl>
                                <FormControl id='starting_price' mb={4}>
                                    <FormLabel>Starting Price</FormLabel>
                                    <Input name='starting_price' type='number' value={formData.starting_price} onChange={handleChange} />
                                </FormControl>
                                <FormControl id='picture' mb={4}>
                                    <FormLabel>Picture</FormLabel>
                                    <Input name='picture' type='file' onChange={handleChange} />
                                </FormControl>
                                <Stack direction="row" spacing={4} width="100%" align="center" justify="center">
                                    <Button variant='solid' colorScheme='teal' onClick={handleEdit}>
                                        Save Changes
                                    </Button>
                                    <Button variant='outline' colorScheme='gray' onClick={() => setIsEditMode(false)}>
                                        Cancel
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Text fontWeight='bold'>Description:</Text>
                                <Text mb={4}>{description}</Text>
                                <Text fontWeight='bold'>Starting Price:</Text>
                                <Text mb={4}>${starting_price}</Text>
                                <Text fontWeight='bold'>Current Price:</Text>
                                <Text mb={4}>${current_price}</Text>
                                <Text fontWeight='bold'>Auction Remaining Time:</Text>
                                <Text paddingBottom={"10px"}>{countdown}</Text>
                {showEditDelete && (
                  <Accordion defaultIndex={[1]} allowMultiple padding={5} >
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as='span' flex='1' textAlign='center'>
                            Bids Details
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {bids.length > 0 ? (
                          bids.map((bid, index) => (
                            <Box key={index} mb={5}>
                              <Text><strong>Bidder:</strong> {bid.user}</Text>
                              <Text><strong>Amount:</strong> ${bid.amount}</Text>
                              <Text><strong>Date:</strong> {new Date(bid.time).toLocaleString()}</Text>
                            </Box>
                          ))
                        ) : (
                          <Text>No bids yet.</Text>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
                                <Stack direction="row" spacing={4} width="100%" align="center" justify="center" padding={1}>
                                <Checkbox size='md' colorScheme='teal' isChecked={autoBiddingActive} onChange={handleAutoBiddingToggle}>
                                            Enable Auto-Bidding
                                        </Checkbox>
                                    <Button variant='solid' colorScheme='teal'
                                    onClick={() => onBidClick(item)}>
                                        Bid

                                    </Button>
                                    {showEditDelete && (
                                        <>
                                            <Button variant='solid' colorScheme='teal' onClick={() => setIsEditMode(true)}>
                                                Edit
                                            </Button>
                                            <IconButton aria-label='Delete Item' icon={<DeleteIcon />} colorScheme='red' onClick={deleteItem} />
                                        </>
                                    )}
                                </Stack>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default LatteCard;
