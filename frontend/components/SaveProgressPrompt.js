function SaveProgressPrompt({ onRegister, onLater }) {
  const [showPlanSelection, setShowPlanSelection] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('free');
  const [pricing, setPricing] = React.useState(null);
  const [pricingLoaded, setPricingLoaded] = React.useState(false);

  const basePlans = [
    { id: 'free', name: 'Бесплатный', basePrice: 0, features: ['1 язык', 'Базовые уроки', 'Достижения'] },
    { id: 'basic', name: 'Базовый', basePrice: 499, features: ['До 3 языков', 'Без рекламы', 'Оффлайн режим'] },
    { id: 'premium', name: 'Премиум', basePrice: 899, features: ['Все языки', 'Персонализация', 'Сертификаты'] }
  ];

  React.useEffect(() => {
    if (showPlanSelection && !pricingLoaded) {
      if (window.getCachedPricing) {
        window.getCachedPricing().then(data => {
          setPricing(data);
          setPricingLoaded(true);
        }).catch(() => setPricingLoaded(true));
      } else {
        setPricingLoaded(true);
      }
    }
  }, [showPlanSelection]);

  const getPlanPrice = (plan) => {
    if (plan.id === 'free') return 'Бесплатно';
    if (pricing) {
      const key = plan.id;
      if (pricing.prices[key]) {
        return `${pricing.prices[key].amount} ${pricing.currency.symbol}/мес`;
      }
    }
    return `${plan.basePrice} ₽/мес`;
  };

  const handleRegister = () => setShowPlanSelection(true);

  const handlePlanSelected = () => onRegister(selectedPlan);

  if (showPlanSelection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between p-8" style={{ backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex-1"></div>
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-[var(--text-dark)] text-center mb-4">Выберите свой план</h1>
          <p className="text-xl text-[var(--text-light)] text-center mb-8">Вы можете изменить план в любое время</p>
          {!pricingLoaded && (
            <p className="text-center text-[var(--text-light)] mb-4 text-sm">Определяем актуальные цены...</p>
          )}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {basePlans.map((plan) => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`card text-center transition-all ${selectedPlan === plan.id ? 'ring-4 ring-[var(--primary-color)]' : ''}`}>
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold text-[var(--primary-color)] mb-4">{getPlanPrice(plan)}</div>
                <ul className="space-y-2 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="text-[var(--text-dark)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-4xl border-t border-gray-200 pt-6">
          <button onClick={handlePlanSelected} className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all">
            Продолжить с планом "{basePlans.find(p => p.id === selectedPlan)?.name}"
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8" style={{ backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex-1"></div>
      <div className="max-w-2xl w-full text-center">
        <img src="./trickle/assets/kitty.png" alt="Kitty" className="w-48 h-48 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-4">Пора создать аккаунт!</h1>
        <p className="text-xl text-[var(--text-light)] mb-8">Создайте аккаунт, чтобы сохранить<br />прогресс и продолжить заниматься<br />бесплатно.</p>
      </div>
      <div className="w-full max-w-2xl border-t border-gray-200 pt-6">
        <div className="space-y-4 max-w-md mx-auto">
          <button onClick={handleRegister} className="w-full py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all">Создать аккаунт</button>
          <button onClick={onLater} className="w-full py-4 bg-transparent border-2 border-gray-400 text-gray-600 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all">Позже</button>
        </div>
      </div>
    </div>
  );
}

export default SaveProgressPrompt;