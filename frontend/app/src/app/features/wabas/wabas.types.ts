export type WabaStatus = 'PENDING' | 'ACTIVE' | 'ERROR';

export interface WabaDto {
  wabaId: string;
  tenantId: string;
  displayName: string;
  phoneNumberId: string;
  phoneNumber: string;
  status: WabaStatus;
  connectedAt: string;
}
