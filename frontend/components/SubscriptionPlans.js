function SubscriptionPlans({ onClose, currentPlan, onUpgrade }) {
  const [plans, setPlans] = React.useState([]);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.getPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Ошибка загрузки планов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free' || plan.id === currentPlan) {
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[10000]" style={{
        backgroundImage: 'url(./trickle/assets/profile_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (showPayment && selectedPlan) {
    return (
      <PaymentModal 
        plan={selectedPlan}
        onClose={() => {
          setShowPayment(false);
          setSelectedPlan(null);
        }}
        onSuccess={() => {
          setShowPayment(false);
          setSelectedPlan(null);
          onUpgrade();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4" style={{
      backgroundImage: 'url(./trickle/assets/profile_background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }} onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-dark)]">Выберите план</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isFree = plan.id === 'free';
            
            return (
              <div
                key={index}
                className={`card relative ${plan.id === 'premium' ? 'ring-4 ring-[var(--primary-color)]' : ''}`}
              >
                {plan.id === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-sm font-bold">
                    Популярный
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">{plan.name}</h3>
                  <p className="text-[var(--text-light)] mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-[var(--text-dark)]">Бесплатно</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-[var(--text-dark)]">
                          {plan.price} ₽
                        </div>
                        <div className="text-sm text-[var(--text-light)]">в месяц</div>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-[var(--text-dark)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isFree || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isFree
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.id === 'premium'
                      ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]'
                      : 'bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--secondary-color)]'
                  }`}
                >
                  {isCurrentPlan ? 'Текущий план' : isFree ? 'Базовый план' : 'Выбрать план'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ plan, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');
  const [cardName, setCardName] = React.useState('');

  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'apple_pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'google_pay', name: 'Google Pay', icon: '🔵' }
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setCardExpiry(formatted);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCardCvc(value);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        setError('Заполните все поля карты');
        setLoading(false);
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Неверный номер карты');
        setLoading(false);
        return;
      }

      if (cardCvc.length !== 3) {
        setError('Неверный CVC код');
        setLoading(false);
        return;
      }
    }

    try {
      await api.upgradeSubscription(plan.id, paymentMethod);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Ошибка при оплате');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10001] p-4" style={{
      backgroundImage: 'url(./trickle/assets/profile_background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }} onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">Оплата подписки</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-[var(--secondary-color)] rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[var(--text-dark)]">{plan.name}</span>
            <span className="text-2xl font-bold text-[var(--primary-color)]">{plan.price} ₽</span>
          </div>
          <p className="text-sm text-[var(--text-light)]">Ежемесячная подписка</p>
        </div>

        <h3 className="font-bold text-[var(--text-dark)] mb-4">Выберите способ оплаты</h3>

        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                paymentMethod === method.id
                  ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="font-medium text-[var(--text-dark)]">{method.name}</span>
            </button>
          ))}
        </div>

        {paymentMethod === 'card' && (
          <form onSubmit={handlePayment} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Номер карты</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Срок действия</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={handleCvcChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Имя на карте</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="IVAN IVANOV"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
            </div>
          </form>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Обработка...' : `Оплатить ${plan.price} ₽`}
        </button>

        <p className="text-xs text-[var(--text-light)] text-center mt-4">
          Нажимая "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности
        </p>
      </div>
    </div>
  );
} 