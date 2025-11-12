function HowDidYouHear({ onNext }) {
  const [selected, setSelected] = React.useState(null);

  const options = [
    { icon: 'users', text: 'От друзей и знакомых' },
    { icon: 'search', text: 'Поиск в интернете' },
    { icon: 'instagram', text: 'Социальные сети' },
    { icon: 'youtube', text: 'YouTube' },
    { icon: 'newspaper', text: 'Реклама' },
    { icon: 'store', text: 'Магазин приложений' }
  ];

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (selected) {
      onNext({ howDidYouHear: selected });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-6 mb-12">
          <img 
            src="../trickle/assets/icon.jpg" 
            alt="Hello Kitty"
            className="w-24 h-24 rounded-full shadow-lg"
          />
          <div className="bg-white rounded-3xl px-8 py-6 shadow-xl flex-1">
            <p className="text-2xl font-bold text-[var(--text-dark)]">
              Как вы узнали о нашем приложении?
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`card flex items-center gap-4 text-left transition-all ${
                selected?.text === option.text ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="w-14 h-14 bg-[var(--secondary-color)] rounded-xl flex items-center justify-center">
                <i className={`lucide-${option.icon} text-2xl text-[var(--primary-color)]`}></i>
              </div>
              <span className="text-lg font-medium text-[var(--text-dark)]">{option.text}</span>
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