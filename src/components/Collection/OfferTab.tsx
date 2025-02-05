import { API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import ModalBox from "../Utils/ModalBox";
import { ModalContext } from "../Navbar/ModalContext";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { createCollectionOfferPayload } from "@/utils/aptos";
import { useVexpyStore } from "@/store";
import toast, { Toaster } from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

const OfferTab = () => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const { modalState, setModalState } = useContext(ModalContext);
  const { collection } = useVexpyStore();
  const [isError, setIsError] = useState<boolean>(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const [load, setLoad] = useState<boolean>(false);
  const router = useRouter();
  const slug = router.query.slug as string;
  const [offer, setOffer] = useState<{
    price: string;
    amount: string;
    expired: string;
  }>({ price: "0", amount: "0", expired: "94680000" });
  const [offerData, setOfferData] = useState<any[]>([
    {
      property_version: "",
      token_data_id_collection: "",
      token_data_id_creator: "",
      token_data_id_name: "",
      price: 0,
      owner: "",
      offer_id: 0,
      offerer: "",
      duration: 0,
      imageUrl: "",
      timestamp: 0,
      amount: 0,
      leftAmount: 0,
      isforitem: false,
      slug: "",
    },
  ]);

  const createOffer = async () => {
    if (!account) {
      setModalState({ ...modalState, walletModal: true });
      return;
    }
    if (Math.round(parseFloat(offer.price) * 100000000) < 1000000) {
      setIsError(true);
      return;
    }
    setLoad(true);
    try {
      await signAndSubmitTransaction(
        createCollectionOfferPayload(collection, offer),
        { gas_unit_price: 100 }
      );
      //uncomment after live site
      await axios.put(`${API_ENDPOINT}/offer/update?timestamp=`, {
        type: "REQUEST_COLLECT_OFFER",
        tokenId: {
          property_version: collection?.collection?.property_version,
          collection: collection?.collection?.collection,
          creator: collection?.collection?.creator,
          name: "",
        },
      });
      const _collectionOffer = await axios.put(
        `${API_ENDPOINT}/offer/collection/offer`,
        {
          slug,
        }
      );
      let output: any[] = [];
      _collectionOffer.data?.forEach((item: any) => {
        let existing = output.filter((v, i) => {
          return v.price == item.price;
        });
        if (existing.length) {
          let existingIndex = output.indexOf(existing[0]);
          output[existingIndex].bidder = output[existingIndex].bidder + 1;
          output[existingIndex].amount =
            output[existingIndex].amount + item.amount;
          output[existingIndex].leftAmount =
            output[existingIndex].leftAmount + item.leftAmount;
        } else {
          output.push({ ...item, bidder: 1 });
        }
      });

      setOfferData(output.filter((item: any) => item.leftAmount != 0));
      toast.success("Successful Transaction!");
      setLoad(false);
      setModalShow(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed Transaction!");
      setLoad(false);
      setModalShow(false);
    }
  };

  useEffect(() => {
    const fetcOffers = async () => {
      const _collectionOffer = await axios.put(
        `${API_ENDPOINT}/offer/collection/offer`,
        {
          slug,
        }
      );
      let output: any[] = [];
      _collectionOffer.data?.forEach((item: any) => {
        let existing = output.filter((v, i) => {
          return v.price == item.price;
        });
        if (existing.length) {
          let existingIndex = output.indexOf(existing[0]);
          output[existingIndex].bidder = output[existingIndex].bidder + 1;
          output[existingIndex].amount =
            output[existingIndex].amount + item.amount;
          output[existingIndex].leftAmount =
            output[existingIndex].leftAmount + item.leftAmount;
        } else {
          output.push({ ...item, bidder: 1 });
        }
      });

      setOfferData(output.filter((item: any) => item.leftAmount != 0));
    };
    if(slug)
      fetcOffers();
  }, [slug]);
  return (
    <>
      <div className="relative">
        <div className="absolute right-0 -top-10">
          Total Value:&nbsp;
          {Number(
            offerData?.length > 0
              ? offerData?.reduce(
                  (acc: any, curr: any) =>
                    acc +
                    (Number(curr.amount) * Number(curr.price)) / 100000000,
                  0
                )
              : 0
          ).toFixed(2)}
          &nbsp; APT
        </div>
        <div className="grid grid-cols-4 text-[14px] text-center">
          <div>Price</div>
          <div>Quantity</div>
          <div>Bidders</div>
          <div>Size</div>
        </div>
        <div>
          {offerData?.map((item: any, i: number) => (
            <div
              className="grid grid-cols-4 text-[14px] text-center text-base leading-[3rem]"
              key={i}
            >
              <div>{Number(item.price / 100000000).toFixed(2)} APT</div>
              <div>{item.leftAmount}</div>
              {item.bidder == 1 ? (
                <Link href={`/profile/${item.offerer}/collected`}>
                  {item.profile[0].name}
                </Link>
              ) : (
                <div>{item.bidder}</div>
              )}
              <div>
                {Number((item.price * item.amount) / 100000000).toFixed(2)} APT
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0">
          <button
            className="flex flex-col text-white px-8  text-base bg-[#63C3A7]
              dark:hover:bg-[#3A3A3A] rounded-xl hover:bg-[#40a789] my-[30px]"
            onClick={() => setModalShow(!modalShow)}
          >
            <div className="p-2 gap-2 justify-center flex items-center font-bold">
              <FiPlus className="font-bold" />
              <span>Place Offer</span>
            </div>
          </button>
        </div>
        <ModalBox show={modalShow} handleClose={setModalShow}>
          <div className="text-center py-2 text-xl font-semibold">
            Create Collection Offer
          </div>
          <div className="w-[24rem]">
            <div className="text-sm">
              Placing an offer removes coins from your wallet. You can cancel
              your offer anytime to get your coins back.
            </div>
          </div>
          <div className="py-4 flex flex-col gap-2">
            <div>
              <div className="flex flex-col gap-2">
                <div>Price per item</div>
                <div className="relative flex">
                  <input
                    type="text"
                    name="price"
                    autoFocus
                    value={offer.price}
                    onChange={(e) => {
                      if (e.target.value.split(".")[1]?.length > 2) {
                        e.target.value = parseFloat(e.target.value).toFixed(2);
                      }
                      setOffer({
                        ...offer,
                        price: e.target.value,
                      });
                    }}
                    className="dark:bg-[#1C1917] border border-gray-600 rounded-lg w-full py-2 pl-3 pr-11 text-lg font-normal"
                  />
                  <div className="absolute top-3 right-3">APT</div>
                </div>
              </div>
              {isError ? (
                <div className="text-red-500 h-3">
                  {`Please input large value than 0.01 APT`}
                </div>
              ) : (
                <div className="h-3"></div>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <div>Number of items</div>
              <div className="relative flex">
                <input
                  type="text"
                  name="amount"
                  autoFocus
                  value={offer.amount}
                  onChange={(e) => {
                    setOffer({
                      ...offer,
                      amount: e.target.value,
                    });
                  }}
                  className="dark:bg-[#1C1917] border border-gray-600 rounded-lg w-full py-2 pl-3 pr-11 text-lg font-normal"
                />
              </div>
            </div>
            <div>
              Total value:{" "}
              {(
                (isNaN(parseFloat(offer.amount)) ? 0 : Number(offer.amount)) *
                (isNaN(parseFloat(offer.price)) ? 0 : Number(offer.price))
              ).toFixed(2)}{" "}
              APT
            </div>

            {/* <div className="flex flex-col gap-2">
            <label htmlFor="expried">Expires In</label>
            <select
              className="dark:bg-[#1C1917] border border-gray-600 rounded-lg w-full py-2 pl-3 pr-11 text-lg font-normal"
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
            {load ? (
              <button className="bg-[#63C3A7] px-4 py-2 text-lg font-bold rounded-full hover:bg-[#40a789] flex justify-center gap-1 items-center">
                <span className="loader mr-2"></span>
                Offering...
              </button>
            ) : (
              <button
                className="bg-[#63C3A7] px-4 py-2 text-lg font-bold  rounded-full hover:bg-[#40a789]"
                onClick={() => createOffer()}
              >
                Create Offer
              </button>
            )}
          </div>
        </ModalBox>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default OfferTab;
