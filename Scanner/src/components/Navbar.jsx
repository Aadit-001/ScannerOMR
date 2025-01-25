import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Main_logo.png';
import { AiOutlineUser } from 'react-icons/ai';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase_configuration';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DEFAULT_PROFILE_PHOTO = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        // Check localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Stored User:', parsedUser);
            console.log('PhotoURL from localStorage:', parsedUser.photoURL);
            setUser(parsedUser);
        }

        // Then set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log('Current User from Firebase:', currentUser);
                console.log('Current User PhotoURL:', currentUser.photoURL);

                const userWithPhoto = {
                    ...currentUser,
                    photoURL: currentUser.photoURL || DEFAULT_PROFILE_PHOTO
                };
                
                console.log('User With Photo:', userWithPhoto);
                
                setUser(userWithPhoto);
                localStorage.setItem('user', JSON.stringify(userWithPhoto));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user');
            toast.success('Logged out successfully!', {
                position: "top-right",
                autoClose: 2000,
            });
            navigate('/');
            setShowProfileMenu(false);
        } catch (error) {
            toast.error('Logout Failed: ' + error.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <motion.nav 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed z-50 top-0 left-0 right-0 backdrop-blur-md flex justify-between items-center p-4 text-white"
            style={{
                backgroundImage: `
                    linear-gradient(
                        rgba(0, 0, 0, 1), 
                        rgba(0, 0, 0, 1)
                    ),
                    radial-gradient(circle at top right, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at bottom left, rgba(0, 255, 255, 0.05) 0%, transparent 50%)
                `,
                background: 'black',
                boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1), 0 0 40px rgba(0, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
                transform: 'perspective(1000px) translateZ(20px)'
            }}
        >
            {/* Cyberpunk Grid Overlay */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.08) 25%, rgba(0, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.08) 75%, rgba(0, 255, 255, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.08) 25%, rgba(0, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.08) 75%, rgba(0, 255, 255, 0.08) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Glowing Border Effect */}
            <motion.div 
                className="absolute inset-[-2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-2xl blur-sm"
                animate={{
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'loop'
                }}
            />

            {/* Floating Glow Effect */}
            <div 
                className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[200%] h-[200%] bg-cyan-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"
                style={{
                    animation: 'float 6s ease-in-out infinite',
                }}
            />

            <div className="flex items-center cursor-pointer" onClick={() => {navigate('/');window.location.reload()}}>
                <motion.img 
                    src={logo} 
                    alt="Logo" 
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-12 w-16 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]" 
                />
                <span className="text-xl font-bold text-cyan-200 ml-2 tracking-wider drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]">OMR Checker</span>
            </div>
            <div className="flex items-center space-x-8">
                {user && (
                    <div className="flex space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link 
                                to="/add-ans" 
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                            >
                                Add Ans
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link 
                                to="/add-sub" 
                                className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                            >
                                Add Sub
                            </Link>
                        </motion.div>
                    </div>
                )}
                
                {user ? (
                    <div className="relative">
                        <motion.div 
                            onClick={toggleProfileMenu} 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer flex items-center space-x-2"
                        >
                            {user.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="h-10 w-10 rounded-full object-cover border-2 border-cyan-500/50 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_PROFILE_PHOTO;
                                    }}
                                />
                            ) : (
                                <AiOutlineUser className="h-10 w-10 rounded-full bg-cyan-800/50 text-cyan-300 p-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]" />
                            )}
                        </motion.div>

                        {showProfileMenu && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-64 bg-[#112240] text-cyan-200 rounded-lg shadow-2xl border border-cyan-500/30 overflow-hidden drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                            >
                                <div className="p-4 flex items-center border-b border-cyan-500/30 bg-[#0a192f]/50">
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile" 
                                            className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-cyan-500/50 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                                            onError={(e) => {
                                                e.target.src = DEFAULT_PROFILE_PHOTO;
                                            }}
                                        />
                                    ) : (
                                        <AiOutlineUser className="h-12 w-12 rounded-full bg-cyan-800/50 text-cyan-300 p-2 mr-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-cyan-200 drop-shadow-[0_0_5px_rgba(0,255,255,0.2)]">{user.displayName || 'User'}</p>
                                        <p className="text-sm text-cyan-400 drop-shadow-[0_0_3px_rgba(0,255,255,0.2)]">{user.email}</p>
                                    </div>
                                </div>
                                <motion.button 
                                    whileHover={{ backgroundColor: 'rgba(0, 255, 255, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center py-3 hover:bg-cyan-500/10 text-red-400 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]"
                                >
                                    <FiLogOut className="mr-2" /> Logout
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <motion.button 
                        onClick={handleLogin} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    >
                        Login
                    </motion.button>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
