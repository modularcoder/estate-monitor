import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/example/example";
import { statRouter } from "@/server/api/stat/stat"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  stat: statRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
