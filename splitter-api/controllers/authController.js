const { createUser } = require('../models/userModel');


exports.signup = async (req, res) => {
  const { email, name, cognitoId } = req.body;

  try {
    
    // Create user in database
    await createUser({ email, name, cognitoId });

    res.json({ message: 'User registered successfully', cognitoId});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
