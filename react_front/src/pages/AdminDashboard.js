import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ItemCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', starting_price: '', auction_end_time: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items/');
      setItems(response.data);
    } catch (error) {
      toast.error('Error fetching items');
    }
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!newItem.name || !newItem.description || !newItem.starting_price || !newItem.auction_end_time) {
      toast.error('All fields are required');
      return false;
    }
    if (isNaN(parseFloat(newItem.starting_price)) || parseFloat(newItem.starting_price) <= 0) {
      toast.error('Starting price must be a positive number');
      return false;
    }
    if (new Date(newItem.auction_end_time) <= new Date()) {
      toast.error('Auction end time must be in the future');
      return false;
    }
    return true;
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post('/api/items/', newItem);
      fetchItems();
      setNewItem({ name: '', description: '', starting_price: '', auction_end_time: '' });
      toast.success('Item added successfully');
    } catch (error) {
      toast.error('Error adding item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      fetchItems();
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Error deleting item');
    }
  };

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      <h2>Add New Item</h2>
      <Form onSubmit={addItem}>
        <input name="name" value={newItem.name} onChange={handleInputChange} placeholder="Name" required />
        <input name="description" value={newItem.description} onChange={handleInputChange} placeholder="Description" required />
        <input name="starting_price" type="number" value={newItem.starting_price} onChange={handleInputChange} placeholder="Starting Price" required min="0.01" step="0.01" />
        <input name="auction_end_time" type="datetime-local" value={newItem.auction_end_time} onChange={handleInputChange} required />
        <button type="submit">Add Item</button>
      </Form>
      <h2>Item List</h2>
      <ItemList>
        {items.map(item => (
          <ItemCard key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Starting Price: ${item.starting_price}</p>
            <p>Auction Ends: {new Date(item.auction_end_time).toLocaleString()}</p>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </ItemCard>
        ))}
      </ItemList>
    </DashboardContainer>
  );
}

export default AdminDashboard;