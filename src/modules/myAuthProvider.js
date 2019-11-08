import {
	AUTH_LOGIN,
	AUTH_LOGOUT,
	AUTH_ERROR,
	AUTH_CHECK
} from 'react-admin';

const apiURL = 'http://localhost:3000/api';

const fetchPostLoginUser = async (username, password) => {
		
	const data = {
		username,
		password
	};

	const options = {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		},
		mode: 'cors'
	};

	const response = await fetch(apiURL + '/login/admin', options);		
		
	return await response.json();

};


const fetchGetLogoutUser = async (username, password) => {
		
	const data = {
		username,
		password
	};

	const options = {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		mode: 'cors'
	};

	const response = await fetch(apiURL + '/logout', options);		
		
	return await response.json();

};


export default (type, params) => {

	switch (type) {
	case AUTH_LOGIN:
	{
		const { username, password } = params;
		
		return fetchPostLoginUser(username, password).then(res => {
			
			if (res.status < 200 || res.status >= 300) {
				throw new Error(res.error.message);
			}

			const { _id, firstname, lastname } = res.data.user;

			localStorage.setItem('idbitzone', _id);
			localStorage.setItem('username', username);
			localStorage.setItem('firstname', firstname);
			localStorage.setItem('lastname', lastname);

			return Promise.resolve();
			
		});

	}	
	case AUTH_LOGOUT:

		return fetchGetLogoutUser().then(res => {
			localStorage.removeItem('idbitzone');
			localStorage.removeItem('username');
			localStorage.removeItem('firstname');
			localStorage.removeItem('lastname');			
			
			if ((res.status < 200 || res.status >= 300) && res.status !== 511) {
				throw new Error(res.message);
			}			
			return Promise.resolve();

		});
	
	case AUTH_ERROR:
	{
		const { status } = params;
		if (status === 511) {
			localStorage.removeItem('idbitzone');
			localStorage.removeItem('username');
			localStorage.removeItem('firstname');
			localStorage.removeItem('lastname');
			return Promise.reject();
		}
		return Promise.resolve();  
	
	}
	case AUTH_CHECK:
		
		return localStorage.getItem('idbitzone') ? Promise.resolve() : Promise.reject();
		
	default:
		// eslint-disable-next-line
		return Promise.reject('Unknown method');

	}

};
