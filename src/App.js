import './App.scss';
import Task1 from './pages/task1';
import Task2 from './pages/task2';
import Home from './pages/home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task1" element={<Task1 />} />
      <Route path="/task2" element={<Task2 />} />
    </Routes>

  );
}

export default App;
