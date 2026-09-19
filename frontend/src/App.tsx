import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoal';
import CreateTransaction from './pages/CreateTransaction';
import CreateBudget from './pages/CreateBudget'
import CreateSavingsGoal from './pages/CreateSavingsGoal';
import EditTransaction from './pages/EditTransaction';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        <Route path="/savings-goals" element={<ProtectedRoute><SavingsGoals /></ProtectedRoute>} />
        <Route path="/transactions/new" element={<ProtectedRoute><CreateTransaction /></ProtectedRoute>} />
        <Route path="/budgets/new" element={<ProtectedRoute><CreateBudget /></ProtectedRoute>} />
        <Route path="/savings-goals/new" element={<ProtectedRoute><CreateSavingsGoal /></ProtectedRoute>} />
        <Route path="/transactions/:id/edit" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;