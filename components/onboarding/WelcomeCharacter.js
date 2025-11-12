function WelcomeCharacter({ onNext }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 relative inline-block">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-3xl px-8 py-4 shadow-xl">
            <p className="text-2xl font-bold text-[var(--text-dark)]">
              Привет! Я Hello Kitty 👋
            </p>
          </div>
          <img 
            src="../trickle/assets/icon.jpg" 
            alt="Hello Kitty"
            className="w-64 h-64 mx-auto rounded-full shadow-2xl mt-16"
          />
        </div>
        
        <button onClick={onNext} className="btn-primary mt-16">
          Далее
        </button>
      </div>
    </div>
  );
}