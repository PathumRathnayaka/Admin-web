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
  marketplaceEnabled: boolean;
  buyRequestsEnabled: boolean;
  orderGrnEnabled: boolean;
  deliveryStatusEnabled: boolean;
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

export type ShopFeatureKey =
  | 'marketplaceEnabled'
  | 'buyRequestsEnabled'
  | 'orderGrnEnabled'
  | 'deliveryStatusEnabled';

export type ShopFeaturesUpdate = Partial<Record<ShopFeatureKey, boolean>>;
