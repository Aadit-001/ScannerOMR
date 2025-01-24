import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, fireDB, serverTimestamp } from '../firebase/firebase_configuration';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Loader from '../components/Loader'; 
import { FaGoogle, FaLock, FaEnvelope } from 'react-icons/fa';
import VideoBackground from '../components/VideoBackground';

const DEFAULT_PROFILE_PHOTO = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, provider);
      
      // Create user object
      const user = {
        uid: result.user.uid,
        displayName: result.user.displayName || '',
        email: result.user.email || '',
        photoURL: result.user.photoURL || DEFAULT_PROFILE_PHOTO,
        createdAt: serverTimestamp()
      };

      // Check if user exists in Firestore
      const userDoc = doc(fireDB, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      // If user doesn't exist, create new document
      if (!docSnap.exists()) {
        await setDoc(userDoc, user);
      }

      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login Successful!', {
        position: "top-right",
        autoClose: 2000,
      });
      
      navigate('/');
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      // Detailed error handling
      let errorMessage = "Google Sign In Failed";
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with a different credential";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Popup was blocked. Please enable popups for this site.";
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in popup was closed before completion";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid Google credentials. Please try again.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user object with default photo
      const user = {
        ...userCredential.user,
        photoURL: userCredential.user.photoURL || DEFAULT_PROFILE_PHOTO
      };

      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login Successful!', {
        position: "top-right",
        autoClose: 2000,
      });
      
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
      toast.error('Login Failed: ' + error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VideoBackground>
      {isLoading && <Loader />}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6 relative overflow-hidden"
      >
        {/* Cyberpunk grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 0, 0.04) 25%, rgba(32, 255, 0, 0.04) 26%, transparent 27%, transparent 74%, rgba(32, 255, 0, 0.04) 75%, rgba(32, 255, 0, 0.04) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 0, 0.04) 25%, rgba(32, 255, 0, 0.04) 26%, transparent 27%, transparent 74%, rgba(32, 255, 0, 0.04) 75%, rgba(32, 255, 0, 0.04) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold text-green-400 mb-2">OMR Scanner</h2>
          <p className="text-gray-400 text-sm">Secure Authentication Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 bg-gray-800 border border-gray-700 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </motion.div>

          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-3 bg-gray-800 border border-gray-700 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </motion.button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-700 w-full"></div>
            <span className="bg-gray-900 px-3 text-gray-500 text-sm absolute">OR</span>
          </div>

          <motion.button 
            type="button"
            className="w-full border border-gray-700 text-green-400 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </motion.button>

          <div className="text-center mt-4 relative z-10">
            <span className="text-gray-400">New to the system? </span>
            <Link 
              to="/signup"
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Create Account
            </Link>
          </div>
        </form>
      </motion.div>
    </VideoBackground>
  );
};

export default Login;