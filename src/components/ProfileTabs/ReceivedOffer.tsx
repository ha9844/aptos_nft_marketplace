import { useEffect, useState } from "react";
import { Types } from "aptos";
import { API_ENDPOINT, CDN_URL } from "../../utils/constants";
import { I_Offer } from "../../types/Offer";
import axios from "axios";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../../utils/constants";
import toast, { Toaster } from "react-hot-toast";
import { fetchOffers } from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import aptos from '@/img/aptos.svg';

const ReceivedOffer = () => {
  const router = useRouter();
  const address = router.query.address as string;
  const [offerData, setOfferData] = useState<I_Offer[][]>();
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    const fetcOffers = async () => {
      const _offer = await axios.get(
        `${API_ENDPOINT}/offer/item/received/${address}`
      );
      const offer_ = await Promise.all(
        _offer.data.map(async (itemArray: I_Offer[], i: number) => {
          if (itemArray.length < 1) return;
          let result = await Promise.all(
            itemArray?.map(async (item: I_Offer, i: number) => {
              const res = await axios.put(
                `${API_ENDPOINT}/market/collection/nft`,
                {
                  property_version: item?.property_version,
                  name: item?.name,
                  slug: item?.slug,
                }
              );
              if (res.data.image_uri?.length > 0) {
                return {
                  ...item,
                  image_uri: res.data.image_uri,
                }
                  
              } else {
                try {
                  const response = await fetch(res.data.token_uri);
                  const json = await response.json();
                  return {
                    ...item,
                    image_uri: json.image,
                  };
                } catch (error) {
                  console.log(error);
                }
              }
            })
          );
          return result.sort((a: any, b: any) => b.price - a.price);
        })
      );
      //uncommend the collection offer after live site
      /*const _collectionoffer = await axios.get(
        `${API_ENDPOINT}/offer/collection/received/${address}`
      );
      const collectionoffer_ = await Promise.all(
        _collectionoffer.data.map(async (itemArray: I_Offer[], i: number) => {
          if (itemArray.length < 1) return;
          let result = await Promise.all(
            itemArray?.map(async (item: I_Offer, i: number) => {
              const res = await axios.put(
                `${API_ENDPOINT}/market/collection/nft`,
                {
                  property_version: item?.property_version,
                  name: item?.name,
                  slug: item?.slug,
                }
              );
              if (res.data.image_uri?.length > 0) {
                return {
                  ...item,
                  imageUrl: res.data.image_uri,
                };
              } else {
                try {
                  const response = await fetch(res.data.token_uri);
                  const json = await response.json();
                  return {
                    ...item,
                    imageUrl: json.image,
                  };
                } catch (error) {
                  console.log(error);
                }
              }
            })
          );
          return result.sort((a: any, b: any) => b.price - a.price);
        })
      );*/

      let offerData_: any[] = [];
      offer_?.map((item, i) => {
        offerData_.push(
          [
            ...(offer_[i] ?? [undefined]),
            // ...(collectionoffer_[i] ?? [undefined]),
          ]
            .filter((item) => {
              return (
                item?.duration * 1000 > Date.now() && item?.offer !== address
              );
            })
            .sort((a: any, b: any) => b?.price - a?.price)
        );
      });
      setOfferData(offerData_.filter((item) => item.length > 0));
    };
    fetcOffers();
  }, [address]);

  const acceptOffer = async (_item: I_Offer) => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::accept_offer`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        _item.creator,
        _item.collection,
        _item.name,
        `${_item.property_version}`,
        _item.offer,
        _item.price,
      ],
    };
    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      try {
        await axios.put(
          `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
          {
            type: "REQUEST_ACCEPT",
            tokenId: {
              property_version: _item?.property_version,
              collection: _item?.collection,
              creator: _item?.creator,
              name: _item?.name,
            },
          }
        );
      } catch (error) {
        console.log("error1", error);
      }
      const _res = await axios.put(`${API_ENDPOINT}/market/nft`, {
        property_version: _item?.property_version,
        name: _item?.name,
        slug: _item.slug,
      });

      let offers = await fetchOffers(_res.data);
      setOfferData(offers);
      toast.success("Successful Transaction!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  /*
  const collectionAcceptOffer = async (_item: I_Offer) => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::sell_token_for_collection_offer`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        _item?.creator,
        _item?.collection,
        [_item?.name],
        [_item?.property_version],
        _item.offer,
        _item.price,
      ],
    };
    try {
      await signAndSubmitTransaction(payload, {
        gas_unit_price: 100,
      });
      await axios.put(
        `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
        {
          type: "REQUEST_COLLECTION_ACCEPT",
          tokenId: {
            property_version: _item?.property_version,
            token_data_id: {
              collection: _item?.collection,
              creator: _item?.creator,
              name: _item?.name,
            },
          },
        }
      );
      const _res = await axios.put(`${API_ENDPOINT}/market/nft`, {
        property_version: _item?.property_version,
        name: _item?.name,
        slug: _item.slug,
      });
      const _offer = await axios.get(
        `${API_ENDPOINT}/offer/item/received/${address}`
      );
      const offer_ = await Promise.all(
        _offer.data.map(async (itemArray: I_Offer[], i: number) => {
          if (itemArray.length < 1) return;
          let result = await Promise.all(
            itemArray?.map(async (item: I_Offer, i: number) => {
              const res = await axios.put(
                `${API_ENDPOINT}/market/collection/nft`,
                {
                  property_version: item?.property_version,
                  name: item?.name,
                  slug: item?.slug,
                }
              );
              if (res.data.image_uri?.length > 0) {
                return {
                  ...item,
                  image_uri: res.data.image_uri,
                };
              } else {
                try {
                  const response = await fetch(res.data.token_uri);
                  const json = await response.json();
                  return {
                    ...item,
                    image_uri: json.image,
                  };
                } catch (error) {
                  console.log(error);
                }
              }
            })
          );
          return result.sort((a: any, b: any) => b.price - a.price);
        })
      );
      const _collectionoffer = await axios.get(
        `${API_ENDPOINT}/offer/collection/received/${address}`
      );
      const collectionoffer_ = await Promise.all(
        _collectionoffer.data.map(async (itemArray: I_Offer[], i: number) => {
          if (itemArray.length < 1) return;
          let result = await Promise.all(
            itemArray?.map(async (item: I_Offer, i: number) => {
              const res = await axios.put(
                `${API_ENDPOINT}/market/collection/nft`,
                {
                  property_version: item?.property_version,
                  name: item?.name,
                  slug: item?.slug,
                }
              );
              if (res.data.image_uri?.length > 0) {
                return {
                  ...item,
                  _urigeUrl: res.data.image_uri,
                  key: res.data.key,
                };
              } else {
                try {
                  const response = await fetch(res.data.token_uri);
                  const json = await response.json();
                  return {
                    ...item,
                    image_uri: json.image,
                    key: res.data.key,
                  };
                } catch (error) {
                  console.log(error);
                }
              }
            })
          );
          return result.sort((a: any, b: any) => b.price - a.price);
        })
      );
      let offerData_: any[] = [];
      offer_?.map((item, i) => {
        offerData_.push(
          [
            ...(offer_[i] ?? [undefined]),
            ...(collectionoffer_[i] ?? [undefined]),
          ]
            .filter((item) => item?.duration * 1000 > Date.now())
            .sort((a: any, b: any) => b?.price - a?.price)
        );
      });
      setOfferData(offerData_.filter((item) => item.length > 0));
      toast.success("Successful Transaction!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  */
  return (
    <div className=" h-screen">
      {offerData !== undefined && offerData?.length > 0 ? (
        <div className="dark:text-gray-200">
          <div className="grid grid-cols-4 text-lg">
            <div>Item</div>
            <div>Price</div>
            <div>offer</div>
            <div>Action</div>
          </div>
          {offerData?.map((item: I_Offer[], i: number) => (
            <div key={i} className="py-0.5 grid grid-cols-4 pt-2">
              <Link
                href={
                  item[0].isforitem
                    ? `/asset/${encodeURIComponent(
                        `${item[0].collection?.replace(
                          /[^A-Z0-9]+/gi,
                          "-"
                        )}`
                      )}/${encodeURIComponent(
                        item[0].name
                      )}/${item[0].property_version}`
                    : `/collection/${encodeURIComponent(
                        `${item[0].collection?.replace(
                          /[^A-Z0-9]+/gi,
                          "-"
                        )}`
                      )}/listed`
                }
                key={i}
                className="hover:text-blue-500 flex items-center gap-2"
              >
                <Image
                  src={item[0].image_uri.includes("ipfs://")
                    ? item[0].image_uri.replace("ipfs://", "https://ipfs.io/ipfs/")
                    : item[0].image_uri}
                  alt="thumbnail"
                  width={50} // Set your desired width
                  height={50} // Set your desired height
                />
                <div>
                  {item[0].isforitem
                    ? item[0].name
                    : item[0].collection}
                </div>
              </Link>
              <div className="flex justify-center items-center gap-2 text-[1rem] my-2">
                <div>{item[0].price / 100000000}</div>
                <div>
                <Image
                  src={aptos}
                  layout="responsive"
                  width={14}
                  height={15}
                  alt="aptos coin"
                />
                </div>
              </div>
              <Link href={`/profile/${item[0].offer}/collected`}>
                {item[0].offer?.substring(61)}
              </Link>
              {/* Please uncomment this after live site */}
              <div className="flex items-center">
                {address === account?.address?.toString() && (
                  <>
                    <button
                      className="px-4 py-1  bg-[#63C3A7] text-gray-200  text-xl font-semibold hover:bg-[#40a789] rounded-full flex items-center justify-center"
                      // onClick={() =>
                      //   item[0].isforitem
                      //     ? acceptOffer(item[0])
                      //     : collectionAcceptOffer(item[0])
                      // }
                      onClick={() =>
                        item[0].isforitem&&
                           acceptOffer(item[0])
                      }
                    >
                      Accept
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xl font-semibold dark:text-gray-200">
          No Received Offers
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ReceivedOffer;
