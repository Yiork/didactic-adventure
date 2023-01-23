import { z } from "zod";

export const stripeCheckoutSessionSchema = z.object({
  amount: z.number(),
});
