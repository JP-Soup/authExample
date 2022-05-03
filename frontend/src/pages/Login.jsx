import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

import { Avatar, Button, CssBaseline, TextField, Link, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
	return (
		<Typography variant='body2' color='text.secondary' align='center' {...props}>
			{'Copyright © '}
			<Link color='inherit' href='https://github.com/JP-Soup'>
				Soup
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { accessToken, isLoggedIn, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		//Redirect when logged in
		if (accessToken && isLoggedIn) {
			navigate('/home');
		}
	}, [isError, isLoggedIn, isSuccess, accessToken, message, navigate, dispatch]);

	const onSubmit = (e) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);

		const userData = {
			email: data.get('email'),
			password: data.get('password'),
		};

		dispatch(login(userData));
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<ThemeProvider theme={theme}>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 28,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Login
					</Typography>
					<Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
						<TextField margin='normal' required fullWidth id='email' label='Email Address' name='email' autoComplete='email' autoFocus />
						<TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' />
						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
							Login
						</Button>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
};

export default Login;
