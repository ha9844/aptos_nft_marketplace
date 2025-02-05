import { Dispatch, SetStateAction } from "react";
import ActiveLink from "../Utils/ActiveLink";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Switch from "../Utils/Switch";
type AppProps = {
  onDisconnectWallet: () => void;
  setIsMenu: Dispatch<SetStateAction<boolean>>;
};
const Menu = (props: AppProps) => {
  const { account } = useWallet();
  const SignOut = () => {
    props.onDisconnectWallet();
    props.setIsMenu(false);
  };
  return (
    <div className="absolute top-14 dark:bg-[#1C1917] bg-white rounded-md w-56 right-0 shadow-4xl flex flex-col z-10">
      {/* <ActiveLink
        activeClassName=""
        className=""
        href={`/profile/${account!.address}/collected`}
      >
        <div
          className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-t-md"
          onClick={() => props.setIsMenu(false)}
        >
          Profile
        </div>
      </ActiveLink> */}
      {/* <ActiveLink
        activeClassName=""
        href="/top-collections"
        className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-t-md"
        onClick={() => props.setIsMenu(false)}
      >
        Top Collections
      </ActiveLink> */}
      {/* <ActiveLink
        activeClassName=""
        href="/mint"
        className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-t-md"
        onClick={() => props.setIsMenu(false)}
      >
        Mint
      </ActiveLink> */}
      <ActiveLink
            activeClassName=""
            className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-b-md"
            href={`/profile/${account!.address}/collected`}
          >
            Profile
      </ActiveLink>
      <div
        className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-b-md"
        onClick={() => {
          SignOut();
        }}
      >
        Sign out
      </div>
      {/* <div className="px-4 py-2 dark:hover:bg-[#292524]  hover:bg-[#cfc8c7]  rounded-b-md flex items-center gap-2">
        <div>Night mode</div>
        <Switch />
      </div> */}
    </div>
  );
};

export default Menu;
