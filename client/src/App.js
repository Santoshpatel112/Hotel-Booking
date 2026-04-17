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
import EnhancedAdminDashboard from "./pages/admin/EnhancedAdminDashboard.jsx";
import AdminDashboardDemo from "./pages/demo/AdminDashboardDemo.jsx";
import DashboardDemo from "./pages/demo/DashboardDemo.jsx";
import HotelManagementDemo from "./pages/demo/HotelManagementDemo.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PropertyTypeDetails from "./pages/propertyTypeDetails/PropertyTypeDetails";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
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
              <EnhancedAdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin={true}>
              <EnhancedAdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/admin-old" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/dashboard-demo" element={
            <DashboardDemo/>
          }/>
          <Route path="/admin-demo" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardDemo/>
            </ProtectedRoute>
          }/>
          <Route path="/hotel-management-demo" element={
            <HotelManagementDemo/>
          }/>
          <Route path="/properties/:type" element={<PropertyTypeDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </ThemeProvider>
  );
}

export default App;
