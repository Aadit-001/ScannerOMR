import React from 'react'

function Answers({ marked_questions }) {
  return (
    <>
    <div className=" fixed top-1/3 translate-y-1/3 left-[10vw] grid grid-cols-10 gap-2 pl-2">
      {marked_questions.map((markedQuestion, index) => (
        <div
          key={index}
          className={`text-[9px] flex justify-center items-center p-1 font-bold  rounded-md ${
            markedQuestion.marker === 'correct' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
    </>
  )
}

export default Answers