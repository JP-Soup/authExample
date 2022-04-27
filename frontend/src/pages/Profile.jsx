import { useEffect } from 'react';
import '../scss/_profile.scss';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

import { useSelector, useDispatch } from 'react-redux';
import { getMe, getNewAccessToken } from '../features/auth/authSlice';

const Profile = () => {
	const dispatch = useDispatch();

	const { user, accessToken, isLoading, cookieError, isError, secondAuthError, isLoggedIn, message } = useSelector((state) => state.auth);

	useEffect(() => {
		// First check of access token
		if (accessToken && isLoggedIn) {
			const fingerprint = sessionStorage.getItem('fingerprint');

			const authData = {
				accessToken,
				fingerprint,
			};

			// Provide access token for first verfication by routeAuthorization middleware
			dispatch(getMe(authData));
		}

		// If cookie authentication fails
		if (cookieError) {
			toast.error(message);
			sessionStorage.removeItem('refreshToken');
			sessionStorage.removeItem('fingerprint');
		}

		// If error is returned from first verification of access token, verify refresh token and issue new access token
		if (isError) {
			const refreshToken = sessionStorage.getItem('refreshToken');

			const token = {
				refreshToken: refreshToken,
			};

			dispatch(getNewAccessToken(token));
		}

		// If refresh token verification fails, return error and remove refresh token // from session storage
		if (isError && secondAuthError) {
			toast.error(message);
			sessionStorage.removeItem('refreshToken');
		}

		// if (!isLoggedIn) {
		// 	dispatch(reset());
		// }
	}, [isError, secondAuthError, cookieError, accessToken, isLoggedIn, message, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<section className='profile-container'>
			<h1>Profile Page</h1>

			<div className='profile-container_left'>
				<div className='profile-container_left-namecontainer'>
					<h3 className='profile-container_left-namecontainer_title'>Name</h3>
					<div className='profile-container_left-namecontainer_name'>{user ? user.name : ''}</div>
				</div>
				<div className='profile-container_left-emailcontainer'>
					<h3 className='profile-container_left-emailcontainer_title'>Email</h3>
					<div className='profile-container_left-emailcontainer_email'>{user ? user.email : ''}</div>
				</div>
			</div>
		</section>
	);
};

export default Profile;
