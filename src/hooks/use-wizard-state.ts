'use client'

import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export interface WizardState {
  hasCompletedWizard: boolean
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  completeWizard: () => void
  resetWizard: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

/**
 * Hook to manage wizard step state and localStorage persistence.
 *
 * The wizard appears on first visit and guides users through initial setup.
 * Completion state is persisted to localStorage so it only shows once.
 *
 * @returns WizardState with step navigation and completion handlers
 */
export function useWizardState(): WizardState {
  const [hasCompletedWizard, setHasCompletedWizard] = useLocalStorageState(
    'aff-wizard-completed',
    {
      defaultValue: false,
    }
  )
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep((s) => Math.min(s + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  const completeWizard = () => {
    setHasCompletedWizard(true)
  }

  const resetWizard = () => {
    setHasCompletedWizard(false)
    setCurrentStep(1)
  }

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === 3

  return {
    hasCompletedWizard,
    currentStep,
    nextStep,
    prevStep,
    completeWizard,
    resetWizard,
    isFirstStep,
    isLastStep,
  }
}
