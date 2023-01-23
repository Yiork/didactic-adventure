import { procedure, router } from "../trpc";
import Stripe from "stripe";
import { stripeCheckoutSessionSchema } from "../../schemas/stripe.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const stripeRouter = router({
  checkout_session: procedure
    .input(stripeCheckoutSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { amount } = input;

      return await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "USD",
              unit_amount: amount,
              product_data: { name: "Standard" },
              recurring: { interval: "month" },
            },
          },
        ],
        success_url: `http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/result?session_id={CHECKOUT_SESSION_ID}`,
      });
    }),
});
