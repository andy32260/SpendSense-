import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const { accessToken } = useAuth();
  console.log('accessToken:', accessToken);

  return <Login />;
}

export default App;