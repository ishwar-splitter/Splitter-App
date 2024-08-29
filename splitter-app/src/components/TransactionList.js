import React, { useState } from 'react';
import './TransactionManager.css';

function TransactionList({ transactions }) {
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="transaction-list-header">
          <h2>Transaction List</h2>
        </div>
        <div className="empty-list-message">
          No transactions added yet. Start by adding a new transaction!
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h2>Transaction List</h2>
        <button onClick={toggleSortOrder} className="sort-button">
          Sort by Date ({sortOrder === 'desc' ? 'Newest First' : 'Oldest First'})
        </button>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Paid By</th>
            <th>Number of Payers</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className="transaction-item">
              <td>{transaction.description}</td>
              <td>Rs.{transaction.amount}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.type}</td>
              <td>{transaction.paid_by}</td>
              <td>{transaction.participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;