import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import ProfileTabs from "@/components/ProfileTabs/ProfileTabs";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import ActiveLink from "@/components/Utils/ActiveLink";
import { useRouter } from "next/router";
import NextSeo from "@/components/Utils/NextSeo";
// import Link from "next/link";
import { API_ENDPOINT, DEFAULT_IMG, ERROR_IMG } from "@/utils/constants";
import Image from "next/image";
import axios from "axios";
import { I_PROFILE } from "@/types/Profile";
// import { dedicatedGateway } from "@/utils/utils";
export default function Asset({
  meta,
  user,
}: {
  meta: {
    title: string;
    ogTitle: string;
    ogDescription: string;
    twitterSite: string;
    twitterCard: string;
  };
  user: I_PROFILE;
}) {
  const router = useRouter();
  const address = router.query.address as string;
  const { account } = useWallet();
  console.log("account is:", account);
  const [profile, setProfile] = useState<I_PROFILE>({
    address: "",
    name: "",
    bio: "",
    email: "",
    website: "",
    twitter: "",
    instagram: "",
    coverImage: "",
    avatarImage: "",
    isVerifeid: false,
    code: "",
  });
  const TAB_LIST = useMemo(
    () => [
      {
        path: `/profile/${address}/collected`,
        text: "Colleted",
      },
      {
        path: `/profile/${address}/activeoffer`,
        text: "Your Offers",
      },
      {
        path: `/profile/${address}/expiredoffer`,
        text: "Expired Offers",
      },
      {
        path: `/profile/${address}/receivedoffer`,
        text: "Received Offers",
      },
    ],
    [address]
  );
  return (
    <>
      <NextSeo metaTags={meta} />
      <main className=" dark:text-gray-200 dark:bg-[#121212] pt-20" >
        {user?.coverImage?.length > 0 ? (
          <div className="w-full">
            <Image
              width =  {100}
              height =  {100}
              src=""
              alt="img"
              className="object-cover w-full h-72"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = ERROR_IMG;
              }}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="pb-6 pt-12 px-12 mb-4 flex flex-col justify-end gap-4">
          <div className="flex items-center gap-2 ">
            {/* <img
              src={user.avatarImage}
              alt="logo_uri"
              width={84}
              height={84}
              className="rounded-full w-[84px] h-[84px]"
            /> */}
            <div className="flex flex-col justify-end">
              <div className="text-4xl font-normal pb-1">{user.name}</div>
              {/* {account?.address == address && (
                <Link
                  href={`/${address}/edit-profile`}
                  className="underline text-[16px] font-normal"
                >
                  Edit my profile
                </Link>
              )} */}
            </div>
          </div>
        </div>
        <div className="flex flex-col  pb-24 px-12">
          <div className="flex gap-4 pb-4 overflow-auto sm:overflow-hidden">
            {TAB_LIST?.map((link, index) => (
              <ActiveLink
                key={index}
                activeClassName="dark:bg-[#3A3A3A] bg-[#cfc8c7] rounded-full"
                className="flex flex-col dark:text-gray-100 px-4 font-normal text-[18px] justify-center"
                href={link.path}
              >
                <div className="p-2 text-center">{link.text}</div>
              </ActiveLink>
            ))}
          </div>
          <ProfileTabs />
        </div>
      </main>
    </>
  );
}
// This gets called on every request
export async function getServerSideProps({
  query,
}: {
  query: { address: string; tab: string };
}) {
  let metaTag = {
    title: "",
    ogTitle: "",
    ogDescription: "",
    twitterSite: "",
    twitterCard: "",
  };

  const res = await axios.get(
    `${API_ENDPOINT}/profile/user?address=${query.address}`
  );
  switch (query.tab) {
    case "collected":
      metaTag = {
        title: `Owned Items of ${res.data?.name} - Vexpy`,
        ogTitle: `Owned Items of ${res.data?.name} - Vexpy`,
        ogDescription: `Browse the owned NFTs of this user : ${res.data?.name} on vexpy.com.`,
        twitterSite: "@vexpy_com",
        twitterCard: "summary_large_image",
      };
      break;
    case "activeoffer":
      metaTag = {
        title: `Created Offers by  ${res.data?.name} - Vexpy`,
        ogTitle: `Created Offers by  ${res.data?.name} - Vexpy`,
        ogDescription: `Track the created offers by this user : ${res.data?.name} on vexpy.com.`,
        twitterSite: "@vexpy_com",
        twitterCard: "summary_large_image",
      };
      break;
    case "expiredoffer":
      metaTag = {
        title: `Expired Offers of ${res.data?.name} - Vexpy`,
        ogTitle: `Expired Offers of ${res.data?.name} - Vexpy`,
        ogDescription: `Track the expired offers of this user : ${res.data?.name} on vexpy.com.`,
        twitterSite: "@vexpy_com",
        twitterCard: "summary_large_image",
      };
      break;
    case "receivedoffer":
      metaTag = {
        title: `Received Offers of ${res.data?.name} - Vexpy`,
        ogTitle: `Received Offers of ${res.data?.name} - Vexpy`,
        ogDescription: `Track the top active recieved offers of this user : ${res.data?.name} on vexpy.com.`,
        twitterSite: "@vexpy_com",
        twitterCard: "summary_large_image",
      };
      break;
    default:
  }

  return { props: { meta: metaTag, user: res.data } };
}
