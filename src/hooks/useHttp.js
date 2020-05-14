import { useReducer, useCallback } from 'react';

const initialState = {
	loading: false,
	error: null,
	data: null,
	reqExtra: null,
	identifier: null
}

const httpReducer = (state, action) => {
	switch (action.type) {
		case 'SEND': return { loading: true, error: null, reqExra: null, identifier: action.identifier }
		case 'RESPONSE': return { ...state, loading: false, error: null, data: action.data, reqExtra: action.reqExtra }
		case 'ERROR': return { loading: false, error: action.errorMessage }
		case 'CLEAR': return initialState
		default: throw Error('Should not get there!');
	}
}

const useHttp = () => {

	const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

	const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

	const sendRequest = useCallback((url, method, body, reqExtra, identifier) => {
		dispatchHttp({ type: 'SEND', identifier: identifier });
		fetch(url, {
			method: method,
			body: body,
			headers: {
				'Content-Type': 'application.json'
			}
		}).then(response => {
			return response.json();
		}).then(responseData => {
			dispatchHttp({ type: 'RESPONSE', data: responseData, reqExtra: reqExtra });
		}).catch(error => {
			dispatchHttp({ type: 'ERROR', errorMessage: "Something went wrong!" });
		});
	}, []);

	return {
		loading: httpState.loading,
		error: httpState.error,
		data: httpState.data,
		sendRequest: sendRequest,
		reqExtra: httpState.reqExtra,
		identifier: httpState.identifier,
		clear: clear
	};
};

export default useHttp;