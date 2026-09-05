/**
 * Poe Protocol Specification Types
 * Reference: https://creator.poe.com/docs/poe-protocol-specification
 */

export type Role = 'system' | 'user' | 'bot';

export interface Attachment {
  url: string;
  content_type: string;
  name: string;
  parsed_content?: string;
}

export interface ProtocolMessage {
  role: Role;
  content: string;
  content_type?: 'text/markdown' | 'text/plain';
  timestamp?: number;
  message_id?: string;
  feedback?: unknown[];
  attachments?: Attachment[];
}

export type ServerBotDependencies = Record<string, number>;

export interface SettingsResponse {
  version?: string;
  allow_attachments?: boolean;
  expand_text_attachments?: boolean;
  enable_image_comprehension?: boolean;
  enforce_author_role?: boolean;
  enable_multi_bot?: boolean;
  introduction_message?: string;
  server_bot_dependencies?: ServerBotDependencies;
}

export interface QueryRequest {
  version: string;
  type: 'query';
  query: ProtocolMessage[];
  user_id: string;
  conversation_id: string;
  message_id: string;
  metadata?: Record<string, unknown>;
  api_key?: string;
  access_key?: string;
  temperature?: number;
  skip_system_prompt?: boolean;
  logit_bias?: Record<string, number>;
  stop_sequences?: string[];
}

export interface SettingsRequest {
  version: string;
  type: 'settings';
}

export interface ReportFeedbackRequest {
  version: string;
  type: 'report_feedback';
  message_id: string;
  user_id: string;
  conversation_id: string;
  feedback_type: 'like' | 'dislike';
}

export interface ReportErrorRequest {
  version: string;
  type: 'report_error';
  message: string;
  metadata?: Record<string, unknown>;
}

export type PoeRequest =
  | QueryRequest
  | SettingsRequest
  | ReportFeedbackRequest
  | ReportErrorRequest;

export type EventType =
  | 'text'
  | 'replace_response'
  | 'suggested_reply'
  | 'error'
  | 'meta'
  | 'done';

export interface TextEventPayload {
  text: string;
}

export interface ReplaceResponseEventPayload {
  text: string;
}

export interface SuggestedReplyEventPayload {
  text: string;
}

export interface ErrorEventPayload {
  text: string;
  allow_retry?: boolean;
  error_type?: string;
}

export interface MetaEventPayload {
  content_type?: 'text/markdown' | 'text/plain';
  linkify?: boolean;
  suggested_replies?: boolean;
}

export interface DoneEventPayload {
  [key: string]: never;
}
