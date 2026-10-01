import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';
import CreateTransaction from './pages/CreateTransaction';
import CreateBudget from './pages/CreateBudget'
import CreateSavingsGoal from './pages/CreateSavingsGoal';
import EditTransaction from './pages/EditTransaction';
import EditSavingsGoal from './pages/EditSavingsGoal';
import EditBudget from './pages/EditBudget';
import SavingsProjection from './pages/SavingsProjection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/savings-goals" element={<SavingsGoals />} />
          <Route path="/transactions/new" element={<CreateTransaction />} />
          <Route path="/budgets/new" element={<CreateBudget />} />
          <Route path="/savings-goals/new" element={<CreateSavingsGoal />} />
          <Route path="/transactions/:id/edit" element={<EditTransaction />} />
          <Route path="/savings-goals/:id/edit" element={<EditSavingsGoal />} />
          <Route path="/budgets/:id/edit" element={<EditBudget />} />
          <Route path="/savings-projection" element={<SavingsProjection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
