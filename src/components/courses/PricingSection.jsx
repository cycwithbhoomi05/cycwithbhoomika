import { useState } from 'react';
import { formatPrice } from '../../utils/helpers';
import Button from '../ui/Button';
import { HiCheck } from 'react-icons/hi';

const PricingSection = ({ course, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState('full');

  const plans = [
    {
      id: 'full',
      label: 'Full Payment',
      price: course.price,
      description: 'One-time payment for complete access',
      features: ['Full course access', 'Certificate on completion', 'Lifetime access', 'All resources included'],
      recommended: true,
    },
  ];

  if (course.installmentEnabled && course.installmentPlan) {
    plans.push({
      id: 'installment',
      label: 'Installment Plan',
      price: course.installmentPlan.installmentAmount,
      priceLabel: `${formatPrice(course.installmentPlan.installmentAmount)}/month × ${course.installmentPlan.totalInstallments}`,
      description: `Pay in ${course.installmentPlan.totalInstallments} easy installments`,
      features: ['Full course access', 'Certificate on completion', 'Flexible payments', 'No interest'],
    });
  }

  if (course.advanceAmount && course.advanceAmount > 0) {
    plans.push({
      id: 'advance',
      label: 'Book with Advance',
      price: course.advanceAmount,
      description: 'Reserve your spot with advance payment',
      features: ['Seat reservation', 'Pay rest later', 'Priority enrollment', 'Early access'],
    });
  }

  const handleSelect = () => {
    onSelectPlan(selectedPlan);
  };

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => setSelectedPlan(plan.id)}
          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
            selectedPlan === plan.id
              ? 'border-primary-500 bg-primary-50/50 shadow-lg'
              : 'border-dark-100 hover:border-primary-200'
          }`}
        >
          {plan.recommended && (
            <span className="absolute -top-3 left-4 px-3 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded-full">
              Recommended
            </span>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-heading font-bold text-dark-800">{plan.label}</h4>
              <p className="text-dark-500 text-sm mt-1">{plan.description}</p>
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-bold text-dark-800">{formatPrice(plan.price)}</p>
              {plan.priceLabel && <p className="text-xs text-dark-400">{plan.priceLabel}</p>}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-dark-600">
                <HiCheck className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {/* Radio Indicator */}
          <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedPlan === plan.id ? 'border-primary-600 bg-primary-600' : 'border-dark-300'
          }`}>
            {selectedPlan === plan.id && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>
      ))}

      <Button onClick={handleSelect} variant="gold" size="lg" className="w-full mt-4">
        Enroll Now — {formatPrice(plans.find(p => p.id === selectedPlan)?.price || course.price)}
      </Button>
    </div>
  );
};

export default PricingSection;
