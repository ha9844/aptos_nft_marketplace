import { useState, useEffect, useRef } from "react";
import { CDN_URL, MARKET_ADDRESS } from "../../utils/constants";
import { dateDifFromNow, getPeriod } from "../../utils/utils";
import { HiOutlineExternalLink } from "react-icons/hi";
import axios from "axios";
import { API_ENDPOINT } from "../../utils/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import aptos from '@/img/aptos.svg';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import EventType from "./EventType";

const Activity = () => {
  const router = useRouter();
  let slug = router.query.slug as string;
  const [collection, setCollection] = useState<any>();
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [type, setType] = useState<string>("Sales");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const startFetchListEvent = async () => {
      const activity = await axios.get(
        `${API_ENDPOINT}/collection/activity/0/${slug}`
      );
      setCollection(activity.data);
    };

    startFetchListEvent();
  }, [slug]);

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
    const switchType = async () => {
      if (type === "Sales") {
        const activity = await axios.get(
          `${API_ENDPOINT}/collection/activity/0/${slug}`
        );
        setCollection(activity.data);
      }
      if (type === "Listing") {
        const activity = await axios.get(
          `${API_ENDPOINT}/collection/activity/1/${slug}`
        );
        setCollection(activity.data);
      }
    };
    if (slug) {
      switchType();
    }
  }, [type, slug]);

  return (
    <div className="w-full flex gap-8 relative">
      <div className="w-full">
        <div className="grid grid-cols-5 text-[14px]">
          <div>Time</div>
          <div>Item</div>
          <div>Price</div>
          <div>Seller</div>
          <div>Buyer</div>
        </div>
        <div>
          {collection?.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-5 py-4 hover:bg-gray-200 dark:hover:bg-[#1C1917] font-normal text-[16px]"
            >
              <a
                href={`https://explorer.aptoslabs.com/txn/${item.version}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-1 items-center hover:text-blue-500"
              >
                <div>{dateDifFromNow(new Date(item.timestamp * 1000))}</div>
                <HiOutlineExternalLink />
              </a>
              <Link
                href={`/asset/${encodeURIComponent(
                  `${item?.collection?.replace(
                    /[^A-Z0-9]+/gi,
                    "-"
                  )}`
                )}/${encodeURIComponent(
                  item?.name?.replace(/\s/g, "\u2014")
                )}/${item?.property_version}`}
                key={i}
                className="hover:text-blue-500 flex items-center gap-2"
              >
                <Image
                  src={item.image.includes("ipfs://")?item.image.replace("ipfs://", "https://ipfs.io/ipfs/"):item.image}
                  alt="thumbnail"
                  width={32}
                  height={32}
                />
                <div>{item?.name}</div>
              </Link>

              <div className="hover:text-blue-500 flex justify-center items-center gap-2">
                <span>{item.price}</span>
                <Image
                  src={aptos}
                  width={14}
                  height={15}
                  alt="aptos coin"
                />
              </div>
              <Link
                className="hover:text-blue-500"
                href={`/profile/${`0x${item.seller
                  ?.substring(2)
                  .padStart(64, "0")}`}/collected`}
              >
                {item.seller?.slice(-5)}
              </Link>
              <div className="hover:text-blue-500">
                {item.buyer?.length > 0 ? (
                  <div className="flex gap-1 items-center">
                    <Link
                      href={`/profile/${`0x${item.buyer
                        ?.substring(2)
                        .padStart(64, "0")}`}/collected`}
                    >
                      {item?.buyer.slice(-5)}
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">---</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-40 right-0 absolute -top-[10px]">
        <div
          className="relative cursor-pointer flex items-center text-[20px]"
          onClick={() => {
            setIsDropDown(!isDropDown);
          }}
          ref={ref}
        >
          {type}
          <MdOutlineKeyboardArrowDown
            className={`duration-150 ${isDropDown ? "-scale-y-100" : ""}`}
          />
          {isDropDown && <EventType setType={setType} />}
        </div>
      </div>
    </div>
  );
};

export default Activity;
