const cognitoConfig = require('../config/cognitoConfig');
const { createUser } = require('../models/userModel');

exports.signup = async (req, res) => {
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
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    const data = await cognitoConfig.cognitoIdentityServiceProvider.signUp(params).promise();

    // Create user in database
    await createUser({ email, name, cognitoId: data.UserSub });

    res.json({ message: 'User registered successfully', userSub: data.UserSub });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
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
    const data = await cognitoConfig.cognitoIdentityServiceProvider.initiateAuth(params).promise();
    
    res.json({ message: 'Login successful', token: data.AuthenticationResult.AccessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email
  };

  try {
    await cognitoConfig.cognitoIdentityServiceProvider.forgotPassword(params).promise();
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.verifyPin = async (req, res) => {
  const { email, pin } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    ConfirmationCode: pin,
    Username: email,
    Password: "TemporaryP@ssword123",
  };

  try {
    await cognitoConfig.cognitoIdentityServiceProvider.confirmForgotPassword(params).promise();
    res.json({ message: 'PIN verified successfully' });
  } catch (error) {
    console.error("PIN verification error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, pin } = req.body;

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: newPassword,
    ConfirmationCode: pin,
  };

  try {
    await cognitoConfig.cognitoIdentityServiceProvider.confirmForgotPassword(params).promise();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).json({ error: error.message });
  }
};