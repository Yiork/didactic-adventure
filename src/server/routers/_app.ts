import { mergeRouters } from "../trpc";
import { replicateRouter } from "./replicate";
import { stripeRouter } from "./stripe";

export const appRouter = mergeRouters(replicateRouter, stripeRouter);

export type AppRouter = typeof appRouter;
