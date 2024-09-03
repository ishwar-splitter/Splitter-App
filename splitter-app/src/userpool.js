import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_CLIENT_ID,
};

console.log('Client ID:', process.env.REACT_APP_CLIENT_ID);
console.log('User Pool ID:', process.env.REACT_APP_USER_POOL_ID);
const userpool = new CognitoUserPool(poolData);

export { userpool };