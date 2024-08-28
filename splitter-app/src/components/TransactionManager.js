import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import NotificationModal from './NotificationModal';
import { userpool } from '../userpool';
import { setUserSession, getUserSession, clearUserSession } from './userSession';
import './TransactionManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(getUserSession());
  const navigate = useNavigate();

  useEffect(() => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          navigate('/');
        } else {
          const token = session.getIdToken().getJwtToken();
          fetchUserInfo(token);
          fetchTransactions(token);
        }
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      const user = {id: data.id, name: data.name, email: data.email};
      setLoggedInUser(user);
      setUserSession(user);
    } catch (error) {
      showNotification('Error fetching user info', 'error');
    }
  };


  const fetchTransactions = async (token) => {
    try {
      const response = await fetch(`${API_URL}/transactions/usertransactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      showNotification('Error fetching transactions', 'error');
      setTransactions([]);
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          showNotification('Error adding transaction', 'error');
        } else {
          const token = session.getIdToken().getJwtToken();
          addTransaction(newTransaction, token);
        }
      });
    }
  };

  const addTransaction = async (newTransaction, token) => {
    try {
      const response = await fetch(`${API_URL}/transactions/addtransaction`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error('Failed to add transaction');
      showNotification('Transaction added successfully', 'success');
      fetchTransactions(token);
    } catch (error) {
      showNotification('Error adding transaction', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    clearUserSession();
    navigate('/');
  };

  return (
    <div className='transaction-manager-container'>
      <header className='transaction-manager-header'>
        <h1>Transaction Manager</h1>
        <div className='user-menu'>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            {loggedInUser.name || 'User'} ▼
          </button>
          {showDropdown && (
            <div className='dropdown-menu'>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className='transaction-manager-content'>
        <div className='transaction-manager-layout'>
          <div className='transaction-form-container'>
            <TransactionForm 
              onSubmit={handleAddTransaction}
            />
          </div>
          <div className='transaction-list-container'>
            <TransactionList transactions={transactions} 
            emptyMessage="No transactions added yet. Start by adding a new transaction!"
            />
          </div>
        </div>
      </main>
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default TransactionManager;