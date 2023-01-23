import { procedure, router } from "../trpc";
import { NextApiRequest } from "next";
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
        success_url: `${ctx.req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      });
    }),
  webhook_handler: procedure.mutation(async ({ ctx }) => {
    const event: Stripe.Event = ctx.req;

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }),
});
