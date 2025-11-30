function TranslateToTarget({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  const handleSelect = (option) => {
    if (checked) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (checked) {
      onAnswer(isCorrect, lesson);
    } else {
      const correct = selected === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-8"
      style={{
        backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex-1"></div>

      <div className="max-w-3xl w-full">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
            Переведите на {lesson.targetLanguage}
          </h2>
          <p className="text-3xl font-bold text-[var(--primary-color)] text-center py-8">
            {lesson.russianText}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {lesson.options.map((option, index) => {
            const isSelectedOption = selected === option;
            const isCorrectOption = option === lesson.correctAnswer;
            
            let buttonClass = 'card w-full text-left transition-all hover:bg-gray-50';
            
            if (checked) {
              if (isCorrectOption) {
                buttonClass = 'card w-full text-left transition-all ring-4 ring-green-500 bg-green-50';
              } else if (isSelectedOption && !isCorrect) {
                buttonClass = 'card w-full text-left transition-all ring-4 ring-red-500 bg-red-50';
              }
            } else if (isSelectedOption) {
              buttonClass = 'card w-full text-left transition-all ring-4 ring-[var(--primary-color)]';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                disabled={checked}
                className={buttonClass}
              >
                <p className="text-xl font-medium text-[var(--text-dark)]">
                  {option}
                </p>
              </button>
            );
          })}
        </div>

        {checked && !isCorrect && (
          <div className="card bg-green-50 border-2 border-green-500 mb-6">
            <p className="text-lg text-green-700">
              <strong>Правильный ответ:</strong> {lesson.correctAnswer}
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl border-t border-gray-200 pt-6">
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