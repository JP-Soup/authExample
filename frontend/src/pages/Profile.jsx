import { useEffect } from 'react';
import '../scss/_profile.scss';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import profile from '../img/profile.png';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe, getNewAccessToken, logout, resetSecondAuthError } from '../features/auth/authSlice';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user, accessToken, isLoading, isError, newAccess, secondAuthError, isLoggedIn, message } = useSelector((state) => state.auth);

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

		if ((accessToken && isLoggedIn && !user) || (accessToken && newAccess)) {
			const fingerprint = sessionStorage.getItem('fingerprint');

			const authData = {
				accessToken,
				fingerprint,
			};

			// Provide access token for verfication by routeAuthorization Middleware
			dispatch(getMe(authData));
		}

		// Initialize error message
		const errorMsg = 'Invalid user credentials';

		// If error is returned from first verification of access token, verify refresh token and issue new access token
		if (isError && message !== errorMsg) {
			const refreshToken = sessionStorage.getItem('refreshToken');

			const token = {
				refreshToken: refreshToken,
			};
			dispatch(getNewAccessToken(token));
		}

		//If error message is 'Invalid user credentials' navigate to sign-in page
		if (message === errorMsg) {
			toast.error(message);
			dispatch(logout());
			navigate('/');
		}

		// If refresh token verification fails, return error and remove refresh token & fingerprint from session storage, then provide an error message to user
		if (secondAuthError) {
			toast.error(message);
			sessionStorage.removeItem('refreshToken');
			sessionStorage.removeItem('fingerprint');
			navigate('/');
			dispatch(resetSecondAuthError());
		}
	}, [newAccess, user, isError, secondAuthError, accessToken, isLoggedIn, message, navigate, dispatch]);

	const onNavigateHome = () => {
		navigate('/home');
	};

	const onNavigateSignIn = () => {
		navigate('/');
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
			<Card sx={{ maxWidth: 345 }} id='card-container'>
				<CardMedia component='img' height='320' width='' image={profile} alt='man at desk' />
				<CardContent className='content'>
					<Typography gutterBottom variant='h6' component='div'>
						Signed in as:
					</Typography>
					<Typography gutterBottom variant='p' component='div'>
						{user ? user.name : 'User not signed in'}
					</Typography>
					<Typography gutterBottom variant='h6' component='div'>
						Email Address:
					</Typography>
					<Typography gutterBottom variant='p' component='div'>
						{user ? user.email : 'User has not provided email'}
					</Typography>
				</CardContent>
				<CardActions className='buttons'>
					{user ? (
						<>
							<Button variant='contained' size='medium' onClick={onNavigateHome}>
								Back to Home
							</Button>
							<Button variant='contained' size='medium' color='error' onClick={onLogout}>
								Logout
							</Button>
						</>
					) : (
						<Button variant='contained' size='medium' onClick={onNavigateSignIn}>
							Sign In
						</Button>
					)}
				</CardActions>
			</Card>
		</section>
	);
};

export default Profile;
