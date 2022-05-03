import { useEffect } from 'react';
import '../scss/_profile.scss';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import profile from '../img/profile.png';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe, getNewAccessToken, logout } from '../features/auth/authSlice';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user, accessToken, isLoading, cookieError, isError, newAccess, secondAuthError, isLoggedIn, message } = useSelector((state) => state.auth);

	// Listen for page refresh (unload)
	window.addEventListener('unload', function () {
		sessionStorage.setItem('unLoaded', true);
	});

	// If unloaded in sessionStorage, check for fingerprint and refresh token, return new access token
	useEffect(() => {
		const unLoaded = sessionStorage.getItem('unLoaded');

		if (unLoaded) {
			const isRefreshToken = sessionStorage.getItem('refreshToken');
			const isFingerprint = sessionStorage.getItem('fingerprint');

			if (isRefreshToken && isFingerprint) {
				const token = {
					refreshToken: isRefreshToken,
				};

				dispatch(getNewAccessToken(token));
			}
		}
	}, [dispatch]);

	useEffect(() => {
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
		if (isError) {
			const refreshToken = sessionStorage.getItem('refreshToken');

			const token = {
				refreshToken: refreshToken,
			};

			dispatch(getNewAccessToken(token));
		}

		// If refresh token verification fails, return error and remove refresh token and fingerprint from session storage
		if (isError && secondAuthError) {
			toast.error(message);
			sessionStorage.removeItem('refreshToken');
			sessionStorage.removeItem('fingerprint');
		}
	}, [newAccess, user, isError, secondAuthError, cookieError, accessToken, isLoggedIn, message, dispatch]);

	const onNavigateHome = () => {
		navigate('/home');
	};

	const onLogout = async () => {
		await dispatch(logout());
		navigate('/');
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<section className='profile-container'>
			<Card sx={{ maxWidth: 345 }}>
				<CardMedia component='img' height='320' width='' image={profile} alt='man at desk' />
				<CardContent>
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
				<CardActions>
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
