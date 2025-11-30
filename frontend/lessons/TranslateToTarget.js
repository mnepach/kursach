function TranslateToTarget({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [shuffledOptions, setShuffledOptions] = React.useState([]);

  React.useEffect(() => {
    const shuffled = [...lesson.options].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [lesson.options]);

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
      className="min-h-screen flex flex-col p-8"
      style={{
        backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingBottom: '140px'
      }}
    >
      <div className="flex-1 flex items-center justify-center">
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
            {shuffledOptions.map((option, index) => {
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-6">
        <div className="max-w-3xl mx-auto">
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
    </div>
  );
}