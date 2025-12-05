import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Todos from "./pages/Todos.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login"></Navigate>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Todos></Todos>
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
