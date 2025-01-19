// src/components/Results.js

const Results = ({ score, rollNo, answers }) => {

    return (
        <div>
            <h2>Results</h2>
            <p>Score: {score}</p>
            <p>Roll Number: {rollNo}</p>
            <h3>Answers:</h3>
            {answers && answers.length > 0 ? (
                <ul>
                    {answers.map((answer, index) => (
                        <li key={index}>Question {index + 1}: {answer}</li>
                    ))}
                </ul>
            ) : (
                <p>No answers available.</p>
            )}
        </div>
    );
};

export default Results;