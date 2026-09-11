import type { Expense, Profile } from "@/lib/supabase/types";

export type PersonBalance = {
  profile: Profile;
  paid: number;
  share: number;
  balance: number; // positivo: os outros devem para essa pessoa. negativo: essa pessoa deve.
};

export type Settlement = {
  from: Profile;
  to: Profile;
  amount: number;
};

export function calculateBalances(profiles: Profile[], expenses: Expense[]): PersonBalance[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const share = profiles.length > 0 ? total / profiles.length : 0;

  return profiles.map((profile) => {
    const paid = expenses
      .filter((e) => e.paid_by === profile.id)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      profile,
      paid,
      share,
      balance: round2(paid - share),
    };
  });
}

// Algoritmo guloso simples: quem deve mais paga primeiro para quem tem mais a receber.
export function calculateSettlements(balances: PersonBalance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.balance > 0.005)
    .map((b) => ({ profile: b.profile, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((b) => b.balance < -0.005)
    .map((b) => ({ profile: b.profile, amount: -b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = round2(Math.min(debtor.amount, creditor.amount));

    if (amount > 0.005) {
      settlements.push({ from: debtor.profile, to: creditor.profile, amount });
    }

    debtor.amount = round2(debtor.amount - amount);
    creditor.amount = round2(creditor.amount - amount);

    if (debtor.amount <= 0.005) i++;
    if (creditor.amount <= 0.005) j++;
  }

  return settlements;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
