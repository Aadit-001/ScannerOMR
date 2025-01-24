// src/components/UploadForm.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase_configuration';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FaFileUpload, FaCheckCircle } from 'react-icons/fa';

const UploadForm = ({ setResults, setImagePresent}) => {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const imgRef = useRef(null);
    const loaderRef = useRef(null);
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const [result,setResult] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            const subjectRef = doc(db, 'subject', 'subjects');
            const snapshot = await getDoc(subjectRef);
            if (snapshot.exists()) {
                setSubjects(snapshot.data().subjects);
            }
        };
        fetchSubjects();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setImageSrc(URL.createObjectURL(e.target.files[0]));
        if(!selectedSubject) {
            toast.error('Please select a subject first!');
            return;
        }else{
            setImagePresent(true);
            formRef.current.style.display = 'none';
            setLoading(false);
        }
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
        if (file) {
            setFile(null);
            setImageSrc(null);
            setImagePresent(false);
            if (formRef.current) {
                formRef.current.style.display = 'block';
            }
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const saveResult = async (finallResult) => {
        try {
            const resultsRef = doc(db, 'results',`roll_no_${finallResult.roll_no}`);
            await setDoc(resultsRef, { ...finallResult });
            console.log('Result saved successfully');
            console.log(finallResult);
        } catch (error) {
            console.error('Error saving result:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubject) {
            toast.error('Please select a subject first!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', selectedSubject);
        setLoading(true);
        setImageSrc(URL.createObjectURL(file));
        setImagePresent(true);

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResults(response.data);
            console.log(response.data);
            const finallResult = {
                score: response.data.score,
                roll_no: response.data.roll_no,
                answers: response.data.answers,
                marked_questions: response.data.marked_questions,
                subject: selectedSubject
            }
            saveResult(finallResult);
            setResult(true);
            setLoading(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <div 
                className="relative bg-black w-[40%] rounded-2xl shadow-2xl border border-cyan-900/20 overflow-hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            rgba(0, 0, 0, 1), 
                            rgba(0, 0, 0, 1)
                        )
                    `,
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
                }}
            >
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

                <div ref={formRef} className="relative z-10 w-[100%] p-10 flex flex-col">
                    <div className="flex justify-between pl-10 pr-10 pb-2">
                        <div className="text-cyan-300 text-2xl w-full pb-4 text-center font-bold tracking-wider">
                            Upload OMR Sheet
                        </div>
                    </div>
                    <div className="mb-6">
                        <select
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            className="w-full p-3 text-cyan-200 bg-[#112240] border border-cyan-800/50 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-400"
                        >
                            <option value="" className="bg-[#0a192f]">Select Subject</option>
                            {subjects.map((subject, index) => (
                                <option key={index} value={subject} className="bg-[#0a192f]">{subject}</option>
                            ))}
                        </select>
                    </div>
                    <motion.label 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative cursor-pointer group"
                    >
                        <input 
                            type="file" 
                            ref={inputRef} 
                            onChange={handleFileChange} 
                            required 
                            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                        />
                        <div className="flex items-center justify-center p-4 border-2 border-dashed border-cyan-500/50 rounded-lg group-hover:border-cyan-400 group-hover:bg-cyan-500/10 transition-all duration-300">
                            <FaFileUpload className="mr-2 text-cyan-400 group-hover:text-cyan-300" />
                            <span className="text-cyan-300 group-hover:text-cyan-200">Select OMR Sheet</span>
                        </div>
                    </motion.label>
                </div>
                {selectedSubject && imageSrc && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        id="image-container" 
                        className="fixed top-24 left-1/2 transform -translate-x-1/2 h-[40vw] w-[30vw] z-40 border-4 border-cyan-500/50 rounded-xl overflow-hidden"
                    >
                        <img 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' 
                            }} 
                            ref={imgRef} 
                            src={imageSrc} 
                            alt="uploaded image" 
                        />
                        {imageSrc && loading && (
                            <div className="absolute top-0 left-0 bg-black/40 z-50 h-full w-full flex items-center justify-center">
                                <div className="animate-pulse text-cyan-400 text-2xl">
                                    Processing...
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
            <div className='flex flex-col fixed bottom-10 right-80 justify-center items-center gap-6 pl-10'>
                {!loading && imageSrc && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit} 
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 text-xl pl-14 pr-14 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                        <FaFileUpload className="mr-2" />
                        Scan
                    </motion.button>
                )}
                {result && imageSrc && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()} 
                        className="bg-gradient-to-r from-green-600 to-green-800 text-xl pl-4 pr-4 py-3 rounded-lg hover:from-green-700 hover:to-green-900 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    >
                        <FaCheckCircle className="mr-2" />
                        Scan Another
                    </motion.button>
                )}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

UploadForm.propTypes = {
    setResults: PropTypes.func.isRequired,
    setImagePresent: PropTypes.func.isRequired
};

export default UploadForm;