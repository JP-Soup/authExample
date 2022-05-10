import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, resetError } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

import { Avatar, Button, CssBaseline, TextField, Link, Box, Typography, Container, Modal } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	border: 'none',
	bgcolor: 'background.paper',
	boxShadow: 30,
	p: 4,
};

function Copyright(props) {
	return (
		<Typography variant='body2' color='text.secondary' align='center' {...props}>
			{'Copyright © '}
			<Link color='inherit' href='https://github.com/JP-Soup' underline='hover' target='_blank' rel='noreferrer'>
				Soup
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

const Login = () => {
	// Set modal controls
	const [modalOpen, setModalOpen] = useState(false);
	const handleOpen = () => setModalOpen(true);
	const handleClose = () => setModalOpen(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { accessToken, isLoggedIn, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

	useEffect(() => {
		// Open the Cookie Policy Modal
		handleOpen();

		//This resets session storage
		sessionStorage.removeItem('window_refresh');

		if (isError) {
			toast.error(message);
			dispatch(resetError());
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
			<Modal open={modalOpen} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
				<Box sx={modalStyle}>
					<Typography id='modal-modal-title' variant='h6' component='h2'>
						Cookie Policy
					</Typography>
					<Typography id='modal-modal-description' sx={{ mt: 2 }}>
						This application uses cookies. <br /> <br />
						Close this page now if you do not consent to allow cookies to be stored in the browser.
						<br />
						<br /> Cookies will be stored in your browser if you sign in to the application.
						<br /> <br /> All cookies have an expiry of 24 hours and will be removed from your browser upon expiry or you may delete them manually.
					</Typography>
				</Box>
			</Modal>

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

					<Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
						<TextField margin='normal' required fullWidth id='email' label='Email Address' name='email' autoComplete='email' autoFocus />
						<TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' />
						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
							Sign in
						</Button>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
};

export default Login;
