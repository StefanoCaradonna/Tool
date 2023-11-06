
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table } from 'react-bootstrap';
import MySidebar from './Sidebar';
import MyNavbar from './Navbar';
//import MyList from './List';
import { useState  } from 'react';
import FilmFilter from './FilmComponent';
import '../App.css'


  

function FilmRoute(props) {
  
    const [hiddenSide, setHiddenSide] = useState(false);
    const [filter, setFilter] = useState(props.vettFilter[0]); 
    //console.log("initialLoading: "+props.initialLoading);
    return (
        <div className="main-container">
            <Row>
                <MyNavbar hiddenSide={hiddenSide} setHiddenSide={setHiddenSide}/>
            </Row>
            <div className="wrapper">
                <MySidebar listFilm={props.list} vettFilter={props.vettFilter} filter={filter} setFilter={setFilter} 
                        hiddenSide={hiddenSide} setInitialLoading={props.setInitialLoading} />
                
                <div className="container-fluid d-flex px-3 pt-3 pb-4">
                {   
                    <FilmFilter  
                        vettFilter={props.vettFilter}
                        filter={props.filter} 
                        setFilter={setFilter}
                        list={props.list} 
                        setList={props.setList} 
                        hiddenSide={props.hiddenSide}
                        addToList={props.addToList} 
                        deleteRow={props.deleteRow} 
                        editRow={props.editRow}        
                        dirty={props.dirty}
                        setDirty={props.setDirty}
                        initialLoading={props.initialLoading}
                        setInitialLoading={props.setInitialLoading}

                    />
                }
                </div>
            </div>

        </div>
    )
  }
  
  export default FilmRoute