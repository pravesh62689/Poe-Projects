import { handleRegexWorkerRequest } from './worker.js';
export default {
    async fetch(request, env) {
        return handleRegexWorkerRequest(request, env);
    },
};
//# sourceMappingURL=index.js.map