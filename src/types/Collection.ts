import { I_NFTItem } from "./Offer";

export interface I_CollectionDatail {
  claimed_at: string;
  collection_id: string;
  created_at: string;
  creator: string;
  description: string;
  discord: string;
  flagged_collections: string;
  inserted_at: string;
  logo_uri: string;
  max_amount: number;
  name: string;
  slug: string;
  twitter: string;
  uri: string;
  verified: boolean;
  website: string;
}
export interface I_ExplorerCollection {
  collection_id: string;
  creator: string;
  description: string;
  floor: number;
  floor_24: number;
  is_flagged: boolean;
  logo_uri: string;
  max_amount: number;
  name: string;
  num_tokens: number;
  num_unique_owners: number;
  slug: string;
  total_volume: number;
  uri: string;
  verified: boolean;
  volume_24: number;
  volume_48: number;
}
interface I_Attributes {
  value: string;
  trait_type: string;
}
interface I_Metadata {
  attributes: I_Attributes[];
  description: string;
  external_url: string;
  image: string;
  name: string;
}
export interface I_nft {
  amount: number;
  collection_id: string;
  collection_slug: string;
  highest_bid: string;
  inserted_at: string;
  is_listed: boolean;
  last_sale: number;
  last_updated_at: string;
  listed_at: string;
  metadata: I_Metadata;
  pool_id: number;
  preview_uri: string;
  price: number;
  property_version: number;
  rank: number;
  seller: number;
  token_id: string;
  token_name: string;
  token_uri: string;
  updated_at: string;
}
export interface ITopNFTHolder {
  name: string;
  owner: string;
  avatarImage: string;
  count: number;
  total_price: number;
}
export interface IData<T> {
  items: I_NFTItem[];
  count: number;
  // items: T[];
}
