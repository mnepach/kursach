function TranslateToRussian({ lesson, onAnswer }) {
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
      const correct = selected === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
            Переведите на русский
          </h2>
          <p className="text-3xl font-bold text-[var(--primary-color)] text-center py-8">
            {lesson.targetText}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {lesson.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={checked}
              className={`card w-full text-left transition-all ${
                selected === option
                  ? checked
                    ? option === lesson.correctAnswer
                      ? 'ring-4 ring-green-500 bg-green-50'
                      : 'ring-4 ring-red-500 bg-red-50'
                    : 'ring-4 ring-[var(--primary-color)]'
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
          onClick={handleCheck}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            !selected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]'
          }`}
        >
          {checked ? 'Далее' : 'Проверить'}
        </button>
      </div>
    </div>
  );
}