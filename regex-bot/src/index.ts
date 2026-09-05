import { handleRegexWorkerRequest, WorkerEnv } from './worker.js';

export interface RegexEnv extends WorkerEnv {
  KEEPWARM_URL?: string;
}

export default {
  async fetch(request: Request, env: RegexEnv): Promise<Response> {
    return handleRegexWorkerRequest(request, env);
  },

  async scheduled(
    _controller: ScheduledController,
    env: RegexEnv,
    ctx: ExecutionContext,
  ): Promise<void> {
    if (env.KEEPWARM_URL) {
      ctx.waitUntil(fetch(env.KEEPWARM_URL).catch(() => {}));
    }
  },
};
