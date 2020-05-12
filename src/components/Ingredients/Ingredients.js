import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

function Ingredients() {

  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    fetch('https://react-h-e71a4.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(responseData => {
      const loadingIngredients = [];
      for (const key in responseData) {
        loadingIngredients.push({
          id: key,
          title: responseData[key].ingredient.title,
          amount: responseData[key].ingredient.amount
        })

      }
      setIngredients(loadingIngredients)
    })
  }, []);



  const addIngredientHandler = (ingredient) => {
    fetch('https://react-h-e71a4.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ingredient}),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngredients(prevState => [...prevState, {id: responseData.name, ...ingredient}])
    })
  }

  const removeIngredientHandler = (id) => {
    setIngredients(prevState => prevState.filter(x => x.id !== id))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
