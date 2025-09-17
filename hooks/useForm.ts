'use client';

import { useCallback, useState } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  isValid: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
    }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const setTouched = useCallback((field: keyof T, touched: boolean) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return {};
    return validate(state.values);
  }, [validate, state.values]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setState((prev) => ({ ...prev, isSubmitting: true }));

      // Marcar todos os campos como touched
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      Object.keys(state.values).forEach((key) => {
        allTouched[key as keyof T] = true;
      });

      // Validar formulário
      const errors = validateForm();

      setState((prev) => ({
        ...prev,
        errors,
        touched: allTouched,
      }));

      // Se há erros, não submeter
      if (Object.keys(errors).length > 0) {
        setState((prev) => ({ ...prev, isSubmitting: false }));
        return;
      }

      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error('Erro no submit:', error);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.values, validateForm, onSubmit],
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  const errors = validateForm();
  const isValid = Object.keys(errors).length === 0;

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    setValue,
    setError,
    setTouched,
    handleSubmit,
    reset,
    isValid,
  };
}
