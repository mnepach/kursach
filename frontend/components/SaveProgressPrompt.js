function SaveProgressPrompt({ onRegister, onLater }) {
  const [showPlanSelection, setShowPlanSelection] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: 0,
      features: ['1 язык', 'Базовые уроки', 'Достижения']
    },
    {
      id: 'basic',
      name: 'Базовый',
      price: 499,
      features: ['До 3 языков', 'Без рекламы', 'Оффлайн режим']
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: 899,
      features: ['Все языки', 'Персонализация', 'Сертификаты']
    }
  ];

  const handleRegister = () => {
    setShowPlanSelection(true);
  };

  const handlePlanSelected = () => {
    onRegister(selectedPlan);
  };

  if (showPlanSelection) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-[var(--text-dark)] text-center mb-4">
            Выберите свой план
          </h1>
          <p className="text-xl text-[var(--text-light)] text-center mb-8">
            Вы можете изменить план в любое время
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`card text-center transition-all ${
                  selectedPlan === plan.id ? 'ring-4 ring-[var(--primary-color)]' : ''
                }`}
              >
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-[var(--primary-color)] mb-4">
                  {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽/мес`}
                </div>
                <ul className="space-y-2 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-[var(--text-dark)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <button
            onClick={handlePlanSelected}
            className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all"
          >
            Продолжить с планом "{plans.find(p => p.id === selectedPlan)?.name}"
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <img 
          src="./trickle/assets/kitty.png" 
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
          <button 
            onClick={handleRegister} 
            className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all"
          >
            Создать аккаунт
          </button>
          
          <button 
            onClick={onLater} 
            className="w-full max-w-md mx-auto block py-4 bg-transparent border-2 border-gray-400 text-gray-600 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all"
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveProgressPrompt;