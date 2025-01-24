import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, fireDB, serverTimestamp } from '../firebase/firebase_configuration';
import { provider } from '../firebase/firebase_configuration';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Loader from '../components/Loader';
import { FaUser, FaLock, FaEnvelope, FaGoogle } from 'react-icons/fa';
import VideoBackground from '../components/VideoBackground';

const DEFAULT_PROFILE_PHOTO = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGoogleSignUp = async () => {
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

      // Show success message
      toast.success('User registered successfully', {
        position: "top-right",
        autoClose: 2000,
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      
      // Detailed error handling
      let errorMessage = "Google Sign Up Failed";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!formData.fullname || !formData.email || !formData.password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        displayName: formData.fullname,
        email: formData.email,
        photoURL: DEFAULT_PROFILE_PHOTO,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(fireDB, 'users', user.uid), userDoc);

      toast.success('Account Created Successfully!', {
        position: "top-right",
        autoClose: 2000,
      });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast.error('Signup Failed: ' + error.message, {
        position: "top-right",
        autoClose: 2000,
      });
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
          <p className="text-gray-400 text-sm">Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaUser />
            </div>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
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

          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaLock />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-700 w-full"></div>
            <span className="bg-gray-900/80 px-3 text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-700 w-full"></div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-green-400 font-bold py-3 rounded-lg transition-all duration-300 border border-gray-700"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <FaGoogle className="w-5 h-5" />
            Sign up with Google
          </motion.button>

          <div className="text-center mt-4 relative z-10">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              to="/login"
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </motion.div>
    </VideoBackground>
  );
};

export default Signup;