/** Illustrative first-year estimates, not observed customer savings. */
export interface HiringCosts {
  auBaseSalary: number;
  phBaseSalary: number;
  auSuper: number;
  auLeave: number;
  auSick: number;
  auRecruitment: number;
  phRecruitment: number;
  tools: number;
  auOffice: number;
  auHR: number;
  auWorkersComp: number;
}

export function calculateHiringCosts(costs: HiringCosts) {
  const auTotal = costs.auBaseSalary + costs.auSuper + costs.auLeave +
    costs.auSick + costs.auRecruitment + costs.tools + costs.auOffice +
    costs.auHR + costs.auWorkersComp;
  const phTotal = costs.phBaseSalary + costs.phRecruitment + costs.tools;
  const monthlySaving = auTotal - phTotal;
  return {
    auTotal,
    phTotal,
    monthlySaving,
    annualSaving: monthlySaving * 12,
    savingPercent: auTotal > 0 ? Math.round(monthlySaving / auTotal * 100) : 0,
  };
}
