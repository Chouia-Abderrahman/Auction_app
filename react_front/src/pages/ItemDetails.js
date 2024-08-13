import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { toast } from 'react-toastify';

const ItemContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BidForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const BidHistory = styled.div`
  margin-top: 20px;
`;

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [autoBidding, setAutoBidding] = useState(false);
  const { currentUser } = useAuth();
  const socket = useWebSocket();

  const fetchItem = useCallback(async () => {
    try {
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      toast.error('Error fetching item details');
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  useEffect(() => {
    if (socket) {
      socket.on('bid_placed', (updatedItem) => {
        if (updatedItem.id === parseInt(id)) {
          setItem(updatedItem);
          if (autoBidding && updatedItem.current_price >= parseFloat(bidAmount)) {
            placeBid(parseFloat(bidAmount) + 1);
          }
        }
      });
    }
  }, [socket, id, autoBidding, bidAmount]);

  const placeBid = async (amount) => {
    try {
      await axios.post(`/api/items/${id}/place_bid`, { amount });
      fetchItem();
      setBidAmount('');
      toast.success('Bid placed successfully');
    } catch (error) {
      toast.error('Error placing bid');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeBid(parseFloat(bidAmount));
  };

  const toggleAutoBidding = () => {
    setAutoBidding(!autoBidding);
  };

  if (!item) return <div>Loading...</div>;

  return (
    <ItemContainer>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Current Price: ${item.current_price}</p>
      <p>Auction Ends: {new Date(item.auction_end_time).toLocaleString()}</p>
      <BidForm onSubmit={handleSubmit}>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount"
          min={item.current_price + 1}
          step="0.01"
          required
        />
        <button type="submit">Place Bid</button>
      </BidForm>
      <label>
        <input
          type="checkbox"
          checked={autoBidding}
          onChange={toggleAutoBidding}
        />
        Enable Auto-Bidding
      </label>
      <BidHistory>
        <h2>Bid History</h2>
        {item.bids.map(bid => (
          <div key={bid.id}>
            <p>{bid.user} bid ${bid.amount} at {new Date(bid.time).toLocaleString()}</p>
          </div>
        ))}
      </BidHistory>
    </ItemContainer>
  );
}

export default ItemDetails;