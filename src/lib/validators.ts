export function validateHabitName(name: string): {

  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmedValue = name.trim();

  if (!trimmedValue) {
    return {
      valid: false,
      value: '',
      error: 'Habit name is required',
    };
  }

  if (trimmedValue.length > 60) {
    return {
      valid: false,
      value: trimmedValue,
      error: 'Habit name must be 60 characters or fewer',
    };
  }

  return {
    valid: true,
    value: trimmedValue,
    error: null,
  };
};