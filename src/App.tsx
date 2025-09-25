import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {
        user ? (
          <Home />
        ) : (
          <LoginSignup />
        )
      }
    </div>
  )
}

export default App
