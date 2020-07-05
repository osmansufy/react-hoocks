import React, { useReducer, useEffect,useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal';

const IngredientReducer=(currentIngredients,action)=>{
  switch (action.type){
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ig=>ig.id!==action.id)
    default:
       throw new Error('Should not get here!') 
  }
}

const Ingredients = () => {
  const [userIngredients,dispatch]=useReducer(IngredientReducer,[])
 const {isLoading,data,error,sendRequest,reqExtra,reqIdentifer,clear}=useHttp()
  // const [userIngredients, setUserIngredients] = useState([]);
//  const [isLoading,setLoading]=useState(false)
// const [error, setError]=useState()
useEffect(()=>{
  if(!isLoading && !error && reqIdentifer==='REMOVE_INGREDIENT'){
    dispatch({ type: 'DELETE', id: reqExtra });
  }else if(!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT'){
    dispatch({
      type: 'ADD',
      ingredient: { id: data.name, ...reqExtra }
    });
  }

},[data, reqExtra, reqIdentifer, isLoading, error])
const filterIngridientHandaler= useCallback (filterIngridient=>{
  // setUserIngredients(filterIngridient)
  dispatch({type:'SET',ingredients:filterIngridient})
},[])
  const addIngredientHandler =useCallback (ingredient => {
    sendRequest(
      'https://react-hocks-update-5bdc9.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
    // setLoading(true)
    // dispatchHttp({type:'SEND'})
    // fetch('https://react-hocks-update-5bdc9.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    //   .then(response => {
    //     // setLoading(false)
    //     dispatchHttp({type:'RESPONSE'})
    //     return response.json();
    //   })
    //   .then(responseData => {
    //     // setUserIngredients(prevIngredients => [
    //     //   ...prevIngredients,
    //     //   { id: responseData.name, ...ingredient }
    //     // ]);
    //     dispatch({type:'ADD',ingredient:{ id: responseData.name, ...ingredient }})
    //   });
  },[]);

  const removeIngredientHandler =useCallback(ingredientId => {
    sendRequest(`https://react-hocks-update-5bdc9.firebaseio.com/ingredients/${ingredientId}.on`,
    
    'DELETE',
    null,
    ingredientId,
    'REMOVE_INGREDIENT'
    )

  },[sendRequest]);
  // const clearError=useCallback( ()=>{
  //   // dispatchHttp({type:'CLEAR_ERROR'})
   
  // },[])
  const ingredientList=useMemo(()=>{

    return ( <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler}
    />);
  
  },[userIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadingridiets={filterIngridientHandaler} />
       {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
