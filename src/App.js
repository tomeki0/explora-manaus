import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import MainPage from './components/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={<HomePage/>} />
        <Route path="/main" component={<MainPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
