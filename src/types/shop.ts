export type ShopStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface ShopSummary {
  tenantId: string;
  tenantCode: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  city: string | null;
  district: string | null;
  status: ShopStatus;
  ownerActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface ShopDetail extends ShopSummary {
  contactEmail: string | null;
  address: string | null;
  ownerUserId: string;
  ownerVerified: boolean;
  updatedAt: string;
}
