import { useEffect, useState } from "react";
import { Types } from "aptos";
import { API_ENDPOINT, CDN_URL } from "../../utils/constants";
import { I_Offer } from "../../types/Offer";
import axios from "axios";
import { dateDifFromNow, fetchOffers } from "../../utils/utils";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../../utils/constants";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { off } from "process";

const ActiveOffer = () => {
  const router = useRouter();
  
  const address = router.query.address as string;
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
  const { account, signAndSubmitTransaction } = useWallet();
  useEffect(() => {
    const fetcOffers = async () => {
      const _offer = await axios.get(`${API_ENDPOINT}/offer/${address}`);
      let offer_ = [];
      if (Array.isArray(_offer.data)) {
        offer_ = await Promise.all(
          _offer.data.map(async (item: any, i: number) => {
            const res = await axios.put(`${API_ENDPOINT}/market/nft`, {
              property_version: item?.property_version,
              name: item?.name,
              slug: item?.slug,
            });
            if (res.data[0].image_uri?.length > 0) {
              return {
                ...item,
                imageUrl: res.data[0].image_uri,
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
      }

      const _collectionoffer = await axios.get(
        `${API_ENDPOINT}/offer/collection/${address}`
      );

      let collectionoffer_ = [];
      if (Array.isArray(_collectionoffer.data)) {
        collectionoffer_ = await Promise.all(
          _collectionoffer.data.map(async (item: any, i: number) => {
            const res = await axios.put(`${API_ENDPOINT}/market/collection/nft`, {
              property_version: item?.property_version,
              name: item?.name,
              slug: item?.slug,
            });
            if (res.data[0].image_uri?.length > 0) {
              return {
                ...item,
                imageUrl: res.data[0].image_uri,
              };
            } else {
              const response = await fetch(res.data[0].token_uri);
              const json = await response.json();
              return {
                ...item,
                imageUrl: json.image,
              };
            }
          })
        );
      }
      setOfferData([...offer_, ...collectionoffer_]);
    };
    fetcOffers();
  }, [address]);

  const cancelOffer = async (_item: I_Offer) => {
    if (!offerData) return;
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::cancel_offer`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        _item.owner,
        _item.creator,
        _item.collection,
        _item.name,
        `${_item.property_version}`,
        _item.price,
      ],
    };

    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      const res = await axios.put(
        `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
        {
          type: "REQUEST_CANCEL",
          tokenId: {
            property_version: _item.property_version,
            collection: _item.collection,
            creator: _item.creator,
            name: _item.name,
          },
        }
      );
      let offers = await fetchOffers(res.data);
      setOfferData(offers);
      toast.success("Successful Transaction!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const collectionCancelOffer = async (_item: I_Offer) => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::cancel_collection_offer`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        _item?.token_data_id_creator,
        _item?.token_data_id_collection,
        _item.price,
      ],
    };

    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      const res = await axios.put(
        `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
        {
          type: "REQUEST_COLLECTION_CANCEL",
          tokenId: {
            property_version: _item?.property_version,
            token_data_id: {
              collection: _item?.token_data_id_collection,
              creator: _item?.token_data_id_creator,
              name: "",
            },
          },
        }
      );
      try {
        const _offer = await axios.get(`${API_ENDPOINT}/offer/${address}`);
        const offer_ = await Promise.all(
          _offer.data.map(async (item: any, i: number) => {
            const res = await axios.put(`${API_ENDPOINT}/market/nft`, {
              property_version: item?.key?.property_version,
              name: item?.key?.token_data_id.name,
              slug: item?.slug,
            });
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
        const _collectionoffer = await axios.get(
          `${API_ENDPOINT}/offer/collection/${address}`
        );
        const collectionoffer_ = await Promise.all(
          _collectionoffer.data.map(async (item: any, i: number) => {
            const res = await axios.put(
              `${API_ENDPOINT}/market/collection/nft`,
              {
                property_version: item?.key?.property_version,
                name: item?.key?.token_data_id.name,
                slug: item?.slug,
              }
            );
            if (res.data.image_uri?.length > 0) {
              return {
                ...item,
                imageUrl: res.data.image_uri,
              };
            } else {
              const response = await fetch(res.data.token_uri);
              const json = await response.json();
              return {
                ...item,
                imageUrl: json.image,
              };
            }
          })
        );
        setOfferData([...offer_, ...collectionoffer_]);
      } catch (error) {
        console.log(error);
      }
      toast.success("Successful Transaction!");
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  };

  return (
    <div className="h-screen">
      {offerData?.filter((item) => item?.duration * 1000 > Date.now())[0]
        ?.offer?.length > 0 ? (
        <div className="dark:text-gray-200">
          <div className="grid grid-cols-4 text-lg">
            <div className="col-span-1">Item</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Expires in</div>
            <div className="col-span-1">Action</div>
          </div>
          {offerData
            ?.filter((item) => item?.duration * 1000 > Date.now())
            .map((item: I_Offer, i: number) => (
              <div key={i} className="py-0.5 grid grid-cols-4 pt-2">
                <div className="col-span-1">
                  <Link
                    href={
                      item.isforitem
                        ? `/asset/${encodeURIComponent(
                            `${item.collection?.replace(/[^A-Z0-9]+/gi, "-")}`
                          )}/${encodeURIComponent(item.name)}/${
                            item.property_version
                          }`
                        : `/collection/${encodeURIComponent(
                            `${item.collection?.replace(/[^A-Z0-9]+/gi, "-")}`
                          )}/listed`
                    }
                    key={i}
                    className="hover:text-blue-500 flex items-center gap-2 "
                  >
                    <Image
                      src={item.imageUrl}
                      alt="thumbnail"
                      width =  {50}
                      height =  {50}
                    />
                    <div>
                      {item.isforitem ? item.name : item.collection}
                    </div>
                  </Link>
                </div>
                <div className="text-[1rem] my-2 col-span-1">
                  <div>{item.price / 100000000} APT</div>
                </div>
                
                <div className="flex gap-4 items-center col-span-1 col-span-1">
                  {dateDifFromNow(new Date(item?.duration * 1000)).includes(
                    "ago"
                  ) ? (
                    <div>Expired</div>
                  ) : (
                    <div className="flex gap-2 items-center text-[1rem] related">
                      <div>
                          {dateDifFromNow(new Date(item?.duration * 1000))}
                        </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center col-span-1">
                    {item.offer === account?.address?.toString() && (
                      <button
                        className="px-4 py-1  bg-[#63C3A7] text-white text-base font-semibold hover:bg-[#40a789] rounded-full flex items-center justify-center"
                        // onClick={() =>
                        //   item.isforitem
                        //     ? cancelOffer(item)
                        //     : collectionCancelOffer(item)
                      // }
                      onClick={() =>cancelOffer(item)
                      }
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            ))}
        </div>
    ) : (
      <div className="text-xl font-semibold dark:text-white">
        No Active Offers
      </div>
    )}
    <Toaster position="top-center" reverseOrder={false} />
  </div>
  );
};

export default ActiveOffer;
