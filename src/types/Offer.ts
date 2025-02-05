import { I_PROFILE } from "./Profile";
import { Token } from "./Token";
export interface Offer {
  collection: string;
  creator: string;
  name: string;
  asset_id: string;
  property_version: string;
  interact_function: string;
  minter: string;
  owner: string;
  mint_timestamp: number;
  mint_transaction_hash: string;
  mint_price: number;
  content_type: string;
  content_uri: string;
  token_uri: string;
  metadata: string;
  image_uri: string;
  external_link: string;
  latest_trade_price: number;
  latest_trade_timestamp: number;
  latest_trade_transaction_version: number;
  latest_trade_transaction_hash: string;
  isForSale: number;
  price: number;
  offer_id: number;
  slug: string;

  symbol: string;
  description: string;
  website: string;
  email: string;
  twitter: string;
  discord: string;
  telegram: string;
  github: string;
  instagram: string;
  medium: string;
  logo_url: string;
  banner_url: string;
  featured_url: string;
  large_image_url: string;
  attributes: string;
  create_tx_version: number;
  verified: Boolean;
  items_total: number;
  owners_total: number;
  volume: number;
  listed: number;
  floor: number;
  topoffer: number;
  royalty: number;
  sales_24h: number;
  user_name: string;
}

// export interface I_Collection {
//   collection_data_id_hash: string;
//   property_version: string;
//   token_data_id_collection: string;
//   token_data_id_creator: string;
//   token_data_id_name: string;
//   isForSale: number;
//   price: number;
//   listed: number;
//   owner: string;
//   offer_id: number;
//   description: string;
//   image_uri: string;
//   metadata_uri: string;
//   token_uri: string;
//   royalty: number;
//   slug: string;
// }

export interface I_Collection {
  collection: string;
  property_version: string;
  token_data_id_collection: string;
  token_data_id_creator: string;
  token_data_id_name: string;
  supply: number;
  owner: number;
  image_uri: string;
  metadata_uri: string;
  creator: string;
  symbol: string;
  description: string;
  website: string;
  email: string;
  twitter: string;
  discord: string;
  telegram: string;
  github: string;
  instagram: string;
  medium: string;
  logo_url: string;
  banner_url: string;
  featured_url: string;
  large_image_url: string;
  attributes: string;
  create_tx_version: number;
  verified: Boolean;
  items_total: number;
  owners_total: number;
  volume: number;
  listed: number;
  floor: number;
  slug: string;
  topoffer: number;
  royalty: number;
  sales_24h: number;
}

export interface I_NFTItem {
  collection: string;
  creator: string;
  name: string;
  asset_id: string;
  property_version: string;
  interact_function: string;
  minter: string;
  owner: string;
  mint_timestamp: number;
  mint_transaction_hash: string;
  mint_price: number;
  content_type: string;
  content_uri: string;
  token_uri: string;
  metadata: string;
  image_uri: string;
  external_link: string;
  latest_trade_price: number;
  latest_trade_timestamp: number;
  latest_trade_transaction_version: number;
  latest_trade_transaction_hash: string;
  isForSale: number;
  price: number;
  offer_id: number;
  slug: string;
}

export interface I_CollectionData {
  collection: I_Collection;
  slug: string;
  items: (I_NFTItem | Offer)[];
  metadata: any;
}

interface I_Attributes {
  trait_type: string;
  value: string;
}
export interface I_Offer {
  property_version: string;
  token_data_id_collection: string;
  token_data_id_creator: string;
  token_data_id_name: string;
  collection: string;
  creator: string;
  name: string;
  price: number;
  owner: string;
  offer_id: number;
  offerer: string;
  offer: string;
  imageUrl: string;
  image_uri: string;
  duration: number;
  timestamp: number;
  isforitem: boolean;
  amount: number;
  leftAmount: number;
  metadata: I_Attributes[];
  slug: string;
}
