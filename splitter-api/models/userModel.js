const { pool } = require('../config/db');

const createUser = async (userData) => {
  const { email, name, cognitoId } = userData;
  const query = 'INSERT INTO users (email, name, cognito_id) VALUES (?, ?, ?)';
  
  try {
    const [result] = await pool.execute(query, [email, name, cognitoId]);
    return result.insertId;
  } catch (error) {
    console.error('Error creating user in database:', error);
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
    JOIN users u ON t.paid_by = u.id
    WHERE t.added_by = ?
    ORDER BY t.date DESC
  `;

  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows.map(row => ({
      ...row,
      isPersonal: row.paid_by === userId,
      amountOwed: row.type === 'expense' && row.paid_by !== userId 
        ? (row.amount / row.participants).toFixed(2) 
        : '0.00'
    }));
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserTransactions,
  getUsers,
  
};