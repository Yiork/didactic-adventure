import React from "react";
import { trpc } from "../utils/trpcNext";
import getStripe from "../utils/getStripe";

const Pricing = () => {
  const { mutate, isLoading } = trpc.checkout_session.useMutation();

  const checkout = async () => {
    await mutate(
      { amount: 1200 },
      {
        onSuccess: async (data) => {
          const stripe = await getStripe();
          console.log(data, "data");
          const { error } = await stripe!.redirectToCheckout({
            sessionId: data.id,
          });

          console.warn(error.message);
        },
      }
    );
  };

  return (
    <div>
      <button onClick={checkout}>
        {isLoading ? "...Loading" : "Standard"}
      </button>
    </div>
  );
};

export default Pricing;
