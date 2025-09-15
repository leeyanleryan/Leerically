import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './Topbar'
import Home from './Home'
import About from './About'

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App