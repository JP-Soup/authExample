import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import home from '../img/home.png';
import '../scss/_home.scss';

const Home = () => {
	const navigate = useNavigate();

	const onClick = () => {
		navigate('/me');
	};

	return (
		<section className='profile-container'>
			<img className='home-img' src={home} alt='man' />
			<h1 className='success'>Login Successful 🔥</h1>
			<br />
			<Button variant='contained' color='success' size='large' onClick={onClick}>
				Go to Profile 😀
			</Button>
		</section>
	);
};

export default Home;
