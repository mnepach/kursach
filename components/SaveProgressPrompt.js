function SaveProgressPrompt({ onRegister, onDownload }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="card text-center">
          <div className="w-32 h-32 bg-gradient-blue rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="lucide-save text-6xl text-white"></i>
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-4">
            Сохраните свой прогресс!
          </h1>
          
          <p className="text-xl text-[var(--text-light)] mb-8">
            Чтобы не потерять достижения и продолжить обучение, зарегистрируйтесь или скачайте приложение
          </p>
          
          <div className="space-y-4">
            <button onClick={onRegister} className="btn-primary w-full">
              Зарегистрироваться
            </button>
            
            <button onClick={onDownload} className="btn-secondary w-full">
              Скачать приложение
            </button>
          </div>
          
          <p className="text-sm text-[var(--text-light)] mt-6">
            Ваш прогресс будет сохранён и доступен на всех устройствах
          </p>
        </div>
      </div>
    </div>
  );
}