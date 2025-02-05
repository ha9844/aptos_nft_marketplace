import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import { WalletModal } from "./WalletModal";
import Menu from "./Menu";
import { useRef, useEffect, useState } from "react";
import { useVexpyStore } from "@/store";
import { useRouter } from "next/router";
import Image from "next/image";
// import ActiveLink from "../Utils/ActiveLink";
// import { DEFAULT_IMG } from "@/utils/constants";
import avatar from "../../../public/avatar.svg";
// import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";


const WalletConnect = () => {
  const router = useRouter();
  let address = router.query.address as string;
  const { profile, fetchProfile } = useVexpyStore();
  const { account, disconnect, connected } = useWallet();
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const { modalState, setModalState } = useContext(ModalContext);
  // const disconnectWallet = () => {
  //   disconnect();
  //   setModalState({ ...modalState, walletModal: false });
  // };
  // const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   function handleClickOutside(event: any) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       setIsMenu(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [ref]);
  useEffect(() => {
    if (account?.address?.toString()) {
      fetchProfile(account?.address?.toString()!);
    }
  }, [account, fetchProfile]);

  const disconnectWallet = () => {
    disconnect();
    setModalState({ ...modalState, walletModal: false });
  };
  
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      {connected ? (
        <div className="relative">
          <div className="flex items-center gap-8">
                <div
                  ref={ref}
                  className="relative flex items-center hover:bg-[#40a789] p-1 rounded-full"
                >
                  <button onClick={() => setIsMenu(!isMenu)}>
                {/* <IoSettingsOutline className="text-[28px]" /> */}
                      <Image
                    // src={
                    //   profile?.avatarImage?.length > 0
                    //     ? profile?.avatarImage
                    //     : DEFAULT_IMG
                    // }
                    src={avatar}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full w-[32px] h-[32px]"
                  />
                  </button>
                  {isMenu && (
                    <Menu
                      onDisconnectWallet={disconnectWallet}
                      setIsMenu={setIsMenu}
                    />
                  )}
                </div>
                {/* <div className="text-[18px] hidden md:flex items-center gap-2">
                  <div>
                    <IoWalletOutline className="text-[28px]" />
                  </div>
                </div> */}
          </div>
          
          {/* <ActiveLink
            activeClassName=""
            className="w-[32px] h-[32px] rounded-full dark:text-white  overflow-hidden text-lg font-semibold flex justify-center items-center cursor-pointer hover:bg-[#40a789]"
            href={`/profile/${account!.address}/collected`}
          >
            Profile
          </ActiveLink> */}
        </div>
      ) : (
        <button
          className="w-48 text-lg font-bold py-2 dark:text-white rounded-full flex justify-center items-center gap-3 cursor-pointer hover:bg-[#40a789]"
          onClick={() => setModalState({ ...modalState, walletModal: true })}
        >
          Connect Wallet
        </button>
      )}
      <WalletModal />
    </>
  );
};

export default WalletConnect;
