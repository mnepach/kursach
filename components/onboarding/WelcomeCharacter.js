function WelcomeCharacter({ onNext }) {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-end p-8 pb-12">
      <div className="max-w-4xl w-full flex-1 flex flex-col items-center justify-end">
        
        <div className="flex items-end justify-center w-full max-w-lg mb-4">
          
          <img 
            src="../trickle/assets/hello.jpg" 
            alt="Hello Kitty"
            className="w-64 h-64 object-contain sideways" 
          />

          <div className="relative ml-4 mb-10">
            <div 
              className="bg-white rounded-3xl p-4 shadow-xl border-4 border-[var(--primary-color)]"
              style={{ minWidth: '220px', maxWidth: '300px' }}
            >
              <p className="text-xl font-bold text-[var(--text-dark)]">
                Привет! Я Hello Kitty 👋
              </p>
              <p className="text-[var(--text-dark)] mt-1">
                Я буду твоим проводником в мире LinguaPlay! Нажми "Далее", чтобы продолжить.
              </p>
            </div>
            
            <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-[var(--primary-color)]"></div>
            <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-white"></div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl border-t border-gray-200 pt-6">
        <button onClick={onNext} className="btn-primary ml-auto block">
          Далее
        </button>
      </div>
    </div>
  );
}