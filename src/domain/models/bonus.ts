export type BonusType = 'coupon' | 'highlight';

export type Bonus = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  type: BonusType;
  percent?: number;
};

export type BonusStatus = 'ACTIVE' | 'USED' | 'EXPIRED';
export type BonusMeasure = 'percent' | 'priority';

export type AccountBonus = {
  id: string;
  accountId: string;
  businessId?:string;
  bonusId: string;
  quantity: number;
  status: BonusStatus;
  measure: BonusMeasure;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
};
