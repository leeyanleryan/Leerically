import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Topbar from './Topbar'
import Home from './Home'

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App