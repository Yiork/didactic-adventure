import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const UseUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(image);
    } else {
      setPreview("");
    }
  }, [image]);

  const uploadBox = (props?: { defaultValue?: string }) => (
    <div className="flex items-center space-x-6">
      <div>
        {preview || props?.defaultValue ? (
          <Image
            src={`${preview ? preview : props?.defaultValue}`}
            alt="thumbnail"
            className="rounded cursor-pointer"
            width={180}
            height={160}
            quality={95}
            style={{ width: "auto" }}
            priority
            onClick={(event) => {
              event.preventDefault();
              fileInputRef?.current?.click();
            }}
          />
        ) : (
          <div
            style={{ width: 160, height: 140 }}
            className="rounded-lg cursor-pointer border flex justify-center items-center"
            onClick={(event) => {
              event.preventDefault();
              fileInputRef?.current?.click();
            }}
          >
            Cover
          </div>
        )}

        <input
          ref={fileInputRef}
          className="input-form hidden"
          placeholder="your avatar"
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event?.target?.files?.[0];
            if (file && file.type.substr(0, 5) === "image") {
              setImage(file);
            } else {
              setImage(null);
            }
          }}
        />
      </div>
    </div>
  );

  return { uploadBox, preview };
};

export default UseUpload;
