
import './App.css'
import {Login} from './sistema/login/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {RedirectByAuth} from './sistema/auth/CheckUserAuth'
import { Painel } from './sistema/logged/painel/Painel';
import { Logout } from './sistema/logged/Logout';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectByAuth/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/> 
          <Route path="/painel/*" element={<Painel/>}/> 
        </Routes>
      </Router>
    </>
  )
}

export default App
