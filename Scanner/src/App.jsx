// src/App.js
import { useState} from 'react';
import UploadForm from './UploadForm';
import Score from './components/Score';
import Answer from './components/Answers';
import logo from '../src/assets/Main_logo.png';

const App = () => {
    const [imagePresent, setImagePresent] = useState(false);
    const [results, setResults] = useState({
        score: 0,
        roll_no: '',
        answers: [],
        marked_questions: []
    });
    

    return (
        <>
        <div className="min-h-screen min-w-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
            <img src={logo} alt="Logo" className="absolute top-32 h-24 w-28 " />
            {
                results.marked_questions.length > 0 && imagePresent && (
                    <>
                    {/* <div className='text-2xl font-bold fixed top-1/4 translate-y-1/2 left-[18%] text-white'>Result</div> */}
                    <Answer marked_questions={results.marked_questions} />
                    </>
                )
            }
            <UploadForm setResults={setResults} setImagePresent={setImagePresent} />
            {/* <Score score={results.score} rollNo={results.roll_no} /> */}
            {results.answers.length > 0 && imagePresent && (
                <Score score={results.score} rollNo={results.roll_no} />
            )}
        </div>
        </>
    );
};

export default App;