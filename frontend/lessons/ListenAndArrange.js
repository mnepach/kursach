function ListenAndArrange({ lesson, onAnswer }) {
  const [selectedWords, setSelectedWords] = React.useState([]);
  const [shuffledWords, setShuffledWords] = React.useState([]);
  const [availableWords, setAvailableWords] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  React.useEffect(() => {
    const shuffled = [...lesson.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setAvailableWords(shuffled);
  }, [lesson.words]);

  const handleWordClick = (word, fromAvailable) => {
    if (checked) return;
    if (fromAvailable) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else {
      setAvailableWords([...availableWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
  };

  const handleCheck = () => {
    if (checked) {
      onAnswer(isCorrect, lesson);
    } else {
      const userAnswer = selectedWords.join(' ');
      const correct = userAnswer === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
    }
  };

  const playAudio = () => {
    console.log('Playing audio:', lesson.audio);
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
              Составьте из слов предложение
            </h2>
            <p className="text-lg text-[var(--text-light)] mb-6">
              Прослушайте фразу и составьте предложение
            </p>
            
            <button 
              onClick={playAudio}
              className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-[var(--accent-color)] transition-all"
            >
              <img 
                src="./trickle/assets/icons/speaker_32px_ffffff.svg"
                alt="speaker"
                className="w-10 h-10"
              />
            </button>
          </div>

          <div className={`card mb-6 min-h-[100px] ${
            checked 
              ? (isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500') 
              : 'bg-gray-50'
          }`}>
            <div className="flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <p className="text-gray-400 text-lg">Выберите слова снизу...</p>
              ) : (
                selectedWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word, false)}
                    disabled={checked}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      checked 
                        ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                        : 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]'
                    }`}
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {checked && !isCorrect && (
            <div className="card bg-green-50 border-2 border-green-500 mb-6">
              <p className="text-lg text-green-700">
                <strong>Правильный ответ:</strong> {lesson.correctAnswer}
              </p>
            </div>
          )}

          <div className="card">
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, true)}
                  disabled={checked}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-medium hover:border-[var(--primary-color)] transition-all disabled:opacity-50"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={handleCheck}
            disabled={selectedWords.length === 0}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              selectedWords.length === 0
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

export default ListenAndArrange;