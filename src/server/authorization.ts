import { TRPCError } from "@trpc/server";
import { t } from "./trpc";

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx?.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have permission to access this resource",
    });
  }

  return next({
    ctx: {
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
