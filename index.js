/**
 * @format
 */
import {name as appName} from './app.json';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';

// redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

// App
const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);


AppRegistry.registerComponent(appName, () => ReduxApp);
