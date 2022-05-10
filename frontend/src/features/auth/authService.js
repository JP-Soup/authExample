import axios from 'axios';

const API_LOGIN_URL = '/api/users/login';
const API_PROFILE_URL = '/api/users/me';
const API_NEW_ACCESS_URL = '/api/users/access';

const login = async (userData) => {
	const response = await axios.post(API_LOGIN_URL, userData);

	const { token, refreshToken, fingerprint } = response.data;

	if (response.data) {
		sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));
		sessionStorage.setItem('fingerprint', JSON.stringify(fingerprint));
	}
	return token;
};

const getMe = async (authData) => {
	const { accessToken, fingerprint } = authData;

	// POST @ '/api/users/me' with access token attached
	const response = await axios.post(API_PROFILE_URL, {
		access: accessToken,
		fingerprint: fingerprint,
	});

	const user = response.data;

	return user;
};

const getNewAccess = async (token) => {
	// POST @ '/api/users/access' with refreshToken attached
	const response = await axios.post(API_NEW_ACCESS_URL, {
		refreshToken: token,
	});

	//Remove unloaded from session storage
	sessionStorage.removeItem('unLoaded');

	// Return new access token
	const newAccessToken = response.data;
	return newAccessToken;
};

// Logout user
const logout = () => {
	sessionStorage.removeItem('refreshToken');
	sessionStorage.removeItem('fingerprint');
};

const authService = {
	login,
	getMe,
	getNewAccess,
	logout,
};

export default authService;
