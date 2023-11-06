
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, } from 'react-bootstrap';
import FilmRoute from './components/FilmRoute';
import { FormRoute } from './components/FilmForm';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import API from './API';

import './App.css'

const vettFilter = [
  "All", "Favorites", "Best Rates", "Seen last month", "Unseen"
];

function DefaultRoute() {
  return(
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to='/'><button>Please go back to main page</button></Link>
    </Container>
  );
}

function App() {
  const [list, setList] = useState([]); 
  const [initialLoading, setInitialLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

    
  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
    else if (err.error)
      errMsg = err.error;
        
    setErrorMsg(errMsg);
    //setTimeout(()=>setDirty(true), 2000);  // Fetch correct version from server, after a while
  }

  function deleteRow(id){
    setList((oldList) => oldList.map(
      e => e.id !== id ? e : Object.assign({}, e, {status: 'deleted'})
    ));
    //setInitialLoading(true);//per adesso  
    API.deleteFilm(id)
      .then(() => {
        setDirty(true);
        //setList((oldList) => oldList.filter((elem) => elem.id !== id )); //superfluo
      })
      .catch((err) => handleError(err)); 

  }

  function addToList(elem) {
      setList( (oldList) => [...oldList, elem] )
      //setInitialLoading(true);
      API.addFilm(elem)
        .then(() => {
          setDirty(true);
        })
        .catch((err) => handleError(err));
  }

  function editRow(newEl){
      setList((oldList) => oldList.map((e) => {
      if (e.id === newEl.id) {
        newEl.status = 'updated';
          return newEl;
      } else {
          return e;
      }
      }));
      
      //setInitialLoading(true); //provvisorio
      API.editFilm(newEl)
        .then(() => {
          setDirty(true);
        })
        .catch((err) => handleError(err));
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <FilmRoute  
                                    vettFilter={vettFilter}
                                    list={list} 
                                    setList={setList} 
                                    addToList={addToList} 
                                    deleteRow={deleteRow} 
                                    editRow={editRow} 
                                    initialLoading={initialLoading} 
                                    setInitialLoading={setInitialLoading}
                                    setDirty={setDirty}
                                    dirty={dirty} />
                                }
        />

        <Route path='/:filmName' element={ <FilmRoute  
                                    vettFilter={vettFilter}
                                    list={list} 
                                    setList={setList} 
                                    addToList={addToList} 
                                    deleteRow={deleteRow} 
                                    editRow={editRow} 
                                    initialLoading={initialLoading}
                                    setInitialLoading={setInitialLoading} 
                                    setDirty={setDirty}
                                    dirty={dirty} />
                                }
        />
        
        <Route path='/add'  element={ <FormRoute list={list} addToList={addToList} /> } />

        <Route path='/edit/:filmId' element={ <FormRoute list={list} addToList={addToList} editRow={editRow} /> } />
        <Route path='/filter/:filterName' 
                element={ <FilmRoute 
                    vettFilter={vettFilter}
                    list={list} 
                    setList={setList} 
                    addToList={addToList} 
                    deleteRow={deleteRow} 
                    editRow={editRow} 
                    initialLoading={initialLoading} 
                    setInitialLoading={setInitialLoading}
                    setDirty={setDirty}
                    dirty={dirty} 
                           />} />
        <Route path='/*' element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App