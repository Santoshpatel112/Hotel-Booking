import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import PropertyTypeDetails from "./pages/propertyTypeDetails/PropertyTypeDetails";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
      }}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/hotels" element={<List/>}/>
          <Route path="/hotels/:id" element={<Hotel/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/properties/:type" element={<PropertyTypeDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
