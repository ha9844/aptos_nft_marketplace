import { useRouter } from "next/router";
// import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
// import { I_Collection, I_CollectionData, Offer } from "@/types/Offer";
import { I_CollectionData } from "@/types/Offer";

// import CollectionPlaceholder from "@/components/Placeholder/CollectionPlaceholder";
import { API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
// import ActiveLink from "@/components/Utils/ActiveLink";
// import CollectionParam from "@/components/Collection/CollectionParam";
// import CollectionTabs from "@/components/Collection/CollectionTabs";
// import NextSeo from "@/components/Utils/NextSeo";
import { useVexpyStore } from "@/store";
import dynamic from "next/dynamic";

const ActiveLink = dynamic(() => import("@/components/Utils/ActiveLink"), { ssr: false });
const CollectionParam = dynamic(() => import("@/components/Collection/CollectionParam"), { ssr: false });
const CollectionTabs = dynamic(() => import("@/components/Collection/CollectionTabs"), { ssr: false });
const NextSeo = dynamic(() => import("@/components/Utils/NextSeo"), { ssr: false });



// import { IData } from "@/types/Collection";
const Collection = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const tab = router.query.tab as string;
  let metaTag = {
    title: "",
    ogTitle: "",
    ogDescription: "",
    twitterSite: "",
    twitterCard: "",
  };


const [collectionData, setCollectionData] = useState<I_CollectionData>({
    collection: {
      property_version: "",
      token_data_id_collection: "",
      token_data_id_creator: "",
      token_data_id_name: "",
      supply: 0,
      owner: 0,
      image_uri: "",
      metadata_uri: "",
      collection: '',
      creator: '',
      symbol: '',
      description: '',
      website: '',
      email: '',
      twitter: '',
      discord: '',
      telegram: '',
      github: '',
      instagram: '',
      medium: '',
      logo_url: '',
      banner_url: '',
      featured_url: '',
      large_image_url: '',
      attributes: '',
      create_tx_version: 0,
      verified: false,
      items_total: 0,
      owners_total: 0,
      volume: 0,
      listed: 0,
      floor: 0,
      slug: '',
      topoffer: 0,
      royalty: 0,
      sales_24h: 0,
    },
    slug: "",
    items: [
      {
        collection: "",
        creator: "",
        name: "",
        asset_id: "",
        property_version: "",
        interact_function: "",
        minter: "",
        owner: "",
        mint_timestamp: 0,
        mint_transaction_hash: "",
        mint_price:0,
        content_type: "",
        content_uri: "",
        token_uri: "",
        metadata: "",
        image_uri: "",
        external_link: "",
        latest_trade_price: 0,
        latest_trade_timestamp: 0,
        latest_trade_transaction_version: 0,
        latest_trade_transaction_hash: "",
        isForSale: 0,
        price: 0,
        offer_id: 0,
        slug: "",
      },
    ],
    metadata: {},
  });
 
  const setCollection = useVexpyStore((state) => state.setCollection);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      switch (tab) {
        case "listed":
          const _collectionParams = await axios.get(
            `${API_ENDPOINT}/collection/${encodeURIComponent(slug!)}`
          );
          const _collectionOffer = await axios.put(
            `${API_ENDPOINT}/offer/collection/offer`,
            {
              slug: slug,
            }
          );

          metaTag = {
            title: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Items - Vexpy`,
            ogTitle: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Items - Vexpy`,
            ogDescription: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} collection on vexpy.com, it have ${
              _collectionParams.data.listed
            } listed items with a top offer of ${
              _collectionOffer.data[0]?.price / 100000000 ?? 0
            } APT.`,
            twitterSite: "@vexpy_com",
            twitterCard: "summary_large_image",
          };

          break;
        case "offers":
          metaTag = {
            title: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Offers - Vexpy`,
            ogTitle: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Offers - Vexpy`,
            ogDescription: `Explore the latest sales and listings of ${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} collection on vexpy.com.`,
            twitterSite: "@vexpy_com",
            twitterCard: "summary_large_image",
          };
          break;
        case "activity":
          metaTag = {
            title: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Activity - Vexpy`,
            ogTitle: `${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} Activity - Vexpy`,
            ogDescription: `Explore the latest sales and listings of ${slug
              ?.slice(0, -6)
              .replace(/\u2014/g, " ")} collection on vexpy.com.`,
            twitterSite: "@vexpy_com",
            twitterCard: "summary_large_image",
          };
          break;
        default:
      }
      const _collectionData = await axios.get(
        `${API_ENDPOINT}/market/collection/${encodeURIComponent(
          slug!
        )}?isForSale=false&filter=[]&page=${`1`}&pageSize=${`20`}`
      );

      const collection = await axios.get(
        `${API_ENDPOINT}/market/metadata/${encodeURIComponent(slug!)}`
      );
      // setAllCollection(_collectionData!);
      const _collection = {
        collection: collection.data[0],
        slug: slug,
        items: _collectionData.data,
        metadata: {}
      }
      setCollection(_collection!);
      setCollectionData({
        collection: {
          property_version: _collection.collection.property_version,
          collection: _collection.collection.collection,
          token_data_id_collection: _collection.collection.token_data_id_collection,
          token_data_id_creator: _collection.collection.token_data_id_creator,
          token_data_id_name: _collection.collection.token_data_id_name,
          supply: _collection.collection.supply,
          owner: _collection.collection.owner,
          image_uri: _collection.collection.image_uri,
          metadata_uri: _collection.collection.metadata_uri,
          creator: _collection.collection.creator,
          symbol: _collection.collection.symbol,
          description: _collection.collection.description,
          website: _collection.collection.website,
          email: _collection.collection.email,
          twitter: _collection.collection.twitter,
          discord: _collection.collection.discord,
          telegram: _collection.collection.telegram,
          github: _collection.collection.github,
          instagram: _collection.collection.instagram,
          medium: _collection.collection.medium,
          logo_url: _collection.collection.logo_url,
          banner_url: _collection.collection.banner_url,
          featured_url: _collection.collection.featured_url,
          large_image_url: _collection.collection.large_image_url,
          attributes: _collection.collection.attributes,
          create_tx_version: _collection.collection.create_tx_version,
          verified: _collection.collection.verified,
          items_total: _collection.collection.items_total,
          owners_total: _collection.collection.owners_total,
          volume: _collection.collection.volume,
          listed: _collection.collection.listed,
          floor: _collection.collection.floor,
          slug: _collection.collection.slug,
          topoffer: _collection.collection.topoffer,
          royalty: _collection.collection.royalty,
          sales_24h: _collection.collection.sales_24h
        },
        slug: _collection.collection.collection,
        items: _collection.items,
        metadata: {}
      });
      setLoading(false);
    }
    loadPage();

    // router.push(`/collection/${slug}/listed`);
  }, []);
 
  const TAB_LIST = useMemo(
    () => [
      {
        path: `/collection/${slug}/listed`,
        text: "Items",
      },
      // {
      //   path: `/collection/${slug}/offers`,
      //   text: "Offers",
      // },
      {
        path: `/collection/${slug}/activity`,
        text: "Activity",
      },
      {
        path: `/collection/${slug}/analyse`,
        text: "Analyse",
      },
    ],
    [slug]
  );

 
  return (
    <>
      <NextSeo metaTags={metaTag} />
      <main>
        <div className="py-8 px-4 sm:px-8 dark:bg-[#121212] dark:text-gray-200 pt-24">
          <CollectionParam collectionItem={collectionData.collection} />
          <div className="mt-4 w-full">
            <div className="grid grid-cols-4 gap-4 pb-4">
              {TAB_LIST?.map((link, index) => (
                <ActiveLink
                  key={index}
                  activeClassName="border-b-2 border-gray-500 bg-[#2f2f2f] rounded-md"
                  className="flex flex-col dark:text-white px-4 font-bold text-[20px]"
                  href={link.path}
                >
                  <div className="p-2 text-center">{link.text}</div>
                </ActiveLink>
              ))}
            </div>
            {!loading ? (
              <CollectionTabs collection={collectionData} />
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};

export default Collection;

// This gets called on every request
// export async function getServerSideProps({
//   query,
// }: {
//   query: { slug: string; tab: string };
//   }) {
//   let metaTag = {
//     title: "",
//     ogTitle: "",
//     ogDescription: "",
//     twitterSite: "",
//     twitterCard: "",
//   };
//   switch (query.tab) {
//     case "listed":
//       const _collectionParams = await axios.get(
//         `${API_ENDPOINT}/collection/${encodeURIComponent(query.slug!)}`
//       );
//       const _collectionOffer = await axios.put(
//         `${API_ENDPOINT}/offer/collection/offer`,
//         {
//           slug: query.slug,
//         }
//       );

//       metaTag = {
//         title: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Items - Vexpy`,
//         ogTitle: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Items - Vexpy`,
//         ogDescription: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} collection on vexpy.com, it have ${
//           _collectionParams.data.listed
//         } listed items with a top offer of ${
//           _collectionOffer.data[0]?.price / 100000000 ?? 0
//         } APT.`,
//         twitterSite: "@vexpy_com",
//         twitterCard: "summary_large_image",
//       };

//       break;
//     case "offers":
//       metaTag = {
//         title: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Offers - Vexpy`,
//         ogTitle: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Offers - Vexpy`,
//         ogDescription: `Explore the latest sales and listings of ${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} collection on vexpy.com.`,
//         twitterSite: "@vexpy_com",
//         twitterCard: "summary_large_image",
//       };
//       break;
//     case "activity":
//       metaTag = {
//         title: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Activity - Vexpy`,
//         ogTitle: `${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} Activity - Vexpy`,
//         ogDescription: `Explore the latest sales and listings of ${query.slug
//           ?.slice(0, -6)
//           .replace(/\u2014/g, " ")} collection on vexpy.com.`,
//         twitterSite: "@vexpy_com",
//         twitterCard: "summary_large_image",
//       };
//       break;
//     default:
//   }
//   const _collectionData = await axios.get(
//     `${API_ENDPOINT}/market/collection/${encodeURIComponent(
//       query.slug!
//     )}?isForSale=false&filter=[]&page=${`1`}&pageSize=${`20`}`
//   );
//   const _collection = await axios.get(
//     `${API_ENDPOINT}/market/metadata/${encodeURIComponent(query.slug!)}`
//   );

//    const return_collection = {
//     collection: _collection.data[0],
//     slug: query.slug,
//     items: _collectionData.data,
//     metadata: {}
//   }
//   return {
//     props: {
//       metaTag: metaTag,
//       _collectionData: _collectionData.data,
//       // _collection: _collection.data[0] ?? [],
//       _collection: return_collection,

//     },
//   };
// }
