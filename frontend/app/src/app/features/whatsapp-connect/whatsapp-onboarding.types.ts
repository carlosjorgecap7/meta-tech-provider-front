/** Payload enviado al backend tras capturar el código de Embedded Signup. */
export interface ExchangeRequestDto {
  code: string;
  wabaId: string;
  phoneNumberId: string;
  tenantId: string;
}

/** Respuesta del backend tras el token exchange. */
export interface ExchangeResponseDto {
  wabaId: string;
  phoneNumberId: string;
  status: 'PENDING' | 'ACTIVE' | 'ERROR';
}
