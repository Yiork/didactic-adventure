import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import prisma from "../utils/prisma";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession(opts);

  return {
    session,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
