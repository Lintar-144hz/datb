export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target: number;
  current: number;
  deadline?: string | null;
  created_at: string;
}

export interface GoalFormData {
  title: string;
  target: number;
  current?: number;
  deadline?: string | null;
}

export interface GoalDepositData {
  amount: number;
  action: 'deposit' | 'withdraw';
  note?: string;
}
