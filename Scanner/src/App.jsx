import { useState } from 'react';
import UploadForm from './UploadForm';
import Score from './components/Score';
import Answer from './components/Answers';
import logo from '../src/assets/Main_logo.png';
import { motion } from 'framer-motion';

const App = () => {
    const [imagePresent, setImagePresent] = useState(false);
    const [results, setResults] = useState({
        score: 0,
        roll_no: '',
        answers: [],
        marked_questions: []
    });
    
    return (
        <div 
            className="relative min-h-screen min-w-screen flex justify-center items-center overflow-hidden bg-black"
            style={{
                background: 'linear-gradient(135deg, #0a0a14, #121020, #0a0a14)',
                backgroundSize: 'cover'
            }}
        >
            <motion.img 
                src={logo} 
                alt="Logo" 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-8 h-24 w-28 z-10" 
            />

            <div className="relative z-20 flex flex-col items-center justify-center w-full">
                {results.marked_questions.length > 0 && imagePresent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Answer marked_questions={results.marked_questions} />
                    </motion.div>
                )}

                <UploadForm setResults={setResults} setImagePresent={setImagePresent} />

                {results.answers.length > 0 && imagePresent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8"
                    >
                        <Score score={results.score} rollNo={results.roll_no} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default App;