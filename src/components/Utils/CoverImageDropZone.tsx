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
        <div className="w-full h-72 relative rounded-lg overflow-hidden">
          {isLoad && (
            <div className="absolute top-1/2 left-1/2 -translate-x-[10px] -translate-y-[10px]">
              <span className="loader mr-2" />
            </div>
          )}
          <Image
            className="w-full h-72 rouned-lg object-cover"
            src={cachedUrl ?cachedUrl:""}
            width = {100}
            height = {72}
            alt="template"
            onLoad={() => {
              if (cachedUrl) URL.revokeObjectURL(cachedUrl);
            }}
          />
        </div>
      ) : (
        <>
          {imageUri ? (
            <div className="h-72">
                <Image
                  layout="responsive"
                  width = {100}
                  height = {72}
                  src={`${CDN_REMOTE_URL}${dedicatedGateway(imageUri ?? "")}`}
                  alt="imageUri"
                />
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-[#292524] h-72 text-3xl flex items-center justify-center p-8">
              <BsImage />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageDropZone;
