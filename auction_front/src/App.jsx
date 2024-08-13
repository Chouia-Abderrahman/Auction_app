import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import LatteCard from './components/LatteCard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './components/Authentification';


function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/item/:id" element={<LatteCard />} />
            {/* <Route path="/auto-bidding" element={<PrivateRoute><AutoBiddingConfig /></PrivateRoute>} /> */}
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
