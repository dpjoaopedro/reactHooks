import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/useHttp';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');
	const inputRef = useRef();
	const { loading, error, data, sendRequest, clear } = useHttp();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
				const query =
					enteredFilter.length === 0
						? ''
						: `?orderBy="title"&equalTo="${enteredFilter}"`;

				sendRequest('https://react-h-e71a4.firebaseio.com/ingredients.json' + query, 'GET')

			}
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [enteredFilter, inputRef, sendRequest])

	useEffect(() => {
		if (loading || error || !data) return;
		const loadedIngredients = [];
		for (const key in data) {
			loadedIngredients.push({
				id: key,
				title: data[key].title,
				amount: data[key].amount
			});
		}
		onLoadIngredients(loadedIngredients);

	}, [data, loading, error, onLoadIngredients])

	return (
		<section className="search">
			{error && <ErrorModal onClose={clear}></ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{loading && <span>Loading...</span>}
					<input
						ref={inputRef}
						type="text"
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
