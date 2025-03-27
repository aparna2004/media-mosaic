import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import TopNews from './pages/TopNews';
import Sports from './pages/Sports';
import Finance from './pages/Finance';
import Entertainment from './pages/Entertainment';
import Tech from './pages/Tech';
import GitHubRedirect from './components/GitHubRedirect';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<TopNews />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/ajay" element={<GitHubRedirect username="hajay180505" />} />
            <Route path="/aparna" element={<GitHubRedirect username="aparna2004" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
