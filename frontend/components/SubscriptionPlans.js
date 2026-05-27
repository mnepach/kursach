function SubscriptionPlans({ onClose, currentPlan, onUpgrade }) {
  const [plans, setPlans] = React.useState([]);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);
  const [pricing, setPricing] = React.useState(null);

  React.useEffect(() => {
    loadPlansAndPricing();

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadPlansAndPricing = async () => {
    try {
      const [plansResponse, pricingData] = await Promise.all([
        api.getPlans(),
        window.getCachedPricing ? window.getCachedPricing() : Promise.resolve(null)
      ]);

      let updatedPlans = plansResponse.plans;

      if (pricingData) {
        updatedPlans = updatedPlans.map(plan => {
          if (plan.id === 'basic' && pricingData.prices.basic) {
            return { ...plan, price: pricingData.prices.basic.amount, currency: pricingData.currency.code, currencySymbol: pricingData.currency.symbol };
          }
          if (plan.id === 'premium' && pricingData.prices.premium) {
            return { ...plan, price: pricingData.prices.premium.amount, currency: pricingData.currency.code, currencySymbol: pricingData.currency.symbol };
          }
          return plan;
        });
        setPricing(pricingData);
      }

      setPlans(updatedPlans);
      setError('');
    } catch (error) {
      console.error('Ошибка загрузки планов:', error);
      setError('Не удалось загрузить планы подписки');
    } finally {
      setLoading(false);
    }
  };

  const getPlanPrice = (plan) => {
    const price = typeof plan.price === 'object' ? plan.price.amount : plan.price;
    if (price === 0) return 0;
    return price;
  };

  const getPlanSymbol = (plan) => {
    if (plan.currencySymbol) return plan.currencySymbol;
    if (pricing) return pricing.currency.symbol;
    return '₽';
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'free') {
      setShowCancelConfirm(true);
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError('');
    try {
      await api.cancelSubscription();
      setShowCancelConfirm(false);
      onUpgrade();
    } catch (error) {
      setError('Не удалось отменить подписку');
    } finally {
      setLoading(false);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[10000]" style={{
        backgroundImage: 'url(./trickle/assets/profile_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[10001] p-4" style={{ overflow: 'auto' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(./trickle/assets/profile_background.png)', backgroundSize: 'cover', backgroundPosition: 'center', transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`, transition: 'transform 0.1s ease-out', zIndex: -1 }}></div>
        <BubbleAnimation />
        <div className="bg-white rounded-3xl max-w-md w-full p-8 my-4" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Отменить подписку?</h2>
          <p className="text-[var(--text-light)] mb-6">Вы уверены, что хотите отменить подписку и перейти на бесплатный план? Вы потеряете доступ к премиум-функциям.</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
          <div className="flex gap-3">
            <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-bold text-[var(--text-dark)] hover:bg-gray-50 transition-colors" disabled={loading}>Отмена</button>
            <button onClick={handleCancelSubscription} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors" disabled={loading}>{loading ? 'Отмена...' : 'Подтвердить'}</button>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment && selectedPlan) {
    return (
      <PaymentModal
        plan={selectedPlan}
        pricing={pricing}
        onClose={() => { setShowPayment(false); setSelectedPlan(null); }}
        onSuccess={() => { setShowPayment(false); setSelectedPlan(null); onUpgrade(); }}
        mousePos={mousePos}
        scrollY={scrollY}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(./trickle/assets/profile_background.png)', backgroundSize: 'cover', backgroundPosition: 'center', transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`, transition: 'transform 0.1s ease-out', zIndex: -1 }}></div>
      <BubbleAnimation />
      <div className="bg-white rounded-3xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-dark)]">Выберите план</h2>
            {pricing && pricing.country !== 'EU' && (
              <p className="text-sm text-[var(--text-light)] mt-1">
                Цены указаны в {pricing.currency.name}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>}

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan;
            const planPrice = getPlanPrice(plan);
            const symbol = getPlanSymbol(plan);

            return (
              <div key={index} className={`card relative ${plan.id === 'premium' ? 'ring-4 ring-[var(--primary-color)]' : ''}`}>
                {plan.id === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-sm font-bold">Популярный</div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">{plan.name}</h3>
                  <p className="text-[var(--text-light)] mb-4">{plan.description}</p>
                  <div className="mb-4">
                    {planPrice === 0 ? (
                      <div className="text-4xl font-bold text-[var(--text-dark)]">Бесплатно</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-[var(--text-dark)]">{planPrice} {symbol}</div>
                        <div className="text-sm text-[var(--text-light)]">в месяц</div>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="text-[var(--text-dark)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${isCurrentPlan ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : plan.id === 'premium' ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' : plan.id === 'free' && currentPlan !== 'free' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--secondary-color)]'}`}
                >
                  {isCurrentPlan ? 'Текущий план' : plan.id === 'free' && currentPlan !== 'free' ? 'Отменить подписку' : plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ plan, pricing, onClose, onSuccess, mousePos, scrollY }) {
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

  const getPlanPrice = () => {
    const price = typeof plan.price === 'object' ? plan.price.amount : plan.price;
    return price;
  };

  const getPlanSymbol = () => {
    if (plan.currencySymbol) return plan.currencySymbol;
    if (pricing) return pricing.currency.symbol;
    return '₽';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) parts.push(v.substring(i, i + 4));
    return parts.join(' ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) { setError('Заполните все поля карты'); setLoading(false); return; }
      if (cardNumber.replace(/\s/g, '').length !== 16) { setError('Неверный номер карты'); setLoading(false); return; }
      if (cardCvc.length !== 3) { setError('Неверный CVC код'); setLoading(false); return; }
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

  const planPrice = getPlanPrice();
  const symbol = getPlanSymbol();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10001] p-8" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(./trickle/assets/profile_background.png)', backgroundSize: 'cover', backgroundPosition: 'center', transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`, transition: 'transform 0.1s ease-out', zIndex: -1 }}></div>
      <BubbleAnimation />
      <div className="bg-white rounded-3xl w-full max-w-4xl p-8 grid grid-cols-2 gap-8" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '85vh' }}>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-dark)]">Оформление подписки</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="mb-6 p-4 bg-[var(--secondary-color)] rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[var(--text-dark)] text-lg">{plan.name}</span>
              <span className="text-3xl font-bold text-[var(--primary-color)]">{planPrice} {symbol}</span>
            </div>
            <p className="text-sm text-[var(--text-light)]">Ежемесячная подписка</p>
          </div>
          <h3 className="font-bold text-[var(--text-dark)] mb-4">Способ оплаты</h3>
          <div className="space-y-3 flex-1">
            {paymentMethods.map((method) => (
              <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${paymentMethod === method.id ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium text-[var(--text-dark)]">{method.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col border-l pl-8">
          <h3 className="font-bold text-[var(--text-dark)] mb-6 text-xl">Данные для оплаты</h3>
          {paymentMethod === 'card' ? (
            <form onSubmit={handlePayment} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Номер карты</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Срок действия</label>
                  <input type="text" value={cardExpiry} onChange={(e) => { const f = formatExpiry(e.target.value); if (f.length <= 5) setCardExpiry(f); }} placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                  <input type="text" value={cardCvc} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/gi, ''); if (v.length <= 3) setCardCvc(v); }} placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имя на карте</label>
                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="IVAN IVANOV" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required />
              </div>
              <div className="flex-1"></div>
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Обработка...' : `Оплатить ${planPrice} ${symbol}`}</button>
              <p className="text-xs text-[var(--text-light)] text-center">Нажимая "Оплатить", вы соглашаетесь с условиями использования</p>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">{paymentMethods.find(m => m.id === paymentMethod)?.icon}</div>
              <p className="text-lg text-[var(--text-light)] mb-8 text-center">Вы будете перенаправлены на страницу оплаты</p>
              <Button title={`Перейти к оплате ${planPrice}`} onPress={handlePayment} disabled={loading || redirecting} loading={loading || redirecting} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BubbleAnimation() {
  return (
    <>
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) translateX(0) scale(1); opacity: 0.7; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(var(--float-x)) scale(1.2); opacity: 0; }
        }
        .bubble {
          position: fixed; bottom: -100px; width: var(--size); height: var(--size);
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(96,165,250,0.4));
          border-radius: 50%; pointer-events: none; z-index: 9999;
          animation: float-up var(--duration) ease-in-out infinite; animation-delay: var(--delay);
          box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 0 20px rgba(96,165,250,0.3);
        }
        .bubble::before { content:''; position:absolute; top:10%; left:15%; width:40%; height:40%; background:radial-gradient(circle,rgba(255,255,255,0.9),transparent); border-radius:50%; }
        .bubble::after { content:''; position:absolute; bottom:15%; right:20%; width:20%; height:20%; background:radial-gradient(circle,rgba(255,255,255,0.6),transparent); border-radius:50%; }
      `}</style>
      {[...Array(15)].map((_, i) => (
        <div key={i} className="bubble" style={{ '--size': `${Math.random() * 60 + 40}px`, '--duration': `${Math.random() * 5 + 8}s`, '--delay': `${Math.random() * 5}s`, '--float-x': `${(Math.random() - 0.5) * 200}px`, left: `${Math.random() * 100}%` }} />
      ))}
    </>
  );
}