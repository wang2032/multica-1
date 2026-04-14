import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TripListPage from './pages/TripListPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TripListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;