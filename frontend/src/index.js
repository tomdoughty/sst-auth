import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import "./index.css";
import AuthProvider from "./Auth";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const config = {
  Auth: {
    region: "us-east-1",
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    oauth: {
      domain: "thomashdoughty-auth-playground.auth.us-east-1.amazoncognito.com",
      scope: [
        "phone",
        "email",
        "profile",
        "openid",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code",
    },
    mandatorySignIn: false,
    cookieStorage: {
      domain: "localhost",
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: false,
    },
  },
};

Amplify.configure(config);

// const loginUrl = `https://${process.env.REACT_APP_HOSTED_COGNITO_URL}/logout?client_id=${process.env.REACT_APP_USER_POOL_CLIENT_ID}&logout_uri=http://localhost:3000/`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
