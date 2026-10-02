/** @jest-environment node */
import { calculateHiringCosts } from '@/lib/hiring-costs';
import { ROLES } from '@/data/roles';

const example = {
  auBaseSalary: 6250, phBaseSalary: 1700, auSuper: 750,
  auLeave: 540, auSick: 288, auRecruitment: 1125,
  phRecruitment: 332.5, tools: 350, auOffice: 500,
  auHR: 150, auWorkersComp: 94,
};

test('first-year totals include each expense once and the exact placement fee', () => {
  expect(calculateHiringCosts(example)).toEqual({
    auTotal: 10047, phTotal: 2382.5, monthlySaving: 7664.5,
    annualSaving: 91974, savingPercent: 76,
  });
});

test.each(Object.keys(ROLES))('%s headlines agree with the displayed cost model', slug => {
  const role = ROLES[slug];
  const estimate = calculateHiringCosts(role.costs);
  expect(role.stats.saving).toBe(`${estimate.savingPercent}%`);
  expect(role.stats.savedPerYear).toBe(`AU$${Math.round(estimate.annualSaving).toLocaleString('en-AU')}`);
  expect(role.costs.auSuper).toBe(Math.round(role.costs.auBaseSalary * 0.12));
  expect(role.costs.phRecruitment * 12).toBe(3990);
});

test('a more expensive offshore scenario retains a negative saving', () => {
  const result = calculateHiringCosts({ ...example, phBaseSalary: 20000 });
  expect(result.annualSaving).toBeLessThan(0);
  expect(result.savingPercent).toBeLessThan(0);
});
