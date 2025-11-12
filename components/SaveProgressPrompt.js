function SaveProgressPrompt({ onRegister, onDownload }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <img 
          src="../trickle/assets/kitty.png" 
          alt="Kitty"
          className="w-48 h-48 mx-auto mb-8"
        />
        
        <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-4">
          Пора создать аккаунт!
        </h1>
        
        <p className="text-xl text-[var(--text-light)] mb-8">
          Создайте аккаунт, чтобы сохранить<br />прогресс и продолжить заниматься<br />бесплатно.
        </p>
        
        <div className="space-y-4">
          <button onClick={onRegister} className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all">
            СОЗДАТЬ АККАУНТ
          </button>
          
          <button onClick={onDownload} className="w-full max-w-md mx-auto block py-4 bg-transparent border-2 border-gray-400 text-gray-600 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all">
            ПОЗЖЕ
          </button>
        </div>
      </div>
    </div>
  );
}