import React, { useEffect } from 'react'
import { BrowserRouter,Routes, Route,Navigate  } from 'react-router-dom'
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';

import './App.css';
import userpool from './userpool';

function App() {

  useEffect(()=>{
    let user=userpool.getCurrentUser();
      if(user){
        <Navigate to="/dashboard" replace />
      }
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthForm />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;