// src/components/UploadForm.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import AddAns from './admin/addAns';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase_configuration';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaFileUpload } from 'react-icons/fa';

const UploadForm = ({ setResults, setImagePresent}) => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    // const [showAddAns, setShowAddAns] = useState(false);
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
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            // Only fetch subjects if user is authenticated
            const fetchSubjects = async () => {
                const subjectRef = doc(db, 'subject', 'subjects');
                const snapshot = await getDoc(subjectRef);
                if (snapshot.exists()) {
                    setSubjects(snapshot.data().subjects);
                }
            };
            fetchSubjects();
        });

        return () => unsubscribe();
    }, [navigate]);

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
            // toast.info('Image cleared. Please select a new image.');
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
            <div className={`bg-gradient-to-r from-gray-900 via-gray-800 to-black w-full md:w-[60%] lg:w-[40%] rounded-lg shadow-md mx-auto`}>
                <div ref={formRef} className={` w-full p-10 flex flex-col`}>
                    <div className="flex flex-col md:flex-row justify-between px-4 md:px-10 pb-2">
                        <div className="text-green-500 text-xl md:text-2xl w-full pb-4 text-center font-bold">Select an image to upload</div>
                        {/* <button type="submit" className="bg-green-500 pl-5 pr-5 pt-2 pb-2 hover:bg-primary-700 text-white font-bold rounded "> */}
                    </div>
                    <div className="mb-6">
                        <select
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            className="w-full p-2 text-gray-700 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((subject, index) => (
                                <option key={index} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <label className=" h-[100%] relative cursor-pointer group">
                        {/* <input type="file" ref={inputRef} onChange={handleFileChange} required className="w-full cursor-pointer h-[12%] pt-1 pl-4 text-gray-700 from-gray-900 via-gray-800 to-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 tracking-wider" /> */}
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
                    </label>
                </div>
                {selectedSubject && imageSrc && (
                    <div id="image-container" className="fixed top-24 left-1/2 transform -translate-x-1/2 h-[40vw] w-[30vw] z-40">
                        <img style={{ width: '100%', height: '100%', border: '6px solid green' }} ref={imgRef} src={imageSrc} alt="uploaded image" />
                        {imageSrc && loading && (
                            <div className="absolute top-0 left-0 bg-black/20 z-50 h-full w-full">
                                <div className="h-full z-50 w-full">
                                    <div className="animate-custom-bounce border-2 border-green-500 h-1 w-full shadow-glow"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='flex flex-col fixed bottom-10 right-0 md:right-20 lg:right-80 justify-center items-center gap-6 px-4 md:px-10'>
            {!loading && imageSrc && (
                <button onClick={handleSubmit} className="bg-green-500 text-lg md:text-xl px-8 md:px-14 py-2 rounded-lg hover:bg-green-700 text-white font-bold">
                    Scan
                </button>
            )}
            {result && imageSrc && (
                <button onClick={() => window.location.reload()} className="bg-green-500 text-lg md:text-xl px-4 md:px-4 py-2 rounded-lg hover:bg-green-700 text-white font-bold">
                    Scan Another
                </button>
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
};

export default UploadForm;