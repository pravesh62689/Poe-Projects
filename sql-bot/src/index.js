import { handleSqlWorkerRequest } from './worker.js';
export default {
    async fetch(request, env) {
        return handleSqlWorkerRequest(request, env);
    },
};
//# sourceMappingURL=index.js.map