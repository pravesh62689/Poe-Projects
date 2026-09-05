export interface WorkerEnv {
    POE_ACCESS_KEY?: string;
}
export declare function handleRegexWorkerRequest(request: Request, env?: WorkerEnv, customUpstreamQuery?: (instruction: string) => Promise<{
    pattern: string;
    flags: string;
    explanation: string;
}>): Promise<Response>;
