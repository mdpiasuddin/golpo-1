import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rooteReducer from './reducer/Index';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';

const store = createStore(rooteReducer, composeWithDevTools())
ReactDOM.render(<Provider store={store}> <App /> </Provider>, document.getElementById('root'));


