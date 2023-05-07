import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App" ;


const container = document.getElementById('root');

const app = ReactDOMClient.createRoot(container);

app.render(<Provider store={store}>
<App />
</Provider>);


