function ListenAndArrange({ lesson, onAnswer }) {
  const [selectedWords, setSelectedWords] = React.useState([]);
  const [shuffledWords, setShuffledWords] = React.useState([]);
  const [availableWords, setAvailableWords] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);

  React.useEffect(() => {
    const shuffled = [...lesson.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setChecked(false);
    setIsCorrect(false);
    setShowNotification(false);
  }, [lesson]);

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
      setShowNotification(false);
      onAnswer(isCorrect, lesson);
    } else {
      const userAnswer = selectedWords.join(' ');
      const correct = userAnswer === lesson.correctAnswer;
      setIsCorrect(correct);
      setChecked(true);
      setShowNotification(true);
      
      const audioPath = correct 
        ? './trickle/assets/audio/right_answer.mp3' 
        : './trickle/assets/audio/wrong_answer.mp3';
      const audio = new Audio(audioPath);
      audio.play().catch(err => console.error('Audio playback error:', err));
    }
  };

  const playAudio = () => {
    if (lesson.audio) {
      const audio = new Audio(`./trickle/assets/audio/${lesson.audio}`);
      audio.play().catch(err => console.error('Audio playback error:', err));
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
      {showNotification && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: isCorrect ? '#10B981' : '#EF4444',
            color: 'white',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            zIndex: 10000,
            animation: 'slideDown 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>

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
                    key={`selected-${index}`}
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
                  key={`available-${index}-${word}`}
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