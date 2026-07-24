export interface ConversationDto {
  wabaId: string;
  from: string;
  lastMessage: string;
  lastMessageAt: string;
  direction: 'IN' | 'OUT';
}

export interface MessageDto {
  messageId: string;
  direction: 'IN' | 'OUT';
  content: string;
  status: string;
  createdAt: string;
  from: string;
}

export interface SendReplyRequest {
  text: string;
}

export interface SendReplyResponse {
  status: 'sent';
  messageId: string;
}
