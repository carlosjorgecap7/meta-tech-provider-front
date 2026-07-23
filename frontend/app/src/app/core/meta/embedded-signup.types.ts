/** Payload que llega via window.postMessage desde el iframe de Meta Embedded Signup. */

export interface EmbeddedSignupFinishData {
  event: 'WA_EMBEDDED_SIGNUP';
  data: {
    phone_number_id: string;
    waba_id: string;
  };
  type: 'FINISH';
  version: number;
}

export interface EmbeddedSignupCancelData {
  event: 'WA_EMBEDDED_SIGNUP';
  data: {
    current_step: string;
  };
  type: 'CANCEL';
  version: number;
}

export type EmbeddedSignupMessageData =
  | EmbeddedSignupFinishData
  | EmbeddedSignupCancelData;

export function isEmbeddedSignupMessage(
  data: unknown,
): data is EmbeddedSignupMessageData {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>)['event'] === 'WA_EMBEDDED_SIGNUP'
  );
}

export function isFinishMessage(
  data: EmbeddedSignupMessageData,
): data is EmbeddedSignupFinishData {
  return data.type === 'FINISH';
}
