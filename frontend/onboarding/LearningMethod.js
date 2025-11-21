function LearningMethod({ onNext }) {
  const [selected, setSelected] = React.useState(null);

  const methods = [
    { 
      id: 'basics',
      icon: 'book-open', 
      title: 'Начать с основ',
      description: 'Изучайте язык с самого начала, шаг за шагом'
    },
    { 
      id: 'test',
      icon: 'clipboard-check', 
      title: 'Определить уровень',
      description: 'Пройдите тест и начните с подходящего уровня'
    }
  ];

  const handleSelect = (method) => {
    setSelected(method);
    setTimeout(() => {
      onNext({ learningMethod: method });
    }, 300);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-6 mb-12">
          <img 
            src="../trickle/assets/hello.png" 
            alt="Hello Kitty"
            className="w-32 h-32 object-contain bounce"
          />
          <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl flex-1 relative border-2 border-gray-200">
            <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[24px] border-t-transparent border-b-transparent border-r-gray-200"></div>
            <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[14px] border-b-[14px] border-r-[22px] border-t-transparent border-b-transparent border-r-white"></div>
            <p className="text-2xl font-bold text-[var(--text-dark)]">
              Как вы хотите изучать язык?
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((method, index) => (
            <button
              key={index}
              onClick={() => handleSelect(method)}
              className={`card text-center transition-all ${
                selected?.id === method.id ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="w-20 h-20 bg-[var(--secondary-color)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className={`lucide-${method.icon} text-4xl text-[var(--primary-color)]`}></i>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
                {method.title}
              </h3>
              <p className="text-lg text-[var(--text-light)]">
                {method.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LearningMethod;