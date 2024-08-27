import React, { useState } from 'react';
import './TransactionManager';

function TransactionForm({ onSubmit, users, currentUserId }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      description,
      amount: parseFloat(amount),
      date,
      paid_by: paidBy,
    };
    onSubmit(newTransaction);
    setDescription('');
    setAmount('');
    setDate('');
    setPaidBy(currentUserId);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Transaction description"
        className="transaction-input"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="transaction-input"
        step="0.01"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="transaction-input"
        required
      />
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        className="transaction-input"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button type="submit" className="transaction-submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;