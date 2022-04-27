// import { useSelector, useEffect, useState } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import jwt from 'jsonwebtoken';

// const useAuthRefresh = () => {
// 	const [isTokenValid, setIsTokenValid] = useState(false);

// 	//Need to create some kind of token state and dispatch the isValid state
// 	const dispatch = useDispatch();

// 	// This will retrieve the access token from user state
// 	const { accessToken } = useSelector((state) => state.auth.user);

// 	// Generate Access Token
// 	const generateAccessToken = (user) => {
// 		return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
// 	};

// 	useEffect(() => {
// 		try {
// 			jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS_TOKEN);
// 		} catch (err) {
// 			console.log('Location:useRefreshToken.js, Message: Access Token is not valid');

// 			const refreshToken = sessionStorage.getItem('refreshToken');

// 			const decodedRefreshToken = jwt.decode(refreshToken);

// 			const userId = decodedRefreshToken.id;

// 			console.log(userId, 'This has come from userRefreshToken decode');

// 			jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (err, _) => {
// 				if (err) return console.log('Location: useRefreshToken.js, Message: The refreshToken is not valid');

// 				const newAccessToken = generateAccessToken(userId);

// 				return newAccessToken;
// 			});

//             // update state of
// 		}
// 	}, [accessToken]);

// 	return newAccessToken;
// };

// export default useAuthRefresh;
