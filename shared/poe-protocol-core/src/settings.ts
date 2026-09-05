import { SettingsResponse } from './types.js';

export interface BotSettingsOptions {
  allowAttachments?: boolean;
  expandTextAttachments?: boolean;
  enableImageComprehension?: boolean;
  enforceAuthorRole?: boolean;
  enableMultiBot?: boolean;
  introductionMessage?: string;
  serverBotDependencies?: Record<string, number>;
}

/**
 * Creates a compliant SettingsResponse payload for the Poe Protocol.
 */
export function buildSettingsResponse(options: BotSettingsOptions = {}): SettingsResponse {
  const response: SettingsResponse = {
    version: '1.0.0',
    allow_attachments: options.allowAttachments ?? false,
    expand_text_attachments: options.expandTextAttachments ?? false,
    enable_image_comprehension: options.enableImageComprehension ?? false,
    enforce_author_role: options.enforceAuthorRole ?? false,
    enable_multi_bot: options.enableMultiBot ?? false,
  };

  if (options.introductionMessage !== undefined) {
    response.introduction_message = options.introductionMessage;
  }

  if (options.serverBotDependencies !== undefined) {
    response.server_bot_dependencies = options.serverBotDependencies;
  }

  return response;
}
