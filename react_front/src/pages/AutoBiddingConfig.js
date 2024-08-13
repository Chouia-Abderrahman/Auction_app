import React, { useState } from 'react';
import axios from 'axios';

function AutoBiddingConfig() {
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [alertPercentage, setAlertPercentage] = useState('');

  const saveConfig = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auto-bidding-config', { max_bid_amount: maxBidAmount, alert_percentage: alertPercentage });
      alert('Auto-bidding configuration saved');
    } catch (error) {
      console.error('Error saving auto-bidding configuration:', error);
    }
  };

  return (
    <div>
      <h1>Auto-Bidding Configuration</h1>
      <form onSubmit={saveConfig}>
        <input
          type="number"
          value={maxBidAmount}
          onChange={(e) => setMaxBidAmount(e.target.value)}
          placeholder="Maximum Bid Amount"
          required
        />
        <input
          type="number"
          value={alertPercentage}
          onChange={(e) => setAlertPercentage(e.target.value)}
          placeholder="Alert Percentage"
          required
        />
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
}

export default AutoBiddingConfig;