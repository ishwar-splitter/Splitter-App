require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const AWS = require('aws-sdk');

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// Register route
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'name',
        Value: name,
      },
    ],
  };

  try {
    const data = await cognitoIdentityServiceProvider.signUp(params).promise();
    res.json({ message: 'User registered successfully', userSub: data.UserSub });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognitoIdentityServiceProvider.initiateAuth(params).promise();
    res.json({ message: 'Login successful', token: data.AuthenticationResult.AccessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));


