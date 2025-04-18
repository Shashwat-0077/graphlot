import { envClient } from "./clientEnv";
import { envServer } from "./serverEnv";

export const env = {
    ...envClient,
    ...envServer,
};
