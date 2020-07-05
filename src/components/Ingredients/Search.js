import React, { useState, useEffect,useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter,setenteredFiltered]=useState('')
  const {onLoadingridiets}= props
  const inputRef= useRef()
useEffect(()=>{
  const timer= setTimeout(()=>{
    if(enteredFilter===inputRef.current.value){
      const query = enteredFilter.length === 0? ''
      :`?orderBy="title"&equalTo="${enteredFilter}"`;
      fetch('https://react-hocks-update-5bdc9.firebaseio.com/ingredients.json'+query)
      .then(response=>response.json()
      )
      .then(responseData=>{
        const loadIngridients=[]
        for(const key in responseData){
          loadIngridients.push({
            
            id:key,
            title:responseData[key].title,
            amount:responseData[key].amount
          })
        }
        onLoadingridiets(loadIngridients)
      })
    }
  },500)
  return ()=>{
    clearTimeout(timer)
  }
  
},[enteredFilter,onLoadingridiets,inputRef])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
          ref={inputRef}
          value={enteredFilter}
          onChange= {event=> setenteredFiltered(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
