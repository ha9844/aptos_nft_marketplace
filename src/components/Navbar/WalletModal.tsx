import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { dedicatedGateway } from "@/utils/utils";
import { CDN_URL } from "@/utils/constants";
export function WalletModal() {
  const { connect, wallets } = useWallet();
  const walletIcons = [
    "riellrpiwgl2ebxuhzcv",
    "zuv6rbxvoho7wq9hukkg",
    "qzhzuib1obsni2gergk1",
    "rr9y0fizirk1od97izek",
    "djcwulufqfuduervcpao",
  ];
  const { modalState, setModalState } = useContext(ModalContext);
  async function connectWallet(wallet: any) {
    connect(wallet?.adapter?.name);
    setModalState({ ...modalState, walletModal: false });
  }

  function modalBox(content: JSX.Element) {
    const showHideClassName = modalState.walletModal ? "block" : "hidden";
    return (
      <div
        className={`bg-black bg-opacity-70 w-full h-full flex justify-center items-center fixed top-0 left-0 z-50 ${showHideClassName}`}
      >
        <section className="bg-white dark:bg-[#1C1917] z-50 rounded-xl px-6  pt-6 pb-8 relative flex flex-col">
          <div className="text-center py-2 text-xl font-semibold">
            Connect Wallet
          </div>
          {content}
          <IoClose
            className="absolute top-4 right-4 hover:text-red-75 hover:text-gray-500"
            onClick={() => setModalState({ ...modalState, walletModal: false })}
          />
        </section>
      </div>
    );
  }
  return modalBox(
    <>
      {wallets.map((wallet: any, i) => {
        if(i<3)
        return (
          <button
            key={i}
            className="w-64 px-4 rounded-lg flex gap-4 items-center py-4 hover:bg-gray-200 dark:hover:bg-[#292524]"
            onClick={() => connectWallet(wallet)}
          >
            <Image
              src={`${CDN_URL}w_25,h_25/${dedicatedGateway(
                walletIcons[i]
              )}.webp`}
              alt="icon"
              width={25}
              height={25}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src =
                  "https://res.cloudinary.com/vexpy/image/fetch/c_thumb,g_face/https://i.postimg.cc/WbcQBRM3/img.png";
              }}
            />
            <div className="text-lg font-semibold">{wallet?.adapter?.name}</div>
          </button>
        );
      })}
    </>
  );
}
