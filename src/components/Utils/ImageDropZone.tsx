import { CDN_REMOTE_URL } from "@/utils/constants";
import { dedicatedGateway } from "@/utils/utils";
import { useRef, useMemo } from "react";
import { BsImage } from "react-icons/bs";
import Image from "next/image";

interface I_ImageDropZone {
  imageObject: File | null;
  setImageObject: React.Dispatch<React.SetStateAction<File | null>>;
  imageUri: string | undefined;
  isLoad: boolean;
  sx?: React.CSSProperties | undefined;
}
const ImageDropZone = ({
  imageObject,
  setImageObject,
  imageUri,
  isLoad,
  sx,
}: I_ImageDropZone) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const inputPreviewFile = useRef(null);

  const cachedUrl = useMemo(() => {
    if (imageObject) {
      return URL.createObjectURL(imageObject);
    }
  }, [imageObject]);

  const onClickAssetUpload = (type: string) => {
    if (type === "nft") {
      if (inputFile.current) {
        inputFile.current.click();
      }
    } else if (type === "preview") {
      if (inputPreviewFile.current) {
        // inputPreviewFile.current.click();
      }
    }
  };

  const onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files.length !== 0) {
      const files = e.dataTransfer.files;
      setImageObject(files[0]);
    }
  };

  const onChangeFile = ({ currentTarget: { files, name } }: any) => {
    if (files && files.length && name === "nftMedia") setImageObject(files[0]);
  };

  return (
    <div
      className="overflow-hidden relative cursor-pointer hover:opacity-70"
      aria-label="Select an image, video, auto or 3D model file"
      onClick={() => onClickAssetUpload("nft")}
      style={sx}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropFile(e)}
    >
      <input
        id="media"
        name="nftMedia"
        accept="image/*,webgl/*,.glb,.gltf"
        type="file"
        autoComplete="off"
        tabIndex={-1}
        style={{ display: "none" }}
        ref={inputFile}
        onChange={onChangeFile}
      />
      {imageObject ? (
        <div className="w-48 h-48 relative rounded-lg overflow-hidden">
          {isLoad && (
            <div className="absolute top-1/2 left-1/2 -translate-x-[10px] -translate-y-[10px]">
              <span className="loader mr-2" />
            </div>
          )}
          <Image
            className="rouned-lg"
            src={cachedUrl?cachedUrl:""}
            width={48}
            height={48}
            alt="template"
            onLoad={() => {
              if (cachedUrl) URL.revokeObjectURL(cachedUrl);
            }}
          />
        </div>
      ) : (
        <>
          {imageUri ? (
            <div className="w-48 h-48 relative rounded-lg overflow-hidden">
              <Image
                src={
                  imageUri.includes("data:image/svg+xml;base64")
                    ? imageUri
                    : ""
                }
                alt="imageUri"
                layout="responsive"
                width={48}
                height={48}
              />
            </div>
          ) : (
            <div className="border border-black dark:border-white text-3xl flex items-center justify-center p-8 w-48 h-48">
              <BsImage />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageDropZone;
