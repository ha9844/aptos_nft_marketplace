import { useEffect, useState, useContext, ChangeEvent } from "react";
import axios from "axios";
import { I_Collection, I_Offer, Offer } from "../../types/Offer";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {
  CDN_URL,
  DEFAULT_IMG,
  ERROR_IMG,
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "../../utils/constants";
import { ModalContext } from "../Navbar/ModalContext";
import { API_ENDPOINT } from "../../utils/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import CollapsibleForm from "./CollapsibleForm";
import { dedicatedGateway } from "@/utils/utils";
import Pagination from "../Pagination/pagination";
import aptos from '@/img/aptos.svg';
import Image from 'next/image';
import next from "next";

const Listed = (_collection: any) => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const [collectionDetail, setCollectionDetail] = useState<Offer[]>();
  const { account, signAndSubmitTransaction } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);
  const [colMetaData, setColMetaData] = useState<any>({});

  const [totalPage, setTotalPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const pageSize = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ trait_type: string; value: string, index: number }[]>(
    []
  );
  const [metaFlag, setMetaFlag] = useState<Boolean>(false);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 500
    ) {
      // When the user is near the bottom of the page, load more items
      loadMoreItems();
    }
  };
  const loadMoreItems = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const filterString = JSON.stringify(filter);
      const nextPageData = await axios.get(
        `${API_ENDPOINT}/market/collection/${encodeURIComponent(
          slug
        )}?isForSale=false&filter=${filterString}&page=${currentPage + 1}&pageSize=${`20`}`
      );
      let pageData = collectionDetail;
      for (let i = 0; i < nextPageData.data.items.length; i++){
        pageData?.push(nextPageData.data.items[i])
      }
      setCollectionDetail(pageData);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, currentPage, slug]);


  const onPageChange = (page: number) => {
    setCurrentPage(page);
    onUpdateFilter();
  };

  const onUpdateFilter = async () => {
    const _totalPage = Math.ceil(count / 5);
    setTotalPage(_totalPage);
    if (currentPage > _totalPage) setCurrentPage(1);
  };

  useEffect(() => {
    const _totalPage = Math.ceil(count / 5);
    setTotalPage(_totalPage);
    if (currentPage > _totalPage) setCurrentPage(1);
  }, [count]);

 
  const [collectionData, setCollectionData] = useState<I_Collection>({
      property_version: "",
      token_data_id_collection: "",
      token_data_id_creator: "",
      token_data_id_name: "",
      supply: 0,
      owner: 0,
      image_uri: "",
      metadata_uri: "",
      collection: '',
      creator: '',
      symbol: '',
      description: '',
      website: '',
      email: '',
      twitter: '',
      discord: '',
      telegram: '',
      github: '',
      instagram: '',
      medium: '',
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
      slug: '',
      topoffer: 0,
      royalty: 0,
      sales_24h: 0,
  });
  useEffect(() => {
    
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const filterString = JSON.stringify(filter);
        let _ollectionDetail = await axios.get(
          `${API_ENDPOINT}/market/collection/${encodeURIComponent(
            slug!
          )}?isForSale=false&filter=${filterString}&page=${currentPage}&pageSize=${`20`}`,
        );
        setCollectionDetail(_ollectionDetail.data.items);
        setCount(_ollectionDetail.data.count);
      } catch (error) {
        console.log(error);
      }finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [slug, filter]);
  
  useEffect(() => {
   
    if (collectionDetail !== undefined && !metaFlag) {
      const meta_data = JSON.parse(_collection._collection.collection.collection.attributes);
      setCollectionData(_collection._collection.collection.collection);
      const metada = JSON.parse(collectionDetail[0].metadata)?.attributes !== undefined ? JSON.parse(collectionDetail[0].metadata)?.attributes : JSON.parse(collectionDetail[0].metadata);
      if (metada !== null && Array.isArray(metada)) {
        const traitOrder = metada.map((item: any) => item.trait_type);
        // Sort metadataArray based on the index of attributes_name in traitOrder
        const reorderedMetadataArray = meta_data.sort((a: any, b: any) => {
          const indexA = traitOrder.indexOf(a.attributes_name);
          const indexB = traitOrder.indexOf(b.attributes_name);
          return indexA - indexB;
        });
        setColMetaData(reorderedMetadataArray);
      } else {
        setColMetaData(meta_data);
      }
     
      setMetaFlag(true);
    }
  },[slug,collectionDetail])

  const onBuyForSale = async (token: Offer) => {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }
    const payload = {
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
      await axios.put(`${API_ENDPOINT}/market/update`, {
        type: "REQUEST_PURCHASE",
        tokenId: {
          property_version: token?.property_version,
          collection: token?.collection,
          creator: token?.creator,
          name: token?.name,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    _event: ChangeEvent<HTMLInputElement>,
    _index: number,
    _key: any,
    _type: any
  ) => {
    if (_event.target.checked) {
      setFilter([...filter, { trait_type: _key, value: _type, index: _index }]);
    } else {
      setFilter(filter.filter((item) => item.value !== _type ));
    }
  };

  return (
    <>
      <main className="flex gap-4">
        <div className="flex flex-col">
          <div
            className="flex py-3 cursor-pointer  hover:bg-gray-200 dark:hover:bg-[#1C1917] px-2 rounded-xl hidden sm:block"
          >
            <span className="text-[18px] font-bold">Filter</span>
          </div>
          {Array.isArray(colMetaData) && (
            <div className="w-96 hidden lg:block">
              {colMetaData.map((column: any, i: number) => (
                <div key={i}>
                  <CollapsibleForm
                    heading={column.attributes_name}
                    element={
                      <div>
                        {column.attributes_values.map((type: any, j: number) => (
                          <div key={j}>
                            <div className="flex gap-3">
                              <input
                                type="checkbox"
                                className="w-5 h-5"
                                onChange={(event) =>
                                  handleChange(event,i, column.attributes_name, type.attributes_value)
                                }
                                id={`${column.attributes_name}-${type.attributes_value}`}
                              />
                              <label
                                htmlFor={`${column.attributes_name}-${type.attributes_value}`}
                                className="flex justify-between w-full"
                              >
                                <div>
                                  {type.attributes_value}: {type.total}
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
            )}
        </div>

        {/* {Object.keys(colMetaData).length !== 0 && (
          <div className="w-96 hidden lg:block">
            {Object.keys(colMetaData)?.map((key: any, i: number) => (
              <div key={i}>
                <CollapsibleForm
                  heading={key}
                  element={
                    <div>
                      {Object.keys(colMetaData[key]).map(
                        (type: any, j: number) => (
                          <div key={j}>
                            <div className="flex gap-3">
                              <input
                                type="checkbox"
                                className="w-5 h-5"
                                onChange={(event) =>
                                  handleChange(event, key, type)
                                }
                                id="Sales"
                              />
                              <label
                                htmlFor="Sales"
                                className="flex justify-between w-full"
                              >
                                <div>
                                  {type}: {colMetaData[key][type]}
                                </div>
                              </label>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        )} */}
        <div className="w-full">
          <div className="text-[18px] pb-4 py-3 px-2">
            {!loading && collectionDetail?.filter((item) => item.isForSale).length} listed
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-4 w-full">
            {collectionDetail?.map((item: Offer, i: number) => (
              <Link
                href={`/asset/${encodeURIComponent(
                  item?.slug
                )}/${encodeURIComponent(
                  item?.name?.replace(/\s/g, "\u2014")
                )}/${item?.property_version}`}
                key={i}
                className="card-box border-2 rounded-xl relative group"
              >
                {/* <div>{ item.token_data_id_name}</div> */}

                <div>
                  <Image
                    src={item.image_uri ? `${item.image_uri}` : item.content_uri}
                    alt="preview_uri"
                    width={100}
                    height={100}
                    sizes="100vw"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = ERROR_IMG;
                    }}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    className="rounded-t-xl w-full"
                    loading="lazy"
                  />
                  <div className="px-4 py-2 flex flex-col">
                    <div className="font-normal text-[16px]">
                      {item.name}
                      
                    </div>
                    {/* <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="flex items-center">
                          {item.price > 0
                              ? <span className="font-bold text-[16px]">{item.price / 100000000}</span>
                              : <span className="invisible">NAN</span>}
                          <span>
                          {item.price > 0
                              ? <Image src={aptos} className="mx-1" alt="aptos coin"/>
                              : ""}
                          
                          </span>
                        </div>
                      </div>
                    </div> */}
                    {item.price === 0 ? (
                      item.latest_trade_price > 0 ? (
                        <div className="flex justify-between">
                          <div className="flex gap-2 items-center">
                            <span>Last Sale </span>
                            <span className="font-bold text-[16px]">
                              {item.latest_trade_price} 
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
                            Listed {item.price/100000000} 
                          </span>
                          <Image
                            src={aptos}
                            width={14}
                            height={15}
                            alt="aptos coin"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={`hidden w-full ${
                      item.isForSale ? "group-hover:block" : "invisible"
                    } rounded-b-xl`}
                  >
                    <div className="absolute left-0 bottom-1  bg-[#44403C] w-full rounded-b-xl">
                      <div className="flex flex-col gap-2">
                        <button
                          className="flex flex-col justify-center items-center bg-[#63C3A7] py-2 rounded-b-lg border-2 border-[#63C3A7] hover:bg-[#40a789] text-[18px] font-normal"
                          onClick={(event) => {
                            event.preventDefault(); // Prevent the link from being triggered
                            item.isForSale ? onBuyForSale(item) : "";
                          }}
                        >
                          <div className="text-white">
                            {item.isForSale ? "Buy now" : "Make Offer"}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* <div className="py-4">
            {totalPage > 0 && (
              <Pagination
                visibleNumber={5} // 100
                currentPage={currentPage} // 1
                totalPage={totalPage} // 10
                onPageChange={onPageChange}
              />
            )}
          </div> */}
        </div>
      </main>
    </>
  );
};

export default Listed;
