import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ItemCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
`;

function Home() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const socket = useWebSocket();

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`/api/items?page=${currentPage}&search=${searchTerm}`);
      setItems(response.data);
    } catch (error) {
      toast.error('Error fetching items');
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (socket) {
      socket.on('item_updated', (updatedItem) => {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      });
    }
  }, [socket]);

  return (
    <HomeContainer>
      <h1>Auction Items</h1>
      <SearchInput
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ItemGrid>
        {items.map(item => (
          <ItemCard key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>Current Price: ${item.current_price}</p>
            <Link to={`/item/${item.id}`}>
              <button>Bid Now</button>
            </Link>
          </ItemCard>
        ))}
      </ItemGrid>
      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
    </HomeContainer>
  );
}

export default Home;