import { describe, it, expect } from 'vitest';
import { buildSettingsResponse } from '../src/settings.js';

describe('buildSettingsResponse', () => {
  it('builds default settings response with version 1.0.0 and false flags', () => {
    const settings = buildSettingsResponse();
    expect(settings).toEqual({
      version: '1.0.0',
      allow_attachments: false,
      expand_text_attachments: false,
      enable_image_comprehension: false,
      enforce_author_role: false,
      enable_multi_bot: false,
    });
  });

  it('correctly sets options when provided', () => {
    const settings = buildSettingsResponse({
      allowAttachments: true,
      enableImageComprehension: false,
      introductionMessage: 'Welcome to OCR Doc Bot!',
      serverBotDependencies: {
        'Claude-3.5-Sonnet': 1,
      },
    });

    expect(settings.allow_attachments).toBe(true);
    expect(settings.enable_image_comprehension).toBe(false);
    expect(settings.introduction_message).toBe('Welcome to OCR Doc Bot!');
    expect(settings.server_bot_dependencies).toEqual({
      'Claude-3.5-Sonnet': 1,
    });
  });
});
