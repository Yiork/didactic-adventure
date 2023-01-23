import React from "react";
import { trpc } from "../utils/trpcNext";
import useUpload from "../hooks/useUpload";
import { DeoldifyModel } from "../schemas/replicate.schema";
import Image from "next/image";

const Index = () => {
  const { mutate, data, isLoading } = trpc.deoldify.useMutation();
  const { uploadBox, preview } = useUpload();

  const compute = async () => {
    await mutate({ base64Image: preview, model_name: DeoldifyModel.Stable });
  };

  return (
    <div className="h-screen">
      {uploadBox()}
      <button onClick={compute}>Submit</button>

      {isLoading && <div>...loading</div>}

      {data && (
        <div>
          {data?.output && (
            <div className="w-full relative aspect-video">
              <Image fill src={data.output} alt="output" sizes="100vw" />
            </div>
          )}
          <p>status: {data.status}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
