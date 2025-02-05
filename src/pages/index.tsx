import Head from "next/head";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_ENDPOINT, ERROR_IMG } from "../utils/constants";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import {  getPeriod } from "../utils/utils";
import { ITopNFTHolder } from "@/types/Collection";
import aptos from '@/img/aptos.svg';
import Image from 'next/image';
import dynamic from "next/dynamic";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = dynamic(() => import("react-loading-skeleton"), { ssr: false });
const CollectionList = dynamic(() => import("@/components/Home/CollectionList"), { ssr: false });
const DropDown = dynamic(() => import("@/components/Home/DropDown"), { ssr: false });


export default function Home() {
  const router = useRouter();
  const [collection, setCollection] = useState<any>();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [period, setPeriod] = useState<number>(24);
  const [topNFTHolders, setTopNFTHolders] = useState<ITopNFTHolder[]>();
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const  formatPriceShort = (price: number) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'm';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(1) + 'k';
    } else {
      return price.toString();
    }
  }
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoad(true);
      const _ollectionDetail = await axios.get(
        `${API_ENDPOINT}/collection/collection/fetch?period=${period}&page=1&pageSize=10`
      );

      setCollection(_ollectionDetail.data);

      const _topNFTHolders: ITopNFTHolder[] = (await axios.get(
        `${API_ENDPOINT}/profile/topnftholder`
      )).data;
      setTopNFTHolders(_topNFTHolders);
      setIsLoad(false);
      
    };
    fetchCollection();
  }, [period]);

  return (
    <>
      <Head>
        <title>Vexpy : Aptos NFT Marketplace</title>
        <meta property="og:title" content="Vexpy : Aptos NFT Marketplace" />
        <meta
          property="og:description"
          content="Explore, buy, and sell NFTs on vexpy.com, Browse the top collections ... and much more."
        />
        <meta name="twitter:site" content="@vexpy_com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className="dark:bg-[#121212] dark:text-gray-200 bg-white text-gray-800">
        <div className="max-w-[1500px] mx-auto ">
          <div className="items-center pt-36">
            <h1 className="text-center tracking-normal text-[40px] text-[#63c3a7]  leading-12 font-GothamBlack">
                Buy And Sell NFTs on <div className="inline-block items-center justify-center pr-5">
                <svg width="40" height="40" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.288 14.8032H29.6416C29.2168 14.8032 28.8126 14.6208 28.5314 14.3035L27.0522 12.6325C26.832 12.3831 26.5147 12.2412 26.1827 12.2412C25.8507 12.2412 25.5334 12.384 25.3132 12.6325L24.0447 14.0661C23.6294 14.5348 23.0334 14.804 22.4073 14.804H2.44756C1.8791 16.4243 1.50844 18.1357 1.36052 19.9107H20.2031C20.5342 19.9107 20.8516 19.7757 21.0803 19.5366L22.8347 17.7057C23.054 17.4769 23.3567 17.3479 23.6732 17.3479H23.7455C24.0783 17.3479 24.3948 17.4907 24.6149 17.7401L26.0933 19.411C26.3745 19.7292 26.7787 19.9107 27.2035 19.9107H42.5838C42.4358 18.1348 42.0652 16.4234 41.4967 14.804H33.2872L33.288 14.8032Z" fill="#63C3A7"/>
                  <path d="M12.7624 30.6495C13.0935 30.6495 13.4108 30.5145 13.6396 30.2754L15.394 28.4445C15.6133 28.2157 15.916 28.0867 16.2325 28.0867H16.3047C16.6376 28.0867 16.954 28.2295 17.1742 28.478L18.6525 30.149C18.9338 30.4672 19.338 30.6487 19.7628 30.6487H40.6058C41.3866 29.0353 41.9585 27.3041 42.2991 25.4904H22.2929C21.8681 25.4904 21.4639 25.3081 21.1827 24.9907L19.7043 23.3198C19.4842 23.0704 19.1668 22.9285 18.8349 22.9285C18.5029 22.9285 18.1856 23.0712 17.9654 23.3198L16.6969 24.7534C16.2815 25.2221 15.6855 25.4913 15.0586 25.4913H1.64432C1.98488 27.305 2.55764 29.0362 3.33766 30.6495H12.7624Z" fill="#63C3A7"/>
                  <path d="M27.5492 9.2226C27.8803 9.2226 28.1977 9.08758 28.4264 8.8485L30.1808 7.01756C30.4001 6.7888 30.7029 6.6598 31.0193 6.6598H31.0916C31.4244 6.6598 31.7409 6.80256 31.961 7.05196L33.4394 8.72294C33.7206 9.04114 34.1248 9.2226 34.5496 9.2226H38.5134C34.7388 4.20536 28.7352 0.959717 21.9721 0.959717C15.2091 0.959717 9.20544 4.20536 5.4309 9.2226H27.5492Z" fill="#63C3A7"/>
                  <path d="M19.5882 35.7614H14.1676C13.7428 35.7614 13.3386 35.5791 13.0574 35.2617L11.579 33.5908C11.3589 33.3414 11.0415 33.1995 10.7096 33.1995C10.3776 33.1995 10.0603 33.3422 9.84012 33.5908L8.57162 35.0244C8.15624 35.4931 7.56026 35.7623 6.93332 35.7623H6.84904C10.6253 39.8086 16.0029 42.3413 21.9739 42.3413C27.9448 42.3413 33.3216 39.8086 37.0987 35.7623H19.5882V35.7614Z" fill="#63C3A7"/>
              </svg></div>
              Blockchain
            </h1>
          </div>
          <div className="py-4 px-4 md:px-8  flex flex-col pt-28 ">
            <div className="flex justify-center items-center gap-2 text-[26px] text-[#63c3a7]  text-center font-GothamBlack flex-col md:flex-row ">
              <div>Top Collections in </div>
              <div
                className="relative cursor-pointer flex items-center"
                // onClick={() => {
                //   setIsDropDown(!isDropDown);
                // }}
                ref={ref}
              >
                {getPeriod(period)}{" "}
                {/* <MdOutlineKeyboardArrowDown
                  className={`duration-150 ${isDropDown ? "-scale-y-100" : ""}`}
                /> */}
                {isDropDown && <DropDown setPeriod={setPeriod} />}
              </div>
            </div>

            {isLoad ? (
              <div className="grid grid-cols-1 gap-12 pt-8 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton
                      height={80}
                      baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
                      highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
                      key={i}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton
                      height={80}
                      baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
                      highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
                      key={i}
                    />
                  ))}
                </div>
              </div>
            ) : (collection?.length > 0 && 
              <div>
                {/* <div className="flex grid grid-cols-1 md:gap-12 pt-12 md:grid-cols-2"> */}
                <div className="flex grid grid-cols-1 md:gap-12 pt-8 md:grid-cols-2">
                    {/* first sector */}
                    <CollectionList collection={collection?.slice(0, 5)} rangeStart={1} />
   
                    {/* second sector */}
                    {collection?.length > 6 && <CollectionList collection={collection?.slice(5, 10)} rangeStart={6} />
   
                    }
                </div>
              </div>
            )}
          </div>
          <div className="py-3 px-4 md:px-8  flex flex-col pt-16 ">
            <div className="flex justify-center items-center gap-2 text-[26px] text-[#63c3a7] font-GothamBlack text-center flex-col md:flex-row py-10">
              <div>Top NFT Holders </div>
            </div>
            <div className = "w-[60%] mx-auto">
              <div className="grid grid-cols-12 text-[18px]">
                <div></div>
                <div className="col-span-5"></div>
                <div className="col-span-3 text-center">Total NFTs Owned</div>
                {/* <div className="col-span-2 text-center">Floor Price</div> */}
                <div className="col-span-3 text-center">Estimate Value</div>
              </div>
              {topNFTHolders?.slice(0,5).map((item: any, i: number) => (
                <Link
                  href={`/profile/${item?.owner}/collected`}
                  className="items-center bg-black collect-box p-[10px] my-[12.5px] grid grid-cols-12 text-[18px] border-[#E5E7EB] border-solid border-[1px] pl-5"
                  key={i}
                >
                  <div className="flex gap-4 items-center col-span-6">
                    <div className="flex items-center">
                      <div className="font-normal w-7">{i + 1}</div>
                      <div className="w-16 h-16 relative">
                        <Image
                          width = {100}
                          height = {100}
                          src={ERROR_IMG}

                          alt="test"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = ERROR_IMG;
                          }}
                          className="rounded-[50%] w-[100px]"
                        />
                      </div>
                    </div>
                    <div>{item?.name}</div>
                  </div>
                  <div className="text-center col-span-3">
                    <div className="">
                      {(item.count)}
                    </div>
                  </div>
                  <div className="text-center col-span-3">
                    <div className="px-10 flex justify-center items-center">
                      <div>
                        {formatPriceShort(item.total_price)}
                      </div>
                      <div>
                        <Image
                          src={aptos}
                          width={14}
                          height={15}
                          className="mx-1"
                          alt="aptos coin"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
