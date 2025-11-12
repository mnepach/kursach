function SelectWordByImage({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  const handleSelect = (option) => {
    if (checked) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (checked) {
      onAnswer(isCorrect);
    } else {
      const correct = selected.text === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {lesson.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={checked}
              className={`card text-center transition-all ${
                selected?.text === option.text 
                  ? checked
                    ? option.text === lesson.correctAnswer
                      ? 'ring-4 ring-green-500 bg-green-50'
                      : 'ring-4 ring-red-500 bg-red-50'
                    : 'ring-4 ring-[var(--primary-color)]'
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
          onClick={handleCheck}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            !selected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : checked
                ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {checked ? 'Далее' : 'Проверить'}
        </button>
      </div>
    </div>
  );
}