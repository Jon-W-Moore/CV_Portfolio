import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Navigation () {
    return(
        <nav>
            <Link to='/home'>home</Link>
            <Link to='/add'>add</Link>
        </nav>
    );
}

export default Navigation;