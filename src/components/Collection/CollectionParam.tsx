import { useState, useEffect } from "react";
import { I_Offer, Offer } from "../../types/Offer";
import { I_Collection } from "../../types/Offer";

import {
  API_ENDPOINT,
  CDN_URL,
  DEFAULT_IMG,
  ERROR_IMG,
} from "../../utils/constants";
import axios from "axios";
import { dedicatedGateway } from "@/utils/utils";
import { IData } from "@/types/Collection";
import Image from "next/image";

type AppProps = {
  // collectionParam: IData<Offer>;
  collectionItem: I_Collection;
};

const CollectionParam = ({ collectionItem }: AppProps) => {
  // const [logoUrl, setLogoUrl] = useState<string>("")
  // useEffect(() => {
  //   const conformLogoUrl = async () => {
  //       await fetch(collectionItem.logo_url, { method: 'HEAD' }) // Use HEAD method to retrieve only headers
  //         .then(async response => {
  //           const contentType = response.headers.get('content-type');
            
  //           if (contentType && contentType.startsWith('image')) {
  //             console.log('The URL is likely an image URL:', collectionItem.logo_url);
  //             setLogoUrl(collectionItem.logo_url);
  //           } else {
  //             // If it's not an image URL, you may want to fetch metadata and extract the image URL.
  //             // Example: Fetch metadata and extract image URL from it
  //             await fetch(collectionItem.logo_url)
  //               .then(response => response.json())
  //               .then(metadata => {
  //                 console.log("image uri->", metadata.image)
  //             setLogoUrl(metadata.image);

  //               })
  //               .catch(error => console.error('Error fetching metadata:', error));
  //           }
  //         })
  //         .catch(error => console.error('Error fetching headers:', error));
  //   }
  //   conformLogoUrl();
  // }, [collectionItem])
  
  const [offerData, setOfferData] = useState<I_Offer[]>([
    {
      property_version: "",
      token_data_id_collection: "",
      token_data_id_creator: "",
      token_data_id_name: "",
      collection: "",
      creator: "",
      name: "",
      price: 0,
      owner: "",
      offer_id: 0,
      offerer: "",
      offer: "",
      imageUrl: "",
      image_uri: "",
      duration: 0,
      timestamp: 0,
      amount: 0,
      leftAmount: 0,
      metadata: [
        {
          trait_type: "",
          value: "",
        },
      ],
      isforitem: false,
      slug: "",
    },
  ]);

  useEffect(() => {
    const fetchNft = async () => {
      const _collectionOffer = await axios.put(
        `${API_ENDPOINT}/offer/collection/fetch`,
        {
          property_version: "",
          token_data_id_collection: collectionItem?.collection,
          token_data_id_creator: collectionItem?.creator,
          token_data_id_name: "",
        }
      );
      setOfferData(_collectionOffer.data);
    };
    fetchNft();
  }, [collectionItem]);

  return (
    <>
      <div className="flex gap-6 w-full justify-between flex-col mt-[50px]">
        <div className="flex md:hidden justify-end"></div>
        <div className="flex gap-4 items-center flex-col">
          <Image
            src={
              collectionItem?.logo_url ? collectionItem?.logo_url : DEFAULT_IMG
            }
            alt="logo_uri"
            width={100}
            height={100}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = ERROR_IMG;
            }}
            className="rounded-[50%] w-[100px] h-[100px]"
            priority={true}
          />

          <div className="w-full">
            <div className="flex items-center justify-between py-3">
              <div className="flex justify-center gap-2 items-center w-full">
                <div className="text-[30px] font-normal">
                  {collectionItem?.collection}
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-2 text-center text-sm px-24">{collectionItem.description}</div>
          </div>
        </div>
        <div className="w-full overflow-auto md:overflow-hidden">
          <div className="flex justify-center py-4 flex  text-[18px] w-full">
            <div className="grid grid-cols-7 gap-4 sm:gap-14 md:gap-6 lg:gap-10 xl:gap-[4.5rem] 2xl:gap-28 text-center justify-center">
              <div className="text-center rounded-xl">
                <div className="font-bold">
                  {(collectionItem.volume).toFixed(2)} APT
                </div>
                <div className="text-[16px]">24h Volume</div>
              </div>
              <div className="text-center rounded-xl">
                <div className="font-bold">
                  {(isNaN(collectionItem.royalty)
                    ? 0
                    : collectionItem.royalty
                  ).toFixed(2)}
                  %{" "}
                </div>
                <div className="text-[16px]">Royalties</div>
              </div>
              <div className="text-center rounded-xl">
                <div className="font-bold">{collectionItem.items_total}</div>
                <div className="text-[16px]">items</div>
              </div>
              <div className="text-center rounded-xl">
                <div className="font-bold">{collectionItem.owners_total}</div>
                <div className="text-[16px]">Holders</div>
              </div>
              <div className="text-center rounded-xl flex justify-center items-center">
                {/* <div className="font-bold">{collectionItem.sales_24h}</div> */}
                {/* <div className="text-[16px]">24h Sales</div> */}
                <div className="text-[16px]">
                {collectionItem.twitter ? (
                  <a href={collectionItem.twitter} target="_blank" rel="noopener noreferrer">
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.0459896 0L7.34306 9.7567L0 17.6894H1.65276L8.08174 10.744L13.276 17.6894H18.9L11.1922 7.38397L18.0272 0H16.3744L10.4538 6.39631L5.67 0H0.0459896ZM2.47644 1.21729H5.06009L16.4692 16.4721H13.8856L2.47644 1.21729Z" fill="#E5E7EB"/>
                    </svg>
                  </a>
                ) : (
                  <span></span>
                )}
                </div>
              </div>
              <div className="text-center rounded-xl flex justify-center items-center">
                <div className="text-center rounded-xl flex justify-center items-center">
                {collectionItem.discord ? (
                  <a href={collectionItem.discord} target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.2477 3.17085C14.0825 2.6257 12.8367 2.2295 11.5342 2.00391C11.3742 2.29311 11.1873 2.68211 11.0585 2.99155C9.67387 2.78332 8.30201 2.78332 6.94287 2.99155C6.81404 2.68211 6.62292 2.29311 6.46152 2.00391C5.15761 2.2295 3.91032 2.62716 2.74514 3.17374C0.394982 6.72515 -0.242108 10.1883 0.0764375 13.6024C1.63519 14.7664 3.14581 15.4735 4.63093 15.9362C4.99762 15.4316 5.32465 14.8951 5.60638 14.3297C5.06981 14.1258 4.5559 13.8742 4.07031 13.5821C4.19913 13.4867 4.32514 13.3869 4.44689 13.2842C7.40865 14.6695 10.6267 14.6695 13.5531 13.2842C13.6762 13.3869 13.8022 13.4867 13.9296 13.5821C13.4426 13.8756 12.9273 14.1273 12.3907 14.3312C12.6724 14.8951 12.9981 15.433 13.3662 15.9377C14.8527 15.4749 16.3647 14.7678 17.9235 13.6024C18.2973 9.64464 17.285 6.21325 15.2477 3.17085ZM6.00988 11.5028C5.12079 11.5028 4.39166 10.6727 4.39166 9.66199C4.39166 8.65123 5.10522 7.81977 6.00988 7.81977C6.91457 7.81977 7.64367 8.64977 7.6281 9.66199C7.62951 10.6727 6.91457 11.5028 6.00988 11.5028ZM11.9901 11.5028C11.101 11.5028 10.3718 10.6727 10.3718 9.66199C10.3718 8.65123 11.0854 7.81977 11.9901 7.81977C12.8947 7.81977 13.6238 8.64977 13.6083 9.66199C13.6083 10.6727 12.8947 11.5028 11.9901 11.5028Z" fill="#E5E7EB"/>
                    </svg>
                  </a>
                ) : (
                  <span></span>
                )}
                </div>
              </div>
              <div className="text-center rounded-xl flex justify-center items-center">
                <div className="text-center">
                {collectionItem.website ? (
                  <a href={collectionItem.website} target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_250_137)">
                    <path d="M9 0C4.02943 0 0 4.02943 0 9C0 13.9706 4.02943 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02943 13.9706 0 9 0ZM14.705 5.13281H13.0643C12.8757 4.34134 12.6311 3.61361 12.3406 2.97021C12.8956 3.27874 13.4111 3.6662 13.8724 4.12759C14.1842 4.43943 14.4621 4.77612 14.705 5.13281ZM15.8906 9C15.8906 9.60145 15.8136 10.191 15.6651 10.7578H13.4139C13.4702 10.1893 13.5 9.60163 13.5 9C13.5 8.39837 13.4702 7.81073 13.4139 7.24219H15.6651C15.8136 7.80901 15.8906 8.39855 15.8906 9ZM9 15.8906C8.81719 15.8906 8.26003 15.5313 7.7047 14.4206C7.47468 13.9605 7.27727 13.4365 7.11577 12.8672H10.8842C10.7227 13.4364 10.5253 13.9605 10.2953 14.4206C9.73997 15.5313 9.18281 15.8906 9 15.8906ZM6.70827 10.7578C6.64334 10.1866 6.60938 9.59664 6.60938 9C6.60938 8.40336 6.64334 7.81337 6.70827 7.24219H11.2917C11.3567 7.81337 11.3906 8.40336 11.3906 9C11.3906 9.59664 11.3567 10.1866 11.2917 10.7578H6.70827ZM2.10938 9C2.10938 8.39855 2.1864 7.80901 2.33487 7.24219H4.58606C4.52978 7.81073 4.5 8.39837 4.5 9C4.5 9.60163 4.52978 10.1893 4.58606 10.7578H2.33487C2.1864 10.191 2.10938 9.60145 2.10938 9ZM9 2.10938C9.18281 2.10938 9.73997 2.46871 10.2953 3.57936C10.5253 4.03945 10.7227 4.56353 10.8842 5.13281H7.11577C7.27727 4.56356 7.47464 4.03945 7.7047 3.57936C8.26003 2.46871 8.81719 2.10938 9 2.10938ZM5.65942 2.97021C5.36889 3.61361 5.12427 4.3413 4.93566 5.13281H3.29502C3.53791 4.77612 3.81575 4.43943 4.12759 4.12759C4.58898 3.6662 5.10444 3.27874 5.65942 2.97021ZM3.29502 12.8672H4.93566C5.12427 13.6587 5.36892 14.3864 5.65942 15.0298C5.10444 14.7213 4.58895 14.3338 4.12759 13.8724C3.81575 13.5606 3.53788 13.2239 3.29502 12.8672ZM12.3406 15.0298C12.6311 14.3864 12.8757 13.6587 13.0643 12.8672H14.705C14.4621 13.2239 14.1842 13.5606 13.8724 13.8724C13.411 14.3338 12.8956 14.7213 12.3406 15.0298Z" fill="#E5E7EB"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_250_137">
                        <rect width="18" height="18" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  </a>
                ) : (
                  <span></span>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionParam;
