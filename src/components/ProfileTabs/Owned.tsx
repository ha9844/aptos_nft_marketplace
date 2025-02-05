import NftCard from "../Utils/NftCard";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useVexpyStore } from "@/store";
import Pagination from "../Pagination/pagination";
import { IData } from "@/types/Collection";

interface collection {
  collection: string;
  count: number;
  floor: number;
  slug: string;
}
const Owned = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const address = router.query.address as string;
  const [tokens, setTokens] = useState<any[]>();
  const [load, setLoad] = useState<boolean>(false);
  const [collection, setCollection] = useState<collection[]>();
  const { tokenData, fetchTokens } = useVexpyStore();
  const [active, setActive] = useState<any>("all");

  const [totalPage, setTotalPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;


  useEffect(() => {
    const fetchNfts = async () => {
      setLoad(false);
  
      try {
        const res: IData<any> = await fetchTokens(address, currentPage, pageSize);
        // Update state based on the response
        setCount(res?.count);
        const result = res?.items?.reduce((acc: any, curr: any) => {
          if (!acc[curr.slug]) {
            acc[curr.slug] = {
              count: 1,
              collection: curr.collection,
              floor: curr.floor,
              slug: curr.slug,
            };
          } else {
            acc[curr.slug].count += 1;
          }
          return acc;
        }, {});
        setCollection(Object.values(result));
  
        // If it's the first page, set the new data; otherwise, append to the existing data
        setTokens((prevTokens: any) => (currentPage === 1 ? res?.items : [...prevTokens, ...res?.items]));
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoad(true);
      }
    };
  
    // Fetch NFTs when the component mounts
    if (address !== null) {
      fetchNfts();
    }
  
    // const handleScroll = () => {
    //   const scrollContainer = window;
    //   if (
    //     scrollContainer.innerHeight + scrollContainer.scrollY >= document.body.offsetHeight && !load && // Add this condition to check if data is already being loaded
    //     currentPage < totalPage
    //   ) {
    //     // When user reaches the bottom of the page, load more items
    //     fetchNfts();
    //   }
    // };
  
    // Attach scroll event listener
    // window.addEventListener('scroll', handleScroll);
  
    // Cleanup event listener on component unmount
    // return () => {
    //   window.removeEventListener('scroll', handleScroll);
    // };
    // }, [address, fetchTokens, currentPage]);
  }, [address]);
    
  
  useEffect(() => {
    const _totalPage = Math.ceil(count / 5);
    setTotalPage(_totalPage);
    if (currentPage > _totalPage) setCurrentPage(1);
  }, [count, currentPage]);

  const ownedCollection = async (item: collection | undefined) => {
    if (item) {
      let _tokens = tokenData?.filter((_item) => _item.slug == item.slug);
      setTokens(_tokens);
    } else {
      setTokens(tokenData);
    }
  };

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    onUpdateFilter();
  };

  const onUpdateFilter = async () => {
    const _totalPage = Math.ceil(count / 5);
    setTotalPage(_totalPage);
    if (currentPage > _totalPage) setCurrentPage(1);
  };

  return !load ? (
    <div className="py-6">
      <h2 className="text-[32px] font-bold py-2 dark:text-white">All items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            height={350}
            baseColor={theme === "dark" ? `#1a1a1a` : `#e1e1e1`}
            highlightColor={theme === "dark" ? `#252525` : `#a3a3a3`}
            key={i}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="">
      <div className="py-6">
        <div className="flex items-baseline gap-4 px-4">
          <h2 className="text-[32px] font-bold py-2 dark:text-white">Items</h2>

          <div className="text-right">
            {/* {Number(
              collection?.length! > 0
                ? collection?.reduce(
                    (acc: any, curr: any) =>
                      acc +
                      (Number(curr.floor) * Number(curr.count)) / 100000000,
                    0
                  )
                : 0
            ).toFixed(2)} */}
            {/* &nbsp;APT total value */}
          </div>
          {/* </div> */}
        </div>
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-1 flex flex-col">
            <div className="text-[16px]">
              <div
                className={`grid grid-cols-7 hover:bg-[rgba(0,0,0,.05)] hover:rounded-xl hover:dark:bg-[#1C1917] px-4 py-[11px] ${
                  active == "all" &&
                  "dark:bg-[#1C1917] bg-[rgba(0,0,0,.05)] rounded-xl"
                }`}
              >
                <div
                  className="py-1 col-span-6"
                  onClick={() => {
                    ownedCollection(undefined);
                    setActive("all");
                  }}
                >
                  All
                </div>
                <div className="text-right col-span-1">
                  {Number(
                    collection?.length! > 0
                      ? collection?.reduce(
                          (acc: any, curr: any) => acc + curr.count,
                          0
                        )
                      : 0
                  )}
                </div>
              </div>
              {collection?.map((item: collection, i: number) => (
                <div
                  key={i}
                  className={`grid grid-cols-7  hover:bg-[rgba(0,0,0,.05)] hover:rounded-xl hover:dark:bg-[#1C1917] py-[11px] px-4 ${
                    active == item &&
                    "dark:bg-[#1C1917] bg-[rgba(0,0,0,.05)] rounded-xl"
                  }`}
                  onClick={() => {
                    ownedCollection(item);
                    setActive(item);
                  }}
                >
                  <div className="text-left col-span-6">{item.collection}</div>
                  <div className="text-right col-span-1">{item.count}</div>
                  {/* <div className="text-right col-span-2">
                    {(item.floor * item.count) / 100000000} APT
                  </div> */}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-6 flex flex-col">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {tokens?.map((token, i) => (
                <Link
                  href={`/asset/${encodeURIComponent(
                    token?.slug
                  )}/${encodeURIComponent(
                    token?.name?.replace(/\s/g, "\u2014")
                  )}/${token?.property_version}`}
                  key={i}
                >
                  <NftCard key={i.toString()} data={token} />
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
        </div>
      </div>
    </div>
  );
};

export default Owned;
