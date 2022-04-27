import { useNavigate } from 'react-router-dom';

import '../scss/_home.scss';

const Home = () => {
	const navigate = useNavigate();

	const onClick = () => {
		navigate('/me');
	};

	return (
		<section className='profile-container'>
			<h1 className='success'>Login Successful 🔥</h1>

			<p className='para'>Check the Application tab in the browser console, you should have tokens stored in Session Storage and Cookies </p>
			<p className='para'>Now click below to go to Profile page, this will route through authMiddleware and provide verification of Tokens & Cookies</p>

			<button className='profile' onClick={onClick}>
				Go to Profile 😀
			</button>
		</section>
	);
};

export default Home;
