import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "@/utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { DEFAULT_IMG } from "@/utils/constants";
import { useRouter } from "next/router";
import DropDown from "@/components/Home/DropDown";
import { getPeriod } from "@/utils/utils";
export default function Home() {
  const router = useRouter();
  const [collection, setCollection] = useState<any>();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [period, setPeriod] = useState<number>(24);
  const { theme } = useTheme();
  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoad(true);
      const _ollectionDetail = await axios.get(
        `${API_ENDPOINT}/collection/collection/fetch?period=${period}`
      );
      setCollection(_ollectionDetail.data.filter((item: any) => item));

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
      <main className="max-w-[1500px] mx-auto">
        <div className="p-8 dark:bg-[#121212] dark:text-gray-200 flex flex-col pt-16 bg-white text-gray-800">
          <div className="text-[32px] font-normal text-center ">
            Top Collections in{" "}
            <span
              className="relative cursor-pointer"
              onClick={() => {
                setIsDropDown(!isDropDown);
              }}
            >
              {getPeriod(period)}
              {isDropDown && <DropDown setPeriod={setPeriod} />}
            </span>
          </div>
          {isLoad ? (
            <div className="grid grid-cols-2 gap-12 pt-12">
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
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-12 pt-12">
                <div>
                  <div className="grid grid-cols-12 text-[18px]">
                    <div></div>
                    <div className="col-span-7"></div>
                    <div className="col-span-2 text-center">Volume</div>
                    <div className="col-span-2 text-center">Floor Price</div>
                  </div>
                  {collection?.slice(0, 5).map((item: any, i: number) => (
                    <Link
                      href={`/collection/${encodeURIComponent(
                        item?.slug!
                      )}/listed`}
                      className="items-center collect-box p-[10px] my-[12.5px] grid grid-cols-12 text-[18px] font-bold border-collection "
                      key={i}
                    >
                      <div className="flex gap-4 items-center col-span-8">
                        <div className="flex items-center">
                          <div className="font-normal w-7">{i + 1}</div>
                          <div className="w-16 h-16 relative">
                            <Image
                              src={
                                item.image_uri?.length > 0
                                  ? item.image_uri
                                  : DEFAULT_IMG
                              }
                              alt="test"
                              layout="responsive"
                              width={16}
                              height={16}
                              fill={true}
                              style={{ objectFit: "cover" }}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <div>{item.key.token_data_id.collection}</div>
                      </div>
                      <div className="text-center col-span-2">
                        <div className="">
                          {(item.volume / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                      <div className="text-center col-span-2">
                        <div className="">
                          {(item.floor / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div>
                  <div className="grid grid-cols-12 text-[18px]">
                    <div></div>
                    <div className="col-span-7"></div>
                    <div className="col-span-2  text-center">Volume</div>
                    <div className="col-span-2  text-center">Floor Price</div>
                  </div>
                  {collection?.slice(6, 11).map((item: any, i: number) => (
                    <Link
                      href={`/collection/${encodeURIComponent(
                        item?.slug!
                      )}/listed`}
                      className="items-center collect-box p-[10px] my-[12.5px] grid grid-cols-12 text-[18px] font-bold border-collection"
                      key={i}
                    >
                      <div className="flex gap-4 items-center justify-start col-span-8">
                        <div className="flex items-center">
                          <div className="font-normal w-7">{i + 6}</div>
                          <div className="w-16 h-16 relative">
                            <Image
                              src={
                                item.image_uri?.length > 0
                                  ? item.image_uri
                                  : DEFAULT_IMG
                              }
                              alt="test"
                              layout="responsive"
                              width={16}
                              height={16}
                              fill={true}
                              style={{ objectFit: "cover" }}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <div>{item.key.token_data_id.collection}</div>
                      </div>
                      <div className="text-center col-span-2">
                        <div className="">
                          {" "}
                          {(item.volume / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                      <div className="text-center col-span-2">
                        <div className="">
                          {(item.floor / 100000000).toFixed(2)} APT
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center pt-8 pb-4">
                <button
                  className="bg-[#63C3A7] px-4 py-2 rounded-full dark:text-white hover:bg-[#40a789]"
                  onClick={() => router.push("/top-collections")}
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
