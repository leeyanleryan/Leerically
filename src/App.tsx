import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/main.css'
import './css/App.css'
import Topbar from './tsx/Topbar'
import Home from './tsx/Home'
import About from './tsx/About'
import Search from './tsx/Search'
import SignIn from './tsx/SignIn'
import SignUp from './tsx/SignUp'
import Song from './tsx/Song'
import NotFound from './tsx/404';

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