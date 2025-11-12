function LanguageLevel({ onNext, selectedLanguage }) {
  const [selected, setSelected] = React.useState(null);

  const levels = [
    { level: 1, text: 'Совсем не знаю', bars: 1 },
    { level: 2, text: 'Знаю несколько слов', bars: 2 },
    { level: 3, text: 'Могу читать простые тексты', bars: 3 },
    { level: 4, text: 'Могу поддержать разговор', bars: 4 },
    { level: 5, text: 'Свободно владею', bars: 5 }
  ];

  const handleSelect = (level) => {
    setSelected(level);
  };

  const handleNext = () => {
    if (selected) {
      onNext({ languageLevel: selected });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-4 mb-8">
          <img 
            src="../trickle/assets/hello.png" 
            alt="Hello Kitty"
            className="w-20 h-20 rounded-full shadow-lg object-cover flex-shrink-0"
          />
          <div className="bg-white rounded-3xl px-6 py-4 shadow-xl flex-1">
            <p className="text-xl font-bold text-[var(--text-dark)]">
              Насколько хорошо вы знаете {selectedLanguage?.name?.toLowerCase()}?
            </p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => handleSelect(level)}
              className={`card w-full flex items-center gap-4 text-left transition-all py-3 ${
                selected?.level === level.level ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-10 rounded ${
                      i < level.bars ? 'bg-[var(--primary-color)]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-base font-medium text-[var(--text-dark)] flex-1">
                {level.text}
              </span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            selected 
              ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Далее
        </button>
      </div>
    </div>
  );
}