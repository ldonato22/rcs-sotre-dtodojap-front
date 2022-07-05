import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import './tailwind.output.css';

const rootElement = document.getElementById("root");
rootElement.className = "container-fluid"
const root = ReactDOM.createRoot(rootElement);

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

root.render(
    <Auth0Provider 
        domain={domain} 
        clientId={clientId} 
        redirectUri={window.location.origin}>
        <App />
    </Auth0Provider>
);