import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase_configuration';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAns = () => {
  const [totalQues, setTotalQues] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [ans, setAns] = useState({});

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

  const fetchExistingAnswers = async (subject) => {
    try {
      const ansRef = doc(db, 'answers', `${subject}_answers`);
      const snapshot = await getDoc(ansRef);
      if (snapshot.exists()) {
        const existingAns = snapshot.data();
        setAns(existingAns);
        // Set total questions based on existing answers
        const maxQuestionNum = Math.max(...Object.keys(existingAns)
          .map(key => parseInt(key.replace('q', ''))) || [0]);
        setTotalQues(maxQuestionNum);
        toast.info('Loaded existing answers');
      } else {
        setAns({});
        setTotalQues(0);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Error loading existing answers');
    }
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    if (subject) {
      fetchExistingAnswers(subject);
    } else {
      setAns({});
      setTotalQues(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      toast.error('Please select a subject first!');
      return;
    }
    if (totalQues === 0) {
      toast.error('Please set the number of questions!');
      return;
    }
    const ansRef = doc(db, 'answers', `${selectedSubject}_answers`);
    await setDoc(ansRef, ans, { merge: true });
    toast.success('Answers added successfully!');
  };

  const handleTotalQuesChange = (e) => {
    if (!selectedSubject) {
      toast.error('Please select a subject first!');
      return;
    }
    const newTotal = parseInt(e.target.value) || 0;
    setTotalQues(newTotal);
    
    // Preserve existing answers when changing total questions
    const newAns = {};
    for (let i = 1; i <= newTotal; i++) {
      const qKey = `q${i}`;
      newAns[qKey] = ans[qKey] || '';
    }
    setAns(newAns);
  };

  const handleIncrementQues = () => {
    if (!selectedSubject) {
      toast.error('Please select a subject first!');
      return;
    }
    const newTotal = totalQues + 1;
    setTotalQues(newTotal);
    setAns(prev => ({
      ...prev,
      [`q${newTotal}`]: ''
    }));
  };

  const handleAnsChange = (e) => {
    const { name, value } = e.target;
    setAns((prevAns) => ({
      ...prevAns,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gradient-to-r pt-32 from-gray-900 via-gray-800 to-black min-h-screen flex flex-col items-center pb-10">
      <div>
        <img src="/src/assets/Main_logo.png" alt="Logo" className=" h-24 w-28 mb-8" />
      </div>
      <div className="bg-black/40 backdrop-blur-md w-[25%] p-8 rounded-lg shadow-lg animate__animated animate__fadeIn animate__faster">
        <h1 className="text-3xl font-bold mb-6 text-green-500 text-center">Add Answers</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4 text-white">
            <label>
              Select Subject:
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="form-control block w-full px-3 py-2 text-base text-gray-900 bg-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group mb-4 mt-4 text-white">
            <label>
              Total Number of Questions:
              <div className='flex flex-row items-center justify-center'>
                <input
                  type="number"
                  className="form-control block w-full px-3 py-2 text-base text-gray-900 bg-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={totalQues}
                  onChange={handleTotalQuesChange}
                />
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded ml-4"
                  onClick={handleIncrementQues}
                >
                  <FaPlus />
                </button>
              </div>
            </label>
          </div>
          <div className="form-group mb-4 text-white">
            {Array.from({ length: totalQues }).map((_, i) => (
              <div key={i} className="mb-3">
                <label>
                  {`Question ${i + 1}`}
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 text-base text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-green-500 focus:border-green-500"
                    name={`q${i + 1}`}
                    value={ans[`q${i + 1}`] || ''}
                    onChange={handleAnsChange}
                    placeholder={`Enter answer for question ${i + 1}`}
                  />
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center mt-8 mx-auto block"
          >
            Add Answers
          </button>
        </form>
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
    </div>
  );
};

export default AddAns;
