import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AutoBiddingConfig from './pages/AutoBiddingConfig';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { GlobalStyle } from './styles/GlobalStyle';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          {/* <GlobalStyle /> */}
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/item/:id" element={<PrivateRoute><ItemDetails /></PrivateRoute>} />
            <Route path="/auto-bidding" element={<PrivateRoute><AutoBiddingConfig /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
