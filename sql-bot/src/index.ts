import { handleSqlWorkerRequest, WorkerEnv } from './worker.js';

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleSqlWorkerRequest(request, env);
  },
};
