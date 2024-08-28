import React, { useState } from 'react';
import { getUserSession } from './userSession';
import './TransactionManager.css';

function TransactionForm({ onSubmit, currentUserId }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState('');
  const [type, setType] = useState('');

  const currentUser = getUserSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      description,
      amount: parseFloat(amount),
      date,
      paid_by: paidBy,
      participants,
      added_by: currentUser.id,
      type
    };
    onSubmit(newTransaction);
    setDescription('');
    setAmount('');
    setDate('');
    setPaidBy('');
    setParticipants('');
    setType('');
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
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="transaction-input"
        required
      >
        <option value="" disabled>Transaction type</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input
        type="text"
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        placeholder="Paid by"
        className="transaction-input"
        required
      />
      <input 
        type="tel"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
        placeholder="Number of Payers"
        className="transaction-input"
        min="1"
        required
      />
      <button type="submit" className="transaction-submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;