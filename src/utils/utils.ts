import axios from "axios";
import { API_ENDPOINT, NFT_STORAGE_KEY } from "./constants";
import { NFTStorage } from "nft.storage";

export const pinToIpfs = async (file: File): Promise<string> => {
  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  // call client.store, passing in the image & metadata
  return await nftstorage.storeBlob(file);
};

export const replaceIpfsLink = (ipfsLink: string) => {
  return ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/");
};
export const formatData = (address: string, start: number, end: number) => {
  let data = `${address?.slice(0, start)}...${address?.substring(end)}`;
  return data;
};
export const getPeriod = (period: number) => {
  switch (period) {
    case 24:
      return "24 hours";
      break;
    case 168:
      return "7 days";
      break;
    case 720:
      return "30 days";
      break;
    case 470000:
      return "All time";
      break;
    default:
      break;
  }
};

export const dateDifFromNow = (_date: Date | string): string => {
  let date: Date = new Date();
  if (typeof _date === "object") date = _date;
  else date = new Date(_date);
  const difSeconds = Math.abs(new Date().getTime() - date.getTime()) / 1000;

  let result = "";
  if (difSeconds < 60) result = "a min";
  else if (difSeconds < 60 * 60)
    result =
      parseFloat((difSeconds / 60).toFixed(0)) === 1
        ? `${(difSeconds / 60).toFixed(0)} min`
        : `${(difSeconds / 60).toFixed(0)} mins`;
  else if (difSeconds < 60 * 60 * 24)
    result =
      parseFloat((difSeconds / 3600).toFixed(0)) === 1
        ? `${(difSeconds / 3600).toFixed(0)} hour`
        : `${(difSeconds / 3600).toFixed(0)} hours`;
  else if (difSeconds < 60 * 60 * 24 * 7)
    result =
      parseFloat((difSeconds / 87600).toFixed(0)) === 1
        ? `${(difSeconds / 87600).toFixed(0)} day`
        : `${(difSeconds / 87600).toFixed(0)} days`;
  else if (difSeconds < 60 * 60 * 24 * 30)
    result =
      parseFloat((difSeconds / (60 * 60 * 24 * 7)).toFixed(0)) === 1
        ? `${(difSeconds / (60 * 60 * 24 * 7)).toFixed(0)} week`
        : `${(difSeconds / (60 * 60 * 24 * 7)).toFixed(0)} weeks`;
  else if (difSeconds < 60 * 60 * 24 * 30 * 12)
    result =
      parseFloat((difSeconds / (60 * 60 * 24 * 30)).toFixed(0)) === 1
        ? `${(difSeconds / (60 * 60 * 24 * 30)).toFixed(0)} month`
        : `${(difSeconds / (60 * 60 * 24 * 30)).toFixed(0)} months`;
  else result = `${(difSeconds / (60 * 60 * 24 * 30 * 12)).toFixed(0)} years`;

  return new Date().getTime() - date.getTime() > 0
    ? `${result} ago`
    : `in ${result}`;
};

export const fetchOffers = async (item: any) => {
  const _offer = await axios.put(`${API_ENDPOINT}/offer/fetch`, {
    property_version: item?.property_version,
    collection: item?.collection,
    creator: item?.creator,
    name: item?.name,
  });

  const _collectionOffer = await axios.put(
    `${API_ENDPOINT}/offer/collection/fetch`,
    {
      property_version: item?.property_version,
      collection: item?.collection,
      creator: item?.creator,
      name: "",
    }
  );

  return [..._offer.data, ..._collectionOffer.data];
};

export const convertURL = (_url: string) => {
  let arrayLength: string[];
  let image_Uri: string;
  arrayLength = _url.split("/ipfs/");
  if (arrayLength.length > 1) {
    image_Uri = `https://cloudflare-ipfs.com/ipfs/${arrayLength.pop()}`;
  } else {
    image_Uri = _url;
  }
  return image_Uri;
};

export const dedicatedGateway = (_url: string) => {
  return _url;
  // .replace("https://nftstorage.link", "https://ipfs.vexpy.com")
  // .replace("https://cloudflare-ipfs.com", "https://ipfs.vexpy.com")
};
