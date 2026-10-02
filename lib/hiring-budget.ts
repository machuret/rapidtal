export interface BudgetInputs {
  pay: number;
  tools: number;
  otherMonthly: number;
  recruitment: number;
  equipment: number;
  otherOneOff: number;
}
export const EMPTY_BUDGET: BudgetInputs = { pay: 0, tools: 0, otherMonthly: 0, recruitment: 0, equipment: 0, otherOneOff: 0 };
export function calculateBudget(inputs: BudgetInputs) {
  if (Object.values(inputs).some(value => !Number.isFinite(value) || value < 0 || value > 100000000)) {
    throw new RangeError('Enter amounts between 0 and 100,000,000.');
  }
  const monthly = inputs.pay + inputs.tools + inputs.otherMonthly;
  const oneOff = inputs.recruitment + inputs.equipment + inputs.otherOneOff;
  return { monthly, oneOff, firstYear: monthly * 12 + oneOff, recurringYear: monthly * 12 };
}
