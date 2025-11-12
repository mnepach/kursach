function ListenAndArrange({ lesson, onAnswer }) {
  const [selectedWords, setSelectedWords] = React.useState([]);
  const [availableWords, setAvailableWords] = React.useState([...lesson.words]);

  const handleWordClick = (word, fromAvailable) => {
    if (fromAvailable) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else {
      setAvailableWords([...availableWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
  };

  const handleCheck = () => {
    const userAnswer = selectedWords.join(' ');
    const isCorrect = userAnswer === lesson.correctAnswer;
    onAnswer(isCorrect);
  };

  const handleSkip = () => {
    onAnswer(false);
  };

  const playAudio = () => {
    // В реальном приложении здесь будет воспроизведение аудио
    console.log('Playing audio:', lesson.audio);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
            Составьте перевод из слов
          </h2>
          <p className="text-lg text-[var(--text-light)] mb-6">
            Прослушайте фразу и составьте её перевод на русский
          </p>
          
          <button 
            onClick={playAudio}
            className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-[var(--accent-color)] transition-all"
          >
            <i className="lucide-volume-2 text-4xl text-white"></i>
          </button>
        </div>

        <div className="card mb-6 min-h-[100px] bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {selectedWords.length === 0 ? (
              <p className="text-gray-400 text-lg">Выберите слова снизу...</p>
            ) : (
              selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, false)}
                  className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:bg-[var(--accent-color)] transition-all"
                >
                  {word}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(word, true)}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-medium hover:border-[var(--primary-color)] transition-all"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleCheck}
          disabled={selectedWords.length === 0}
          className={`w-full py-4 rounded-xl font-bold transition-all mb-3 ${
            selectedWords.length > 0
              ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Проверить
        </button>

        <button 
          onClick={handleSkip}
          className="w-full py-4 bg-transparent border-2 border-gray-400 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          ДАЛЕЕ
        </button>
      </div>
    </div>
  );
}   