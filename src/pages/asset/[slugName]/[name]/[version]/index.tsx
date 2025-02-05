import Head from "next/head";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Types } from "aptos";
import { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
  API_ENDPOINT,
  CDN_URL,
  ERROR_IMG,
  DEFAULT_IMG,
} from "@/utils/constants";
import { I_Offer, Offer } from "@/types/Offer";
import axios from "axios";
import { ModalContext } from "@/components/Navbar/ModalContext";
import { fetchOffers } from "@/utils/utils";
import ModalBox from "@/components/Utils/ModalBox";
// import { useRouter } from "next/router";
// import { useTheme } from "next-themes";
import Link from "next/link";
// import AssetPlaceholder from "@/components/Placeholder/AssetPlaceholder";
import Image from "next/image";
import dynamic from "next/dynamic";
const AssetPlaceholder = dynamic(() => import("@/components/Placeholder/AssetPlaceholder"), { ssr: false });

export default function Asset({
  metaTag,
  nftData,
  offers,
}: {
  metaTag: {
    slugName: string;
    name: string;
    version: string;
    bestOffer: number;
  };
  nftData: any;
  offers: any;
}) {
  // const router = useRouter();
  const { account, signAndSubmitTransaction } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);
  const [price, setPrice] = useState<string>("0");
  // const { theme } = useTheme();
  const [load, setLoad] = useState<boolean>(false);
  const [modalload, setModalLoad] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isListPrice, setIsListPrice] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
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
  const [nftMetaData, setNFTMetaData] = useState<any[]>();
  const [offer, setOffer] = useState<{
    price: string;
    expired: string;
  }>({ price: "0", expired: "94680000" });
  const [apiLoad, setApiLoad] = useState<boolean>(false);
  const [token, setToken] = useState<Offer>({
    collection: '',
    creator: '',
    name: '',
    asset_id: '',
    property_version: '',
    interact_function: '',
    minter: '',
    owner: '',
    mint_timestamp: 0,
    mint_transaction_hash: '',
    mint_price:0,
    content_type: '',
    content_uri: '',
    token_uri: '',
    metadata: '',
    image_uri: '',
    external_link: '',
    latest_trade_price: 0,
    latest_trade_timestamp: 0,
    latest_trade_transaction_version: 0,
    latest_trade_transaction_hash: '',
    isForSale: 0,
    price: 0,
    offer_id: 0,
    slug: '',
  
    symbol: '',
    description: '',
    website: '',
    email: '',
    twitter: '',
    discord: '',
    telegram: '',
    github: '',
    instagram: '',
    medium : '',
    logo_url: '',
    banner_url: '',
    featured_url: '',
    large_image_url: '',
    attributes: '',
    create_tx_version: 0,
    verified: false,
    items_total: 0,
    owners_total: 0,
    volume: 0,
    listed: 0,
    floor: 0,
    topoffer: 0,
    royalty: 0,
    sales_24h: 0,
    user_name: "",
  });
  useEffect(() => {
    const fetchNft = async () => {
      setApiLoad(true);
      setToken(nftData);
      setOfferData(offers);
      setApiLoad(false);
      setNFTMetaData(nftData.metadata ? JSON.parse(nftData.metadata).attributes : []);
    };
    fetchNft();
  }, [nftData, offers]);

  const onBuyForSale = async () => {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }
    setLoad(true);
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::buy_token`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        token?.creator,
        token?.collection,
        token?.name,
        `${token?.property_version}`,
        `${token?.price!}`,
        `${token?.offer_id}`,
      ],
    };
    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      const res = await axios.put(`${API_ENDPOINT}/market/update`, {
        type: "REQUEST_PURCHASE",
        tokenId: {
          property_version: token?.property_version,
          token_data_id: {
            collection: token?.collection,
            creator: token?.creator,
            name: token?.name,
          },
        },
      });
      if (res.data.image_uri !== "") {
        setToken({ ...res.data, image_uri: res.data.image_uri });
      } else {
        const response = await fetch(res.data.token_uri);
        const json = await response.json();
        setToken({
          ...res.data,
          image_uri: json.image,
        });
      }
      setLoad(false);
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };
  const onCancelForSale = async () => {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }
    setLoad(true);
    const payload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::cancel_sale`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        token?.creator,
        token?.collection,
        token?.name,
        `${token?.property_version}`,
        `${token?.offer_id}`,
      ],
    };

    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      const res = await axios.put(`${API_ENDPOINT}/market/update`, {
        type: "REQUEST_CANCEL",
        tokenId: {
          property_version: token?.property_version,
          collection: token?.collection,
          creator: token?.creator,
          name: token?.name,
        },
      });
      if (res.data.image_uri !== "") {
        setToken({ ...res.data, image_uri: res.data.image_uri });
      } else {
        const response = await fetch(res.data.token_uri);
        const json = await response.json();
        setToken({
          ...res.data,
          image_uri: json.image,
        });
      }
      setLoad(false);
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };
  const onListForSale = async () => {
    if (parseFloat(price) <= 0) return;
    if (
      Math.round(parseFloat(price) * 100000000) <= token.floor
    ) {
      setIsListPrice(true);
      return;
    }
    setLoad(true);
    const payload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::list_token`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        token?.creator,
        token?.collection,
        token?.name,
        token?.property_version,
        Math.round(parseFloat(price) * 100000000),
      ],
    };
    try {
      await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
      const res = await axios.put(`${API_ENDPOINT}/market/update`, {
        type: "REQUEST_LIST",
        tokenId: {
          property_version: token?.property_version,
          collection: token?.collection,
          creator: token?.creator,
          name: token?.name,
        },
      });
      if (res.data.image_uri !== "") {
        setToken({ ...res.data, image_uri: res.data.image_uri });
      } else {
        const response = await fetch(res.data.token_uri);
        const json = await response.json();
        setToken({
          ...res.data,
          image_uri: json.image,
        });
      }
      setLoad(false);
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };
  const makeOffer = async () => {
    setModalShow(true);
  };
  const createOffer = async () => {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }
    if (
      Math.round(parseFloat(offer.price) * 100000000) <=
        offerData?.filter((item) => item.duration * 1000 > Date.now())[0]
          ?.price ||
      !Math.round(parseFloat(offer.price) * 100000000)
    ) {
      setIsError(true);
      return;
    }
    setModalLoad(true);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MARKET_ADDRESS}::marketplace::make_offer`,
      type_arguments: [MARKET_COINT_TYPE],
      arguments: [
        MARKET_ADDRESS,
        MARKET_NAME,
        token?.owner,
        token?.creator,
        token?.collection,
        token?.name,
        `${token?.property_version}`,
        Math.round(parseFloat(offer.price) * 100000000),
        offer.expired,
      ],
    };
    try {

      // uncommend after confirm the back-end api
      await signAndSubmitTransaction(payload);
      await axios.put(`${API_ENDPOINT}/offer/update?timestamp=`, {
        type: "REQUEST_MAKE",
        tokenId: {
          property_version: token?.property_version,
          collection: token?.collection,
          creator: token?.creator,
          name: token?.name,
        },
      });
      let offers = await fetchOffers(token);
      setOfferData(offers);
      toast.success("Successful Transaction!");
      setModalLoad(false);
      setModalShow(false);
    } catch (error: any) {
      console.log(error);
      toast.error(`${error.name}`);
      setModalLoad(false);
      setModalShow(false);
    }
  };
  // const acceptOffer = async (_item: I_Offer) => {
  //   const payload: Types.TransactionPayload = {
  //     type: "entry_function_payload",
  //     function: `${MARKET_ADDRESS}::marketplace::accept_offer`,
  //     type_arguments: [MARKET_COINT_TYPE],
  //     arguments: [
  //       MARKET_ADDRESS,
  //       MARKET_NAME,
  //       token?.creator,
  //       token?.collection,
  //       token?.name,
  //       `${token?.property_version}`,
  //       _item.offer,
  //       _item.price,
  //     ],
  //   };
  //   try {
  //     await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
  //     try {
  //       await axios.put(
  //         `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
  //         {
  //           type: "REQUEST_ACCEPT",
  //           tokenId: {
  //             property_version: token?.property_version,
  //             token_data_id: {
  //               collection: token?.collection,
  //               creator: token?.creator,
  //               name: token?.name,
  //             },
  //           },
  //         }
  //       );
  //     } catch (error) {
  //       console.log("error1", error);
  //     }
  //     try {
  //       const _res = await axios.put(`${API_ENDPOINT}/market/nft`, {
  //         property_version: token?.property_version,
  //         name: token?.name,
  //         slug: metaTag.slugName,
  //       });
  //       if (_res.data.image_uri!=="") {
  //         setToken({ ..._res.data, image_uri: _res.data.image_uri });
  //       } else {
  //         const res = await axios.get(_res.data.token_uri);
  //         setToken({
  //           ..._res.data,
  //           image_uri: res.data.image,
  //         });
  //       }
  //     } catch (error) {
  //       console.log("error2", error);
  //     }

  //     let offers = await fetchOffers(token);
  //     setOfferData(offers);
  //     toast.success("Successful Transaction!");
  //   } catch (error: any) {
  //     toast.error(`${error.name}`);
  //   }
  // };
  // const collectionAcceptOffer = async (_item: I_Offer) => {
  //   const payload: Types.TransactionPayload = {
  //     type: "entry_function_payload",
  //     function: `${MARKET_ADDRESS}::marketplace::sell_token_for_collection_offer`,
  //     type_arguments: [MARKET_COINT_TYPE],
  //     arguments: [
  //       MARKET_ADDRESS,
  //       MARKET_NAME,
  //       token?.creator,
  //       token?.collection,
  //       [token?.name],
  //       [token?.property_version],
  //       _item.offer,
  //       _item.price,
  //     ],
  //   };
  //   try {
  //     await signAndSubmitTransaction(payload, {
  //       gas_unit_price: 100,
  //     });

  //     await axios.put(
  //       `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
  //       {
  //         type: "REQUEST_COLLECTION_ACCEPT",
  //         tokenId: {
  //           property_version: token?.property_version,
  //           token_data_id: {
  //             collection: token?.collection,
  //             creator: token?.creator,
  //             name: token?.name,
  //           },
  //         },
  //       }
  //     );
  //     const _res = await axios.put(`${API_ENDPOINT}/market/nft`, {
  //       property_version: token?.property_version,
  //       name: token?.name,
  //       slug: metaTag.slugName,
  //     });

  //     if (_res.data.image_uri?.length > 0) {
  //       setToken({ ..._res.data, image_uri: _res.data.image_uri });
  //     } else {
  //       try {
  //         const response = await fetch(_res.data.token_uri);
  //         const json = await response.json();
  //         setToken({
  //           ..._res.data,
  //           image_uri: json.image,
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     let offers = await fetchOffers(token);
  //     setOfferData(offers);
  //     toast.success("Successful Transaction!");
  //   } catch (error: any) {
  //     toast.error(`${error.name}`);
  //   }
  // };
  // const cancelOffer = async (_item: I_Offer) => {
  //   const payload: Types.TransactionPayload = {
  //     type: "entry_function_payload",
  //     function: `${MARKET_ADDRESS}::marketplace::cancel_offer`,
  //     type_arguments: [MARKET_COINT_TYPE],
  //     arguments: [
  //       MARKET_ADDRESS,
  //       MARKET_NAME,
  //       token?.owner,
  //       token?.creator,
  //       token?.collection,
  //       token?.name,
  //       `${token?.property_version}`,
  //       _item.price,
  //     ],
  //   };
  //   try {
  //     await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
  //     await axios.put(
  //       `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
  //       {
  //         type: "REQUEST_CANCEL",
  //         tokenId: {
  //           property_version: token?.property_version,
  //           token_data_id: {
  //             collection: token?.collection,
  //             creator: token?.creator,
  //             name: token?.name,
  //           },
  //         },
  //       }
  //     );
  //     let offers = await fetchOffers(token);
  //     setOfferData(offers);
  //     toast.success("Successful Transaction!");
  //   } catch (error: any) {
  //     toast.error(`${error.name}`);
  //   }
  // };
  // const collectionCancelOffer = async (_item: I_Offer) => {
  //   const payload: Types.TransactionPayload = {
  //     type: "entry_function_payload",
  //     function: `${MARKET_ADDRESS}::marketplace::cancel_collection_offer`,
  //     type_arguments: [MARKET_COINT_TYPE],
  //     arguments: [
  //       MARKET_ADDRESS,
  //       MARKET_NAME,
  //       token?.creator,
  //       token?.collection,
  //       _item.price,
  //     ],
  //   };
  //   try {
  //     await signAndSubmitTransaction(payload, { gas_unit_price: 100 });
  //     await axios.put(
  //       `${API_ENDPOINT}/offer/update?timestamp=${_item.timestamp}`,
  //       {
  //         type: "REQUEST_COLLECTION_CANCEL",
  //         tokenId: {
  //           property_version: token?.property_version,
  //           token_data_id: {
  //             collection: token?.collection,
  //             creator: token?.creator,
  //             name: "",
  //           },
  //         },
  //       }
  //     );
  //     let offers = await fetchOffers(token);
  //     setOfferData(offers);
  //     toast.success("Successful Transaction!");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed Transaction!");
  //   }
  // };

  return (
    <>
      <Head>
        <title>{`${metaTag?.name?.replace(/\u2014/g, " ")} - Vexpy`}</title>
        <meta
          property="og:title"
          content={`${metaTag?.name?.replace(/\u2014/g, " ")} - Vexpy`}
        />
        <meta
          property="og:description"
          content={`${metaTag?.name?.replace(
            /\u2014/g,
            " "
          )} on Vexpy, make an offer or buy this item, The current top offer for it is ${
            metaTag?.bestOffer
          } APT.`}
        />
        <meta name="twitter:site" content="@vexpy_com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        {apiLoad ? (
          <AssetPlaceholder />
        ) : (
          <div className="px-4 max-w-[1350px] mx-auto py-8 sm:px-8 pt-32">
            <div className="flex flex-col gap-14 md:flex-row ">
              <div>
                <div className="flex aspect-square items-center justify-center overflow-hidden w-[600px] h-[600px] rounded-lg ">
                  <Image
                      className="aspect-square object-contain primary-nft"
                      src={
                        token.image_uri ? token.image_uri : DEFAULT_IMG
                      }
                      alt={"NFT Image"}
                      width={600}
                      height={600}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = ERROR_IMG;
                      }}
                      unoptimized 
                    />
                </div>
              </div>
              <div className="flex flex-col mt-12">
                <Link
                  className="text-[18px] hover:underline"
                  href={`/collection/${encodeURIComponent(
                    token?.slug!
                  )}/listed`}
                >
                  {token?.collection}
                </Link>
                <div className="text-[14px]">
                    {token?.volume} APT volume
                    
                </div>
                <div className="text-[2.5rem] font-normal mt-8">
                    {token?.name}
                    
                </div>
                <div className="flex flex-col gap-4">
                  {token?.price === 0 ? (
                    <div>
                      {token.owner === account?.address?.toString() ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-4 items-center text-[14px] my-8">
                            <div className="">Owned by</div>
                            <Link
                              className="underline"
                              href={`/profile/${token?.owner}/collected`}
                            >
                               {token?.user_name!==null?token?.user_name:token?.owner?.substring(0, 5) + "...." +token?.owner?.substring(token?.owner?.length - 5)}
                            </Link>
                          </div>
                          <div>
                            <div className="relative flex">
                              <input
                                type="text"
                                name="price"
                                id="price"
                                className="border-b border-black dark:border-white dark:bg-[#121212] outline-none my-4 w-1/2"
                                value={price}
                                onChange={(e) => {
                                  setPrice(e.target.value);
                                  setIsListPrice(false);
                                }}
                              />
                              <div className="absolute right-1/2 top-4">
                                APT
                              </div>
                            </div>
                            {isListPrice ? (
                                <div className="text-red-500 text- h-4">
                                {`Please input large value than ${
                                  token?.floor / 100000000
                                }
                                APT`}
                              </div>
                            ) : (
                              <div className="h-4"></div>
                            )}
                          </div>

                          {load ? (
                            <button className="w-1/2 py-2 bg-[#63C3A7] text-white my-4  text-[18px] font-normal hover:bg-[#40a789] rounded-full flex items-center justify-center">
                              <span className="loader mr-2"></span>
                              Listing...
                            </button>
                            ) : (
                                  <button
                                    className="w-1/2 py-2 bg-[#63C3A7] text-white my-4  text-[18px] font-normal hover:bg-[#40a789] rounded-full"
                                    onClick={() => onListForSale()}
                                  >
                                    List Item
                                    </button>
                                  
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-4 items-center text-[14px] my-8">
                            <div className="">Owned by</div>
                            <Link
                              className="underline"
                              href={`/profile/${token?.owner}/collected`}
                            >
                              {token?.user_name!==null?token?.user_name:token?.owner?.substring(0, 5) + "...." +token?.owner?.substring(token?.owner?.length - 5)}
                            </Link>
                          </div>
                          <div className="flex flex-col">
                            {load ? (
                              <button className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full flex items-center justify-center">
                                <span className="loader mr-2"></span>
                                Adding...
                              </button>
                            ) : (
                              <button
                                className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full"
                                onClick={() => onBuyForSale()}
                              >
                                Add to Cart
                              </button>
                            )}

                            <button
                              className="w-full py-2  dark:bg-[#121212] border-black  border-2 dark:border-white dark:hover:border-[#40a789] dark:hover:text-[#40a789] dark:text-white my-1  text-[18px] font-normal hover:border-[#40a789] hover:text-[#40a789] rounded-full"
                              onClick={() => makeOffer()}
                            >
                              Make Offer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {account?.address ? (
                        account?.address?.toString() === token?.owner ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-4 text-[2rem] font-semibold">
                              <div>{token?.price!/100000000} APT</div>
                            </div>
                            <div className="flex gap-4 items-center text-[14px] my-8">
                              <div className="">Owned by</div>
                              <Link
                                className="underline"
                                href={`/profile/${token?.owner}/collected`}
                              >
                                    {token?.user_name!==null?token?.user_name:token?.owner?.substring(0, 5) + "...." +token?.owner?.substring(token?.owner?.length - 5)}
                              </Link>
                            </div>
                            {load ? (
                              <button className="w-1/2 py-2 bg-[#63C3A7] text-white my-4  text-[18px] font-normal hover:bg-[#40a789] rounded-full flex items-center justify-center">
                                <span className="loader mr-2"></span>
                                Canceling...
                              </button>
                            ) : (
                              <button
                                className="w-1/2 py-2 bg-[#63C3A7] text-white my-4  text-[18px] font-normal hover:bg-[#40a789] rounded-full"
                                onClick={() => onCancelForSale()}
                              >
                                Cancel Listing
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-4 text-[2rem] font-semibold">
                              <div>{token?.price! / 100000000} APT</div>
                            </div>
                            <div className="flex gap-4 items-center text-[14px] my-8">
                              <div className="">Owned by</div>
                              <Link
                                className="underline"
                                href={`/profile/${token?.owner}/collected`}
                              >
                                      {token?.user_name!==null?token?.user_name:token?.owner?.substring(0, 5) + "...." +token?.owner?.substring(token?.owner?.length - 5)}
                              </Link>
                            </div>
                            <div className="flex flex-col">
                              {load ? (
                                <button className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full flex items-center justify-center">
                                  <span className="loader mr-2"></span>
                                  Adding...
                                </button>
                              ) : (
                                <button
                                  className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full"
                                  onClick={() => onBuyForSale()}
                                >
                                  Add to Cart
                                </button>
                              )}

                              <button
                                className="w-full py-2  dark:bg-[#121212] border-black  border-2 dark:border-white dark:hover:border-[#40a789] dark:hover:text-[#40a789] dark:text-white my-1  text-[18px] font-normal hover:border-[#40a789] hover:text-[#40a789] rounded-full"
                                onClick={() => makeOffer()}
                              >
                                Make Offer
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex gap-4 text-[2rem] font-semibold">
                            <div>{token?.price! / 100000000} APT</div>
                          </div>
                          <div className="flex gap-4 items-center text-[14px] my-8">
                            <div className="">Owned by</div>
                            <Link
                              className="underline"
                              href={`/profile/${token?.owner}/collected`}
                            >
                                    {token?.user_name!==null?token?.user_name:token?.owner?.substring(0, 5) + "...." +token?.owner?.substring(token?.owner?.length - 5)}
                            </Link>
                          </div>
                          <div className="flex flex-col">
                            {load ? (
                              <button className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full flex items-center justify-center">
                                <span className="loader mr-2"></span>
                                Adding...
                              </button>
                            ) : (
                              <button
                                className="w-full py-2 bg-[#63C3A7] text-white my-1  text-[18px] font-normal hover:bg-[#40a789] rounded-full"
                                onClick={() => onBuyForSale()}
                              >
                                Add to Cart
                              </button>
                            )}

                            <button
                              className="w-full py-2  dark:bg-[#121212] border-black  border-2 dark:border-white dark:hover:border-[#40a789] dark:hover:text-[#40a789] dark:text-white my-1  text-[18px] font-normal hover:border-[#40a789] hover:text-[#40a789] rounded-full"
                              onClick={() => makeOffer()}
                            >
                              Make Offer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {token?.description && (
                  <div className="pt-8">
                    <div className="text-[16px] font-bold">Description</div>
                    <div className="text-[16px] py-4">{token?.description}</div>
                  </div>
                )}

                {nftMetaData!==undefined && nftMetaData.length > 0 && (
                  <div>
                    <div className="text-[16px] font-bold">Item Properties</div>
                    <ul className="flex flex-col w-96 pt-4 ">
                      {nftMetaData.map((item: any, i: number) => (
                        <li key={i} className="flex gap-2 items-center">
                          <div className="text-2xl">•</div>
                          <div className="text-[16px] dark:text-gray-200">
                            {item.trait_type}:
                          </div>
                          <div className="text-[16px] lowercase">
                            {item.value}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <ModalBox show={modalShow} handleClose={setModalShow}>
              <div className="text-center py-2 text-xl font-semibold">
                Place Offer
              </div>
              <div className="w-[24rem]">
                <div className="text-sm">
                  Placing an offer removes coins from your wallet. You can
                  cancel your offer anytime to get your coins back.
                </div>
                <div className="py-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div>Price</div>
                    <div className="relative flex">
                      <input
                        type="text"
                        name="price"
                        autoFocus
                        value={offer.price}
                        onChange={(e) => {
                          if (e.target.value.split(".")[1]?.length > 2) {
                            e.target.value = parseFloat(e.target.value).toFixed(
                              2
                            );
                          }
                          setOffer({
                            ...offer,
                            price: e.target.value,
                          });
                        }}
                        className="dark:bg-[#1C1917] border border-gray-600 rounded-lg w-full py-2 pl-3 pr-11 text-lg font-semibold"
                      />
                      <div className="absolute top-3 right-3">APT</div>
                    </div>
                    </div>
                  {isError ? (
                    <div className="text-red-500 h-3">
                      {`Please input large value than ${
                        offerData?.filter(
                          (item) => item.duration * 1000 > Date.now()
                        )[0]?.price / 100000000
                      }APT`}
                    </div>
                  ) : (
                    <div className="h-3"></div>
                  )}
                  {/* <div className="flex flex-col gap-2">
                    <label htmlFor="expried">Expires In</label>
                    <select
                      className="dark:bg-[#1C1917] border border-gray-600 rounded-lg w-full py-2 pl-3 pr-11 text-lg font-semibold"
                      value={offer.expired}
                      onChange={(e) =>
                        setOffer({
                          ...offer,
                          expired: e.target.value,
                        })
                      }
                    >
                      <option value="3600">1 hour</option>
                      <option value="21600">6 hours</option>
                      <option value="43200">12 hours</option>
                      <option value="86400">24 hours</option>
                      <option value="259200">3 days</option>
                      <option value="604800">7 days</option>
                      <option value="2630000">1 month</option>
                      <option value="7890000">3 months</option>
                      <option value="15780000">6 months</option>
                    </select>
                  </div> */}
                </div>
                <div className="flex justify-center mt-2 text-white">
                  {modalload ? (
                    <button className="bg-[#63C3A7] px-4 py-2 text-lg font-bold rounded hover:bg-[#40a789] flex justify-center gap-1 items-center">
                      <span className="loader mr-2"></span>
                      Offering...
                    </button>
                  ) : (
                    <button
                      className="bg-[#63C3A7] px-4 py-2 text-lg font-bold rounded hover:bg-[#40a789]"
                      onClick={() => createOffer()}
                    >
                      Create Offer
                    </button>
                  )}
                </div>
              </div>
            </ModalBox>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        )}
      </main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({ query }: { query: any }) {
  let payload = {
    property_version: query.version,
    slug: query.slugName,
    name: query.name?.replace(/\u2014/g, " "),
  };
  let bestOffer: number = 0;
  let nftData: any;
  let offers: any;
  try {
    const res = await axios.put(`${API_ENDPOINT}/market/nft`, payload);
    nftData = res.data[0];
    offers = await fetchOffers(res.data[0]);
    bestOffer =
      offers?.filter((item: any) => item?.duration * 1000 > Date.now())[0]
        ?.price / 100000000;
  } catch (error) {
    console.log(error);
  }
  let metaTag = {
    slugName: query.slugName,
    name: query.name,
    version: query.version,
    bestOffer: bestOffer ?? 0,
  };

  return { props: { metaTag: metaTag, nftData: nftData, offers: offers } };
}
