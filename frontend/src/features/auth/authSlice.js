import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService.js';
import { useDispatch, useSelector } from 'react-redux';

const initialState = {
	user: null,
	accessToken: '',
	isLoggedIn: false,
	isLoading: false,
	isSuccess: false,
	isError: false,
	cookieError: false,
	secondAuthError: false,
	message: '',
};

//Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
	try {
		return await authService.login(user);
	} catch (err) {
		const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

		return thunkAPI.rejectWithValue(message);
	}
});

//Get user profile
export const getMe = createAsyncThunk('auth/profile', async (authData, thunkAPI) => {
	try {
		// Provide access token and fingerprint to authService
		return await authService.getMe(authData);
	} catch (err) {
		const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

		return thunkAPI.rejectWithValue(message);
	}
});

//Get new access token via refresh token
export const getNewAccessToken = createAsyncThunk('auth/access', async (token, thunkAPI) => {
	const { refreshToken } = token;

	try {
		// Provide refresh token to authService
		return await authService.getNewAccess(refreshToken);
	} catch (err) {
		const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();

		return thunkAPI.rejectWithValue(message);
	}
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
	await authService.logout();
});

export const authSlice = createSlice({
	name: 'auth',
	initialState,

	reducers: {
		reset: (state) => {
			state.user = null;
			state.isLoading = false;
			state.isSuccess = false;
			state.isError = false;
			state.secondAuthError = false;
			state.message = '';
		},
		authReset: (state) => {
			state.user = null;
			state.isLoading = false;
			state.isSuccess = false;
			state.isError = false;
			state.secondAuthError = false;
			state.message = '';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.accessToken = action.payload;
				state.isLoggedIn = true;
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.accessToken = '';
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getMe.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMe.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getMe.rejected, (state, action) => {
				state.user = null;
				state.accessToken = '';
				state.isLoading = false;
				state.isError = false;
				state.cookieError = true;
				state.message = action.payload;
			})
			.addCase(getNewAccessToken.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getNewAccessToken.fulfilled, (state, action) => {
				state.accessToken = action.payload.token;
				state.isLoading = false;
				state.isSuccess = true;
				state.isError = false;
			})
			.addCase(getNewAccessToken.rejected, (state, action) => {
				state.user = null;
				state.accessToken = '';
				state.isLoggedIn = false;
				state.isLoading = false;
				state.isError = true;
				state.secondAuthError = true;
				state.message = action.payload;
			})
			.addCase(logout.fulfilled, (state) => {
				state.accessToken = '';
				state.isLoggedIn = false;
			});
	},
});

export const { reset, authReset } = authSlice.actions;
export default authSlice.reducer;
