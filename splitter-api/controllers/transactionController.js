const { getUserTransactions, getUsers } = require('../models/userModel');

exports.getUserTransactions = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const transactions = await getUserTransactions(userId);
      res.json({ transactions });
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
  };
  
  exports.getUsers = async (req, res) => {
    try {
      const users = await getUsers();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    }
  };

