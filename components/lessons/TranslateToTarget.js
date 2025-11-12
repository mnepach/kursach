function TranslateToTarget({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setTimeout(() => {
      const isCorrect = option === lesson.correctAnswer;
      onAnswer(isCorrect);
    }, 500);
  };

  const handleSkip = () => {
    onAnswer(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
            Переведите на {lesson.targetLanguage}
          </h2>
          <p className="text-3xl font-bold text-[var(--primary-color)] text-center py-8">
            {lesson.russianText}
          </p>
        </div>

        <div className="space-y-4">
          {lesson.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`card w-full text-left transition-all ${
                selected === option
                  ? option === lesson.correctAnswer
                    ? 'ring-4 ring-green-500 bg-green-50'
                    : 'ring-4 ring-red-500 bg-red-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-xl font-medium text-[var(--text-dark)]">
                {option}
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