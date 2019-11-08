/* eslint react/jsx-filename-extension: "off" */
import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/stable'; // ** THIS 2 LINES ARE NEEDED FOR PROMISES AND ASYNC FUNCTIONS
import 'regenerator-runtime/runtime'; // AND OTHER JAVASCRIPT NEW FEATURES
import App from './App';

const destination = document.getElementById('root');

ReactDOM.render(
	<App />,	
	destination
);
