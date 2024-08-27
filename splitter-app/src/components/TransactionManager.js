import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import NotificationModal from './NotificationModal';
import './TransactionManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // For demo purposes, we're hardcoding the user name
  // In a real app, you'd get this from your authentication state
  const userName = "John Doe";
  const userId = 4;

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      showNotification('Error fetching users', 'error');
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log('Fetching transactions...');
      const response = await fetch(`${API_URL}/transactions/usertransactions/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      console.log('Fetched transactions:', data);
      setTransactions(data.transactions);
      console.log('Transactions state after setting:', transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showNotification('Error fetching transactions', 'error');
    }
  };
  
  useEffect(() => {
    console.log('Current transactions state:', transactions);
  }, [transactions]);

  const handleAddTransaction = async (newTransaction) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error('Failed to add transaction');
      showNotification('transaction added successfully', 'success');
      fetchTransactions();
    } catch (error) {
      showNotification('Error adding transaction', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    // Implement logout logic here
    // For now, we'll just redirect to the login page
    navigate('/');
  };

  return (
    <div className='transaction-manager-container'>
      <header className='transaction-manager-header'>
        <h1>Transaction Manager</h1>
        <div className='user-menu'>
          <button onClick={() => setShowDropdown(!showDropdown)}>{userName} ▼</button>
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
            <TransactionForm onSubmit={handleAddTransaction}
            users={users.filter(user => user.id !== userId)} 
            currentUserId={userId} />
          </div>
          <div className='transaction-list-container'>
            <TransactionList transactions={transactions} />
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