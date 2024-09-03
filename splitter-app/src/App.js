import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthForm from './components/AuthForm';
import TransactionManager from './components/TransactionManager';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthForm />}/>
        <Route 
          path="/expenses" 
          element={
            <ProtectedRoute>
              <TransactionManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;