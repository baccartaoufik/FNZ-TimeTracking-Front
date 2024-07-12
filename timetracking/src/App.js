import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Layout from './Components/Layout/Layout';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/app' element={<Layout />} >
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;