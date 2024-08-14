import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_imAqH02VL",
    ClientId: "iluo8b9bk24ca5f8s5fh45hir",
};

export default new CognitoUserPool(poolData);