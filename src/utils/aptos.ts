import { AptosClient, TokenClient, CoinClient } from "aptos";
import {
  APTOS_NODE_URL,
  MARKET_ADDRESS,
  MARKET_COINT_TYPE,
  MARKET_NAME,
} from "./constants";
import { useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useVexpyStore } from "@/store";
import { I_Collection, I_CollectionData } from "@/types/Offer";

const MAX_U64_BIG_INT: bigint = BigInt(2 ** 64) - BigInt(1);
export function createCollectionPayload(
  name: string,
  description: string,
  uri: string
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_collection_script",
    type_arguments: [],
    arguments: [
      name,
      description,
      uri,
      MAX_U64_BIG_INT.toString(),
      [false, false, false],
    ],
  };
}

export function createTokenPayload(
  collection: string,
  name: string,
  description: string,
  uri: string,
  royaltyPayee: string
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_token_script",
    type_arguments: [],
    arguments: [
      collection,
      name,
      description,
      "1",
      MAX_U64_BIG_INT.toString(),
      uri,
      royaltyPayee,
      "100",
      "0",
      [false, false, false, false, false],
      [],
      [],
      [],
    ],
  };
}

export const createCollectionOfferPayload = (
  collectionItem: I_CollectionData,
  offer: {
    price: string;
    amount: string;
    expired: string;
  }
) => {
  return {
    type: "entry_function_payload",
    function: `${MARKET_ADDRESS}::marketplace::collection_offer`,
    type_arguments: [MARKET_COINT_TYPE],
    arguments: [
      MARKET_ADDRESS,
      MARKET_NAME,
      collectionItem?.collection?.token_data_id_creator,
      collectionItem?.collection?.token_data_id_collection,
      parseFloat(offer.amount),
      Math.round(parseFloat(offer.price) * 100000000),
      parseFloat(offer.expired),
    ],
  };
};


export const aptosClient = new AptosClient(APTOS_NODE_URL!);
export const tokenClient = new TokenClient(aptosClient);
export const coinClient = new CoinClient(aptosClient);
