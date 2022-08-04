import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './components/Navigation.js'

import HomePage from './pages/HomePage.js'
import AddExercise from './pages/AddExercise.js'
import EditExercise from './pages/EditExercise.js'

function App() {  

  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">
      <Router>
        <header className="App-header">
            <h1>exercise tracker</h1>
            <h3>jon moore, full stack MERN application</h3>

        </header>
        
        <Navigation />
        <main>
          <Route path = '/' exact><HomePage setExerciseToEdit={setExerciseToEdit}/></Route>
          <Route path = '/home' exact><HomePage /></Route>
          <Route path = '/add' exact><AddExercise /></Route>
          <Route path = '/edit' exact><EditExercise exerciseToEdit={exerciseToEdit}/></Route>
        </main>
        

        <footer>
          <p>modified on 3/13/22. &copy; 2022 jon moore.</p>
        </footer>
      </Router>
    </div>
  );
}

export default App;
