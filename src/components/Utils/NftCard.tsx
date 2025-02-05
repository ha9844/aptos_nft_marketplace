import { useEffect, useState } from "react";
import Image from "next/image";
import aptos from '@/img/aptos.svg';
import { convertURL, dedicatedGateway } from "@/utils/utils";
import { CDN_URL, DEFAULT_IMG, ERROR_IMG } from "@/utils/constants";
type CardProps = { key: string; data: any };

const NftCard = ({ data: token }: CardProps) => {
  const [imageUri, setImageUri] = useState<string>("");
  useEffect(() => {
 

    const temp_img_uri = token?.image_uri !== null ?token?.image_uri
      .replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
        .replace(
          "https://green-elegant-opossum-682.mypinata.cloud/ipfs/",
          "https://cloudflare-ipfs.com/ipfs/"
        )
        .replace(
          "https://ipfs.io/ipfs/",
          "https://cloudflare-ipfs.com/ipfs/"
        ) : "";
    setImageUri(temp_img_uri);
  }, [token]);
  return (
    <div className="rounded-xl card-box relative group w-full">
      {imageUri.includes(".mp4") ?
        <video
        width =  {100}
        height =  {100}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-[50%] w-[120px] h-[120px]"
        >
          <source src={imageUri} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        :
        <Image
          src={
            imageUri!==""
              ? imageUri
              : DEFAULT_IMG
          }
          alt="preview_uri"
          width={357}
          height={357}
          sizes="80vw"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = ERROR_IMG;
          }}
          className="rounded-t-xl primary-nft"
          loading="lazy"
          />
        }
      
      
      <div className="p-4 flex flex-col">
        <div className="font-normal text-[16px]">
          {token?.name}
        </div>
        {token.price === 0 ? (
          token.latest_trade_price > 0 ? (
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <span>Last Sale </span>
                <span className="font-bold text-[16px]">
                  {token.latest_trade_price} 
                </span>
                <Image
                  src={aptos}
                  width={14}
                  height={15}
                  alt="aptos coin"
                />
              </div>
            </div>
          ) : (
            <div className="font-bold text-[16px]">Unlisted</div>
          )
        ) : (
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-[16px]">
                Listed {token.price/100000000} 
              </span>
              <Image
                  src={aptos}
                  width={14}
                  height={15}
                  alt="aptos coin"
                  priority={true}
                />
            </div>
          </div>
        )}
        {/* {token.latest_trade_price === 0 ? (
          <div className="font-bold text-[16px]">Last Trade Price</div>
        ) : (
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div>
                <span className="font-bold text-[16px]">
                  {token?.latest_trade_price} APT
                </span>
              </div>
            </div>
          </div>
        )} */}
        {token?.topoffer?<div>Top Offer: {token?.topoffer} APT</div>:<div></div>}
        
      </div>
      <div className="hidden w-full group-hover:block rounded-b-xl"></div>
    </div>
  );
};
export default NftCard;
