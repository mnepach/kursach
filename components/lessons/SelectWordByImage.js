function SelectWordByImage({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setTimeout(() => {
      const isCorrect = option.text === lesson.correctAnswer;
      onAnswer(isCorrect);
    }, 500);
  };

  const handleSkip = () => {
    onAnswer(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="card mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-dark)] text-center mb-8">
            {lesson.word}
          </h2>
          <p className="text-xl text-[var(--text-light)] text-center">
            Выберите правильный перевод
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lesson.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`card text-center transition-all ${
                selected?.text === option.text 
                  ? option.text === lesson.correctAnswer
                    ? 'ring-4 ring-green-500 bg-green-50'
                    : 'ring-4 ring-red-500 bg-red-50'
                  : ''
              }`}
            >
              <div className="text-6xl mb-4">{option.emoji}</div>
              <p className="text-xl font-bold text-[var(--text-dark)]">
                {option.text}
              </p>
            </button>
          ))}
        </div>

        <button 
          onClick={handleSkip}
          className="w-full py-4 mt-6 bg-transparent border-2 border-gray-400 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          ДАЛЕЕ
        </button>
      </div>
    </div>
  );
}