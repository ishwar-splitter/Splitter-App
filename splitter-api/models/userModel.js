const { pool } = require('../config/db');

const createUser = async (userData) => {
  const { cognitoId, email, name } = userData;
  const query = 'INSERT INTO users (id, email, name) VALUES (?, ?, ?)';
  
  try {
    const [result] = await pool.execute(query, [cognitoId, email, name]);
    return result.insertId;
  } catch (error) {
    console.error('Error creating user in database:', error);
    throw error;
  }
};

const getCurrentUser = async (cognitoId) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  try {
    const [rows] = await pool.execute(query, [cognitoId]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

const getUsers = async () => {
  const query = 'SELECT * FROM users';
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUserTransactions = async (userId) => {
  const query = `
    SELECT t.id, t.description, t.amount, t.date, t.type, t.paid_by, t.participants,
           u.name as paid_by_name, t.added_by
    FROM transactions t
    LEFT JOIN users u ON t.paid_by = u.id
    WHERE t.added_by = ?
    ORDER BY t.date DESC
  `;

  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

const addTransaction = async (transaction) => {
  const { description, amount, date, type, participants, paid_by, added_by } = transaction;
  const query = 'INSERT INTO transactions (description, amount, date, type, paid_by, participants, added_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await pool.execute(query, [description, amount, date, type, paid_by, participants, added_by]);
    return result.insertId;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}; 

module.exports = {
  createUser,
  getCurrentUser,
  getUserTransactions,
  getUsers,
  addTransaction,
  
};