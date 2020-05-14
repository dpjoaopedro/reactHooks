import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/useHttp';

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET': return action.ingredients;
		case 'ADD': return [...currentIngredients, action.ingredient];
		case 'DELETE': return currentIngredients.filter(ing => ing.id !== action.id);
		default: throw Error('Should not get there!');
	}
}

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const { loading, error, data, sendRequest, reqExtra, identifier, clear } = useHttp();

	useEffect(() => {
		if (loading || error) return;
		switch (identifier) {
			case 'ADD_INGREDIENT':
				dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } }); break;
			case 'REMOVE_INGREDIENT':
				dispatch({ type: 'DELETE', id: reqExtra }); break;
			default: break;
		}
	}, [data, reqExtra, identifier, loading, error]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		dispatch({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	const addIngredientHandler = useCallback(ingredient => {
		sendRequest(`https://react-h-e71a4.firebaseio.com/ingredients.json`,
			'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT')
	}, [sendRequest]);

	const removeIngredientHandler = useCallback(ingredientId => {
		sendRequest(`https://react-h-e71a4.firebaseio.com/ingredients/${ingredientId}.json`,
			'DELETE', null, ingredientId, 'REMOVE_INGREDIENT')
	}, [sendRequest]);

	return (
		<div className="App">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<IngredientForm onAddIngredient={addIngredientHandler} loading={loading} />
			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
