import { z } from "zod";

export enum DeoldifyModel {
  Stable = "Stable",
  Artistic = "Artistic",
}

export const deoldifySchema = z.object({
  base64Image: z.string().nullish(),
  model_name: z.nativeEnum(DeoldifyModel),
});
