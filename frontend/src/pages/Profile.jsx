import { useEffect } from 'react';
import '../scss/_profile.scss';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import profile from '../img/profile.png';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe, getNewAccessToken, logout, resetSecondAuthError, reset } from '../features/auth/authSlice';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const errorMsg = 'Invalid user credentials';

	const { user, accessToken, isLoading, cookieError, isError, newAccess, secondAuthError, isLoggedIn, message } = useSelector((state) => state.auth);

	// If F5 event occurs, set 'window_refresh' item in session storage
	useEffect(() => {
		window.onbeforeunload = function () {
			sessionStorage.setItem('window_refresh', true);
		};

		return () => {
			window.onbeforeunload = null;
		};
	}, []);

	useEffect(() => {
		const windowRefresh = sessionStorage.getItem('window_refresh');

		if (windowRefresh) {
			const refreshToken = sessionStorage.getItem('refreshToken');

			const token = {
				refreshToken: refreshToken,
			};
			dispatch(getNewAccessToken(token));

			sessionStorage.removeItem('window_refresh');
		}

		if (accessToken && isLoggedIn && !user) {
			const fingerprint = sessionStorage.getItem('fingerprint');

			const authData = {
				accessToken,
				fingerprint,
			};

			// Provide access token for first verfication by routeAuthorization Middleware
			dispatch(getMe(authData));
		}

		if (newAccess && accessToken) {
			const fingerprint = sessionStorage.getItem('fingerprint');

			const authData = {
				accessToken,
				fingerprint,
			};

			// Provide access token for verfication by routeAuthorization Middleware
			dispatch(getMe(authData));
		}

		// If error is returned from first verification of access token, verify refresh token and issue new access token
		if (isError && message !== errorMsg) {
			const refreshToken = sessionStorage.getItem('refreshToken');

			const token = {
				refreshToken: refreshToken,
			};
			dispatch(getNewAccessToken(token));
		}

		//If error message is 'Validation Error' navigate to sign-in page
		if (message === errorMsg) {
			toast.error();
			dispatch(logout());
			navigate('/');
		}

		// If refresh token verification fails, return error and remove refresh token and fingerprint from session storage and provide an error message to user
		if (secondAuthError) {
			toast.error(message);
			sessionStorage.removeItem('refreshToken');
			sessionStorage.removeItem('fingerprint');
			navigate('/');
			dispatch(resetSecondAuthError());
		}
	}, [newAccess, user, isError, secondAuthError, cookieError, accessToken, isLoggedIn, message, navigate, dispatch]);

	const onNavigateHome = () => {
		navigate('/home');
	};

	//TODO: Is the async/await necessary?
	const onLogout = async () => {
		await dispatch(logout());
		navigate('/');
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<section className='profile-container'>
			<Card sx={{ maxWidth: 345 }} id='card-container'>
				<CardMedia component='img' height='320' width='' image={profile} alt='man at desk' />
				<CardContent className='content'>
					<Typography gutterBottom variant='h6' component='div'>
						Signed in as:
					</Typography>
					<Typography gutterBottom variant='p' component='div'>
						{user ? user.name : 'Username'}
					</Typography>
					<Typography gutterBottom variant='h6' component='div'>
						Email Address:
					</Typography>
					<Typography gutterBottom variant='p' component='div'>
						{user ? user.email : 'Please provide email address'}
					</Typography>
				</CardContent>
				<CardActions className='buttons'>
					<Button variant='contained' size='medium' onClick={onNavigateHome}>
						Back to Home
					</Button>
					<Button variant='contained' size='medium' color='error' onClick={onLogout}>
						Logout
					</Button>
				</CardActions>
			</Card>
		</section>
	);
};

export default Profile;
