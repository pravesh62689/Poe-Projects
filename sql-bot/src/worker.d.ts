export interface WorkerEnv {
    POE_ACCESS_KEY?: string;
}
export declare function checkDestructiveSql(sql: string): {
    isDestructive: boolean;
    warning?: string;
};
export type CustomSqlGenerator = (schema: string, ask: string, failedSql?: string, errorFeedback?: string) => Promise<string>;
export declare function handleSqlWorkerRequest(request: Request, env?: WorkerEnv, customGenerator?: CustomSqlGenerator): Promise<Response>;
