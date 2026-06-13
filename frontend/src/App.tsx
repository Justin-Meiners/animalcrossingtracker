import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import './styles/Variables.css'
import Fish from './pages/Fish'
import Bugs from './pages/Bugs'
import Sea from './pages/Sea'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fish" element={<Fish />} />
          <Route path="/bugs" element={<Bugs />} />
          <Route path="/sea" element={<Sea />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
