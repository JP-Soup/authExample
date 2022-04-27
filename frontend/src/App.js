import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/home' element={<Home />} />
					<Route path='/me' element={<Profile />} />
				</Routes>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
