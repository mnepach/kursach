function SelectWordByImage({ lesson, onAnswer }) {
  const [selected, setSelected] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: -1
        }}
      ></div>

      <div className="max-w-4xl w-full" style={{ marginBottom: '100px' }}>
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-6">
        <div className="max-w-4xl mx-auto">
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