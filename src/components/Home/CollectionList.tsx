import Link from "next/link";
import Image from 'next/image';
import aptos from '@/img/aptos.svg';
import { ERROR_IMG } from "../../utils/constants";


const CollectionList = ({ collection, rangeStart }: {
    collection: any;
    rangeStart: number;
  }) => {
    return (
      <div>
        <div className="grid grid-cols-12 text-[18px]">
            <div></div>
            <div className="col-span-7"></div>
            <div className="col-span-2 text-center">Volume</div>
            <div className="col-span-2 text-center">Sales</div>
        </div>
        {collection?.slice(0, rangeStart+5).map((item: any, i: number) => (
        <Link
            href={`/collection/${encodeURIComponent(
            item?.collection.replace(/[^A-Z0-9]+/gi,"-")!
            )}/listed`}
            className="items-center bg-black collect-box p-[5px] my-[12.5px] grid grid-cols-12 text-[18px] border-[#e5e7eb] border-solid border-[1px]"
            key={i}
        >
            <div className="flex gap-4 items-center col-span-8">
            <div className="flex items-center pl-3">
                <div className="font-normal w-7">{i + rangeStart}</div>
                <div className="w-16 h-16 relative p-2">
                <Image
                    src={item.logo_url}
                    width={50} // Set your desired width
                    height={50} // Set your desired height
                    alt="test"
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = ERROR_IMG;
                    }}
                    className="rounded-[50%] w-[50px] h-[50px]"
                    loading='lazy'   
                />
                </div>
            </div>
            <div>{item?.collection}</div>
            </div>
            <div className="text-center col-span-2 flex justify-center">
            <div className="">
                {(item.volume)}
            </div>
            <div className="flex justify-center items-center">
                <Image
                    src={aptos}
                    className="mx-1"
                    width={14}
                    height={15}
                    alt="aptos coin"
                />
            </div>
            </div>
            <div className="text-center col-span-2">
            <div className="">
                {(item.sales_24h)}
            </div>
            </div>
        </Link>
        ))}
      </div>
    );
}


export default CollectionList;