'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWizardState } from '@/hooks/use-wizard-state'
import { WizardStep1 } from './wizard-step-1'
import { WizardStep2 } from './wizard-step-2'
import { WizardStep3 } from './wizard-step-3'

/**
 * First-visit wizard modal that guides users through initial calculator setup.
 *
 * The wizard has 3 steps with educational content explaining why each input matters.
 * Users cannot dismiss the modal without completing it — they must go through all steps.
 * Completion state is persisted to localStorage so the wizard only shows once.
 */
export function WizardModal() {
  const {
    hasCompletedWizard,
    currentStep,
    nextStep,
    prevStep,
    completeWizard,
    isFirstStep,
    isLastStep,
  } = useWizardState()

  // Don't render if wizard already completed
  if (hasCompletedWizard) {
    return null
  }

  return (
    <Dialog open={!hasCompletedWizard}>
      <DialogContent
        className="max-w-2xl [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Rent vs. Buy Calculator</DialogTitle>
          <DialogDescription className="text-base">
            Step {currentStep} of 3
          </DialogDescription>
        </DialogHeader>

        {/* Step content area with scroll for long content (e.g. Step 3 with Learn More expanded) */}
        <div className="min-h-[300px] max-h-[60vh] overflow-y-auto py-4">
          {currentStep === 1 && <WizardStep1 />}
          {currentStep === 2 && <WizardStep2 />}
          {currentStep === 3 && <WizardStep3 />}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="min-w-24"
            >
              Back
            </Button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-colors ${
                  step === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div>
            {!isLastStep && (
              <Button onClick={nextStep} className="min-w-24">
                Next
              </Button>
            )}
            {isLastStep && (
              <Button onClick={completeWizard} className="min-w-40">
                See My Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
