import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddAns from './admin/addAns.jsx'
import RootLayout from './components/RootLayout.jsx'
import AddSub from './admin/addSub.jsx'
import { db } from './firebase/firebase_configuration';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Authentication/login.jsx';
import Signup from './Authentication/Signup.jsx';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<App />} />
          <Route path="profile" element={<App />} />
          <Route 
            path="add-ans" 
            element={
              <ProtectedRoute>
                <AddAns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="add-sub" 
            element={
              <ProtectedRoute>
                <AddSub />
              </ProtectedRoute>
            } 
          />
          <Route path="error" element={<ErrorPage />} />
          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>,
)
