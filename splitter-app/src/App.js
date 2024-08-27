import React from 'react'
import { BrowserRouter,Routes, Route  } from 'react-router-dom'
import AuthForm from './components/AuthForm';
import ExpenseManager from './components/TransactionManager';

import './App.css';

function App() {

 

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthForm />}/>
        <Route path="/expenses" element={<ExpenseManager/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;