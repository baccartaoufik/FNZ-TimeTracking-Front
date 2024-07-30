import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './Components/Login/Login';
import Layout from './Components/Layout/Layout';
import PrivateRoute from './PrivateRoute';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
                      }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;