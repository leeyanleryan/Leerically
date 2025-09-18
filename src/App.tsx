import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Topbar from './Topbar'
import Home from './Home'
import About from './About'
import Search from './Search'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Song from './Song'
import NotFound from './404';

function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:slug" element={<Song />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App