const { getCurrentUser } = require('../models/userModel');

exports.getCurrentUser = async (req, res) => {
  const userId = req.user.sub;
    try {
      const user = await getCurrentUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
  };
  