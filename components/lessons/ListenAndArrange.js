function ListenAndArrange({ lesson, onAnswer }) {
  const [selectedWords, setSelectedWords] = React.useState([]);
  const [availableWords, setAvailableWords] = React.useState([...lesson.words]);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

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
      onAnswer(isCorrect);
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

        <div className={`card mb-6 min-h-[100px] ${checked ? (isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500') : 'bg-gray-50'}`}>
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

        <div className="card mb-8">
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

        <button 
          onClick={handleCheck}
          disabled={selectedWords.length === 0}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            selectedWords.length === 0
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