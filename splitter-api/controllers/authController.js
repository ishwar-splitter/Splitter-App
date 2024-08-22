const cognitoConfig = require('../config/cognitoConfig');

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
    ],
  };

  try {
    const data = await cognitoConfig.cognitoIdentityServiceProvider.signUp(params).promise();
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