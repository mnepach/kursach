function WelcomeCharacter({ onNext }) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-8"
      style={{
        backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex-1"></div>
      
      <div className="max-w-4xl w-full flex items-end justify-center gap-8 mb-8">
        <img 
          src="./trickle/assets/mascot.gif" 
          alt="Hello Kitty"
          className="w-96 h-96 object-contain rounded-full"
          style={{
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)'
          }}
        />

        <div className="relative mb-10">
          <div 
            className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-[var(--primary-color)]"
            style={{ minWidth: '280px', maxWidth: '350px' }}
          >
            <p className="text-2xl font-bold text-[var(--text-dark)] mb-2">
              Привет! Я Hello Kitty 👋
            </p>
            <p className="text-[var(--text-dark)] text-lg">
              Я буду твоим проводником в мире LinguaPlay! Нажми "Далее", чтобы продолжить.
            </p>
          </div>
          
          <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-[var(--primary-color)]"></div>
          <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[18px] border-t-transparent border-b-transparent border-r-white"></div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl border-t border-gray-200 pt-6">
        <button onClick={onNext} className="btn-primary ml-auto block px-12 py-4">
          Далее
        </button>
      </div>
    </div>
  );
}

export default WelcomeCharacter;
