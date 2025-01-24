import { useState } from 'react';
import { db, auth } from '../firebase/firebase_configuration';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddSub = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !auth.currentUser) {
            toast.error('Please log in to access this page');
            navigate('/login');
            return;
        }

        const fetchSubjects = async () => {
            const subjectRef = doc(db, 'subject', 'subjects');
            const snapshot = await getDoc(subjectRef);
            const subjects = snapshot.data().subjects;
            setSubjects(subjects);
        };
        fetchSubjects();
    }, [navigate]);

    const handleSubjectDelete = async (index) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
        const subjectRef = doc(db, 'subject', 'subjects');
        await setDoc(subjectRef, { subjects: updatedSubjects });
        toast.success('Subject deleted successfully!');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const subjectRef = doc(db, 'subject', 'subjects');
        await setDoc(subjectRef, { subjects: [...subjects, subject] });
        setSubjects([...subjects, subject]);
        toast.success('Subject added successfully!');
        setSubject('');
    };

    return (
        <>
        <div className="flex flex-col items-center p-40 ">
                <img src="/src/assets/Main_logo.png" alt="Logo" className=" absolute top-32 h-24 w-28" />
            <div className="bg-black/40 text-white backdrop-blur-md p-4 rounded-md shadow-md w-1/3 mt-24">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label htmlFor="subject" className="text-2xl font-bold text-center text-green-500">
                        Add Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="p-2 border-2 rounded-md text-black"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Add
                    </button>
                </form>
            </div>
            <div className="text-2xl font-bold text-white mt-20 mb-8 ">
                All Subjects
            </div>
            <div className="grid grid-cols-5 gap-4 ">
                {subjects.map((sub, i) => (
                    <div key={i} className="bg-black/40 text-white backdrop-blur-md p-4 rounded-md shadow-md flex justify-center items-center">
                        {sub}
                        <button onClick={() => handleSubjectDelete(i)} className=" absolute -right-2 -top-2 bg-red-500 hover:bg-red-700 h-6 w-6 pb-3 text-white font-bold rounded-full ml-4">
                            x
                        </button>
                    </div>
                ))}
            </div>
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

export default AddSub;
