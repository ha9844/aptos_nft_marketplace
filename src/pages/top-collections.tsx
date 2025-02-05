import Head from "next/head";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_ENDPOINT, CDN_URL, ERROR_IMG } from "../utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { dedicatedGateway } from "../utils/utils";
import { getPeriod } from "../utils/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { DEFAULT_IMG } from "../utils/constants";
import DropDown from "@/components/Home/DropDown";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Pagination from "@/components/Pagination/pagination";
import Image from "next/image";

export default function Home() {
  const [collection, setCollection] = useState<any>();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const { theme } = useTheme();
  const [period, setPeriod] = useState<number>(24);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 200;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoad(true);
      const _ollectionDetail = await axios.get(
        `${API_ENDPOINT}/collection/collection/fetch?period=${period}&page=${currentPage}&pageSize=${pageSize}`
      );

      setCollection(_ollectionDetail.data?.items);
      setCount(_ollectionDetail.data?.count);
      setIsLoad(false);
    };
    fetchCollection();
  }, [period, currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    onUpdateFilter();
  };

  useEffect(() => {
    onUpdateFilter();
  }, [count]);
  const onUpdateFilter = async () => {
    const _totalPage = Math.ceil(count / 200);
    setTotalPage(_totalPage);
    if (currentPage > _totalPage) setCurrentPage(1);
  };

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
  return (
    <>
      <Head>
        <title>Top NFT Collections - Vexpy</title>
        <meta property="og:title" content="Top NFT Collections - Vexpy" />
        <meta
          property="og:description"
          content="Browse top aptos NFTs on vexpy.com."
        />
        <meta name="twitter:site" content="@vexpy_com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className="dark:bg-[#121212] dark:text-gray-200 bg-white text-gray-800 pt-12">
        <div className="max-w-[1500px] mx-auto pt-20">
          <div className="p-8 dark:bg-[#121212] dark:text-gray-200 flex flex-col pt-16 bg-white text-gray-800">
            <div className="flex  justify-center items-center gap-2 text-[32px] text-[#63c3a7] font-bold text-center flex-col sm:flex-row">
              <div>Top Collections in </div>
              <div
                className="relative cursor-pointer flex items-center"
                onClick={() => {
                  setIsDropDown(!isDropDown);
                }}
                ref={ref}
              >
                {getPeriod(period)}{" "}
                <MdOutlineKeyboardArrowDown
                  className={`duration-150 ${isDropDown ? "-scale-y-100" : ""}`}
                />
                {isDropDown && <DropDown setPeriod={setPeriod} />}
              </div>
            </div>
            {isLoad ? (
              <div className="grid gap-12 pt-12">
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
            ) : (
              <div className="grid gap-12 pt-12">
                <div>
                  <div className="grid grid-cols-12 text-[16px]">
                    <div></div>
                    <div className="col-span-7"></div>
                    <div className="text-center">Floor Price</div>
                    <div className="text-center">Total Owners</div>
                    <div className="text-center">Items</div>
                    <div className="text-center">Volume</div>
                  </div>
                  {collection?.map((item: any, i: number) => (
                    <Link
                      href={`/collection/${encodeURIComponent(
                        item?.slug!
                      )}/listed`}
                      className="items-center collect-box  p-[10px] my-[12.5px] grid grid-cols-12 text-[18px] font-bold border-collection"
                      key={i}
                    >
                      <div className="flex gap-4 items-center col-span-8">
                        <div className="flex items-center">
                          <div className="font-normal w-12">
                            {(currentPage - 1) * 200 + i + 1}
                          </div>
                          <div className="w-16 h-16 relative">
                            <Image
                              
                              src={
                                item.image_uri?
                                   item.image_uri
                                  : DEFAULT_IMG
                              }
                              alt="test"
                              layout="responsive"
                              width={100}
                              height={100}
                              
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = ERROR_IMG;
                              }}
                              className="rounded-[12px]"
                            />
                          </div>
                        </div>
                        <div>{item?.name}</div>
                      </div>
                      <div className="text-center col-span-1">
                        <div className="">
                          {(item.floor / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                      <div className="text-center col-span-1">
                        <div className="">{item.owner}</div>
                      </div>
                      <div className="text-center col-span-1">
                        <div className="">{item.supply}</div>
                      </div>
                      <div className="text-center col-span-1">
                        <div className="">
                          {(item.volume / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {totalPage > 0 && (
              <Pagination
                visibleNumber={5} // 100
                currentPage={currentPage} // 1
                totalPage={totalPage} // 10
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
