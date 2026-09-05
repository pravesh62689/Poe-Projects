import { handleRegexWorkerRequest, WorkerEnv } from './worker.js';

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleRegexWorkerRequest(request, env);
  },
};
