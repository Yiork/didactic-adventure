import { router, procedure } from "../trpc";
import axios, { AxiosRequestConfig } from "axios";
import { deoldifySchema } from "../../schemas/replicate.schema";
import { getFileUrl } from "../../utils/getFileUrl";

const config: AxiosRequestConfig = {
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const replicateRouter = router({
  deoldify: procedure.input(deoldifySchema).mutation(async ({ ctx, input }) => {
    const { base64Image, model_name } = input;
    let prediction: any;

    if (base64Image) {
      const input_image = await getFileUrl(
        base64Image,
        "replicate-deoldify-image"
      );

      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        {
          version:
            // https://replicate.com/arielreplicate/deoldify_image/api
            "376c74a2c9eb442a2ff9391b84dc5b949cd4e80b4dc0565115be0a19b7df0ae6",
          input: { input_image, model_name },
        },
        config
      );

      if (response.status !== 201) {
        return { err: response?.data?.detail };
      }

      prediction = response.data;

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const result = await axios.get(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          config
        );

        if (result.status !== 200) {
          return { err: result?.data?.detail };
        }

        prediction = result?.data;
      }

      return prediction;
    } else {
      return { err: "Missing base64 image file" };
    }
  }),
});
