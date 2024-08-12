import { cognitoUserPool } from "amazon-cognito-identity-js"

const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_USER_CLIENT_ID,
}


export default new cognitoUserPool(poolData);