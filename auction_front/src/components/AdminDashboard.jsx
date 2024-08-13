import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Center, 
    InputGroup, 
    useToast, 
    Input, 
    Box, 
    Grid, 
    Select, 
    useDisclosure, 
    Button, 
    Stack, 
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    InputLeftElement } from '@chakra-ui/react';
import LatteCard from './LatteCard';
import { SettingsIcon } from '@chakra-ui/icons';
import config from '../Config';
import NotificationChecker from './NotificationChecker';

const PAGE_SIZE = 10;

function AdminDashboard({ showEditDelete = true, isUserDashboard = false }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', starting_price: '', auction_end_time: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [picture, setPicture] = useState(null);
  const toast = useToast();
  // Calculate the total number of pages
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Auto-bidding Config State
  const [autoBidConfig, setAutoBidConfig] = useState({ max_bid_amount: '', alert_percentage: '' });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  if (isUserDashboard == true){
    var user_access = 'user'
  } else {
    var user_access = 'admin'
  }


  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items
    .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.current_price - b.current_price;
        }
        return b.current_price - a.current_price;
      });

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setFilteredItems(filtered.slice(startIndex, endIndex));
  }, [items, searchTerm, sortOrder, currentPage]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/items/`);
      setItems(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: "Couldn't fetch items",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const validateForm = () => {
    if (!newItem.name || !newItem.description || !newItem.starting_price || !newItem.auction_end_time) {
      toast({
        title: 'Error',
        description: "All fields are required",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (isNaN(parseFloat(newItem.starting_price)) || parseFloat(newItem.starting_price) <= 0) {
      toast({
        title: 'Error',
        description: "Starting price must be a positive number",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (new Date(newItem.auction_end_time) <= new Date()) {
      toast({
        title: 'Error',
        description: "Auction end time must be in the future",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('starting_price', newItem.starting_price);
    formData.append('auction_end_time', newItem.auction_end_time);
    if (picture) {
      formData.append('picture', picture);
    }
    try {
      await axios.post(
        `${config.backendUrl}/items/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'user-access': 'admin'
          }
        }
      );
      fetchItems();
      setNewItem({ name: '', description: '', starting_price: '', auction_end_time: '', picture: '' });
      toast({
        title: 'Success',
        description: "Item added successfully",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: "Error adding item",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  

    // Function to open the modal and set the selected item
    const openBidModal = (item) => {
        setSelectedItem(item);
        onOpen();
      };
    
      const handleBidAmountChange = (e) => {
        setBidAmount(e.target.value);
      };
    
      const submitBid = async () => {
        const now = new Date();
        const auctionEndTime = new Date(selectedItem.auction_end_time);

        if (auctionEndTime <= now) {
            toast({
                title: "Auction Ended",
                description: "Can't bid on this item anymore",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        if (!bidAmount || isNaN(parseFloat(bidAmount)) || parseFloat(bidAmount) <= 0 || parseFloat(bidAmount) <= selectedItem.current_price) {
          toast({
            title: 'Error',
            description: "Please enter a valid bid amount that's more than the current price",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
    
        try {
          
          await axios.post(
            `${config.backendUrl}/items/${selectedItem.id}/bid/`,
            { user: user_access, amount: bidAmount }, 
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          fetchItems();
          toast({
            title: 'Success',
            description: "Bid placed successfully",
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          onClose();
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Error placing bid";
          toast({
            title: 'Error',
            description: errorMessage,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

        // Open Config Modal
  const openConfigModal = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/auto-bidding-config/${user_access}`);
      setAutoBidConfig(response.data); 
    } catch (error) {
    }
    setIsConfigOpen(true);
  };

  // Handle Config Input Changes
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
  
    // Validate the input value
    if (name === "alert_percentage") {
      const numberValue = parseFloat(value);
  
      if (numberValue < 0 || numberValue > 100) {
        toast({
          title: "Invalid Percentage",
          description: "Percentage must be between 0 and 100.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return; // Prevent updating the state if the value is invalid
      }
    }
  
    // Update the state if the value is valid
    setAutoBidConfig({ ...autoBidConfig, [name]: value });
  };
  const handleconfigInputChange = (e) => {
    const { name, value } = e.target;

    // Validate the input value
    if (value < 0 || value > 100) {
      setError("Percentage must be between 0 and 100.");
    } else {
      setError("");
    }

    handleConfigChange(e); // Call the passed in handler
  };

  // Save Config
  const saveConfig = async () => {
    try {
      const configWithUser = { ...autoBidConfig, user: user_access };
      console.log(configWithUser)
      await axios.post(`${config.backendUrl}/auto-bidding-config/`, configWithUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast({
        title: 'Config Saved',
        description: 'Auto-bidding configuration saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsConfigOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error saving configuration',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  
 

  return (
    <Box p={5} bg="gray.200">
      <NotificationChecker user_access={user_access} />
      {!isUserDashboard ? (
        <>
          <Stack spacing={6}  padding={"15px"}>
            <Box w="100%" p={4} bg="teal.500" color="white" textAlign="center" boxShadow="md">
              <Heading as="h2" size="lg">Admin Dashboard</Heading>
            </Box>
          </Stack>
          <Box justifyContent="center" alignItems="center">
            <Grid templateColumns={{ base: "2fr", md: "repeat(auto-fit, minmax(70%, fr))" }}>
              <Box borderWidth='1px' borderRadius='lg' overflow='hidden' padding={'1%'}>
                <Heading as='h3' size='1xl' noOfLines={1}>
                  Add New Item
                </Heading>
                <form onSubmit={addItem}>
                  <Stack spacing={2}>
                    <Input bg="white" borderColor="grey" focusBorderColor='teal.400' name="name" value={newItem.name} onChange={handleInputChange} placeholder="Name" required />
                    <Input bg="white" borderColor="grey" focusBorderColor='teal.400' name="description" value={newItem.description} onChange={handleInputChange} placeholder="Description" required />
                    <InputGroup>
                      <InputLeftElement pointerEvents='none' color='teal.400' fontSize='1.2em'>
                        $
                      </InputLeftElement>
                      <Input bg="white" borderColor="grey" focusBorderColor='teal.400' name="starting_price" type="number" value={newItem.starting_price} onChange={handleInputChange} placeholder="Starting Price" required min="0.01" step="0.01" />
                    </InputGroup>
                    <Input bg="white" borderColor="grey" focusBorderColor='teal.400' name="auction_end_time" type="datetime-local" value={newItem.auction_end_time} onChange={handleInputChange} required />
                    <Input bg="white" borderColor="grey" focusBorderColor='teal.400' name="picture" type="file" onChange={handleFileChange} placeholder="Item Image" />
                    <Button colorScheme='teal' size='md' type="submit">Add Item</Button>
                  </Stack>
                </form>
              </Box>
            </Grid>
          </Box>
        </>
      ) : (
        <Stack spacing={6} padding={"15px"} >
          <Box  w="100%" p={4} bg="teal.500" color="white" textAlign="center" boxShadow="md">
            <Heading as="h2" size="lg">User Dashboard</Heading>
          </Box>
        </Stack>
      )}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 0.45fr' }} gap={4} mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents='none' color='teal.400' fontSize='1.2em'>
            🔍
          </InputLeftElement>
          <Input
            placeholder='Search items...'
            value={searchTerm}
            onChange={handleSearchChange}
            bg="white"
            borderColor="grey"
            focusBorderColor='teal.400'
          />
        </InputGroup>
        <Select
          placeholder='Sort by price'
          value={sortOrder}
          onChange={handleSortChange}
          bg="white"
          borderColor="grey"
          focusBorderColor='teal.400'
        >
          <option value='asc'>Price: Low to High</option>
          <option value='desc'>Price: High to Low</option>
        </Select>
        <Button colorScheme='teal' size='md' onClick={openConfigModal} leftIcon={<SettingsIcon />}  >Auto-Bidding</Button>
      </Grid>
      <Heading as='h3' size='1xl' noOfLines={1}>
        Item List
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)",  }} gap={6}>
        {filteredItems.map(item => (
          <LatteCard key={item.id} item={item} fetchItems={fetchItems} showEditDelete={showEditDelete} 
          onBidClick={() => openBidModal(item)} />
        ))}
      </Grid>

        

      <Center mt={6}>
        <Stack spacing={4} direction="row">
          {currentPage > 1 && (
            <Button onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </Button>
          )}
          {currentPage < totalPages && (
            <Button onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          )}
        </Stack>
      </Center>

    
      {/* Bid Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Place a Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter your bid amount"
              value={bidAmount}
              onChange={handleBidAmountChange}
              type="number"
              min="0.01"
              step="0.01"
              focusBorderColor='teal.400'
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={submitBid}>
              Submit Bid
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Config Modal */}
        <Modal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configure Auto-Bidding</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Input required bg="white" borderColor="gray.300" focusBorderColor="teal.400" placeholder="Max Bid Amount" name="max_bid_amount" value={autoBidConfig.max_bid_amount} onChange={handleConfigChange} type="number"  />
              <Input
                    required
                    bg="white"
                    borderColor="gray.300"
                    focusBorderColor="teal.400"
                    placeholder="Alert Percentage"
                    name="alert_percentage"
                    value={autoBidConfig.alert_percentage}
                    onChange={handleConfigChange}
                    type="number"
                    min="0"
                    max="100"
                    step="1" 
                    />            
                    </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={saveConfig}
            isDisabled={!autoBidConfig.max_bid_amount || !autoBidConfig.alert_percentage} >Save</Button>
            <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

export default AdminDashboard;
