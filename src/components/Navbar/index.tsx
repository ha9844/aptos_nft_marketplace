import Image from "next/image";
import React, { useState, useEffect, useRef, useContext } from "react";
import { BsSearch } from "react-icons/bs";
import WalletConnect from "./WalletConnect";
import ActiveLink from "../Utils/ActiveLink";
import logo from "../../../public/logo.svg";
import darkLogo from "../../../public/darkLogo.svg";
import { useTheme } from "next-themes";
import { coinClient } from "@/utils/aptos";
import Link from "next/link";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { ModalContext } from "./ModalContext";
import Menu from "./Menu";
const Navbar = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const { account, connected, disconnect } = useWallet();
  const { modalState, setModalState } = useContext(ModalContext);
  useEffect(() => {
    setIsDark(theme === "dark" ? true : false);
  }, [theme]);

  useEffect(() => {
    let address = account?.address;
    if (address) {
      (async () => {
        try {
          const balance = await coinClient.checkBalance(address);
          setBalance(Number(balance) / 100000000);
        } catch (error) {}
      })();
    }
  }, [account]);

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
    <nav className="px-8 lg:px-16 dark:text-gray-200  text-gray-800 fixed  bg-white dark:border-gray-700 dark:bg-[#121212] z-50 w-full py-4">
      <div className="grid grid-cols-3 justify-center items-center">
        <div className="justify-self-start">
          {/* <div className="flex justify-between items-center"> */}
          <div className="flex gap-4 items-center ">
            {/* <Link
            href="/top-collections"
            className="cursor-pointer text-[18px] font-bold hover:rounded-full hover:bg-gray-300 py-2 px-4 hover:dark:bg-[#121212] hidden md:block"
          >
            Browse Collections
          </Link> */}
            <Link
              href="#"
              className="cursor-pointer text-[18px] font-bold hover:text-[#63c3a7] hover:rounded-full hover:bg-gray-300 py-2 px-4 hover:dark:bg-[#121212] hidden md:block"
            >
              Buy $ APT
            </Link>

            {/* <div className="relative hidden md:block">
            <input
              type="text"
              className="dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none pr-4 pl-10 py-2 w-96"
              placeholder="Search for collections..."
            />
            <BsSearch className=" top-[14px] left-4 absolute" />
          </div> */}
          </div>
        </div>
        <div className="justify-self-center">
          <div className="flex gap-0 items-center ">
            <ActiveLink
              activeClassName=""
              className="flex items-center gap-0"
              href="/"
            >
              {isDark ? (
                <Image
                  src={darkLogo}
                  alt="logo"
                  height="50"
                  width="50"
                  className="hover:fill-[#63c3a7]"
                />
              ) : (
                <Image src={logo} alt="logo" height="50" width="50" />
              )}
            </ActiveLink>

            {/* <Link
            href="/top-collections"
            className="cursor-pointer text-[18px] font-bold hover:rounded-full hover:bg-gray-300 py-2 px-4 hover:dark:bg-[#121212] hidden md:block"
          >
            Browse Collections
          </Link> */}

            {/* <div className="relative hidden md:block">
            <input
              type="text"
              className="dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none pr-4 pl-10 py-2 w-96"
              placeholder="Search for collections..."
            />
            <BsSearch className=" top-[14px] left-4 absolute" />
          </div> */}
          </div>
        </div>
        <div className="justify-self-end">
          <div className="flex gap-8 items-center">
            {connected && (
              // <div className="flex items-center gap-8">
              //   <div
              //     ref={ref}
              //     className="relative flex items-center hover:bg-[#40a789] p-1 rounded-full"
              //   >
              //     <button onClick={() => setIsMenu(!isMenu)}>
              //       <IoSettingsOutline className="text-[28px]" />
              //     </button>
              //     {isMenu && (
              //       <Menu
              //         onDisconnectWallet={disconnectWallet}
              //         setIsMenu={setIsMenu}
              //       />
              //     )}
              //   </div>
              //   <div className="text-[18px] hidden md:flex items-center gap-2">
              //     <div>
              //       <IoWalletOutline className="text-[28px]" />
              //     </div>
              //     {balance?.toFixed(2)} APT
              //   </div>
              // </div>
              <></>
            )}
            <WalletConnect />
            {/* </div> */}
          </div>
        </div>
      </div>
      {/* <div className="relative block md:hidden mt-4">
        <input
          type="text"
          className="dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none pr-4 pl-10 py-2 w-full"
          placeholder="Search for collections..."
        />
        <BsSearch className=" top-[14px] left-4 absolute" />
      </div> */}
    </nav>
  );
};

export default Navbar;
