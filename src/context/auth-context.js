import React, { useState } from 'react';

export const AuthContext = React.createContext({
	isAuth: false,
	login: () => { }
});

const AuthContextProvider = props => {

	const [isAuthentecated, setIsAuthenticated] = useState(false);

	const loginHandler = () => {
		setIsAuthenticated(true);
	}

	return (
		<AuthContext.Provider
			value={{
				login: loginHandler,
				isAuth: isAuthentecated,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider