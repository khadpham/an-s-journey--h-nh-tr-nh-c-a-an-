import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { TUTORIALS } from '../config/gameContent';

interface TutorialModalProps {
  gameId: string;
  onComplete?: () => void;
}

export const TutorialModal = ({ gameId, onComplete }: TutorialModalProps) => {
  const { isTutorialNeeded, markTutorialSeen } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = TUTORIALS[gameId] || [];
  const needsTutorial = isTutorialNeeded(gameId);

  useEffect(() => {
    if (needsTutorial && steps.length > 0) {
      setIsOpen(true);
    }
  }, [needsTutorial, steps.length]);

  if (!isOpen || steps.length === 0) return null;

  const handleClose = () => {
    setIsOpen(false);
    markTutorialSeen(gameId);
    onComplete?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-lg shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {currentStep + 1}
            </div>
            <div>
              <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Hướng Dẫn</div>
              <div className="text-white font-bold">{step.title}</div>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-slate-300 leading-relaxed text-sm mb-6">
            {step.content}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_: unknown, i: number) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'bg-indigo-500 w-4'
                    : i < currentStep
                    ? 'bg-indigo-700'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              isFirstStep
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            ← Quay lại
          </button>

          <div className="text-slate-500 text-xs">
            {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            {isLastStep ? 'Bắt đầu!' : 'Tiếp tục →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;