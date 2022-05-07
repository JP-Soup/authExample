import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import home from '../img/home.png';
import '../scss/_home.scss';

const Home = () => {
	const { accessToken, isLoggedIn } = useSelector((state) => state.auth);

	const navigate = useNavigate();

	const onClick = () => {
		navigate('/me');
	};

	const onNavigateSignIn = () => {
		navigate('/');
	};

	return (
		<section className='home-container'>
			{accessToken && isLoggedIn ? (
				<>
					<img className='home-img' src={home} alt='man' />
					<h1 className='success'>Sign in Successful 🔥</h1>
					<br />
					<Button variant='contained' color='success' size='large' onClick={onClick}>
						Go to Profile 😀
					</Button>
				</>
			) : (
				<>
					<h1 className='success'>You are not signed in</h1>
					<Button variant='contained' size='medium' onClick={onNavigateSignIn}>
						Sign In
					</Button>
				</>
			)}
		</section>
	);
};

export default Home;
