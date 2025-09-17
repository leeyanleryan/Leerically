import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Topbar from './Topbar'
import Home from './Home'
import About from './About'
import Search from './Search'

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  )
}

export default App