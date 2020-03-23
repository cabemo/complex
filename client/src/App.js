import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Router>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
          <div>
            <Route exact path="/" component={Fib} />
            <Route path="/otherpage" component={OtherPage} />
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
