function Score(props) {
  return (
    <div className="bg-black/40 text-white fixed top-1/4 left-[12vw] p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-green-500">Score: {props.score}</h2>
      <h2 className="text-2xl font-bold">Roll Number: {props.rollNo}</h2>
    </div>
  )
}

export default Score;