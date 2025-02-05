import { create } from "zustand";
import { I_PROFILE } from "@/types/Profile";
import axios from "axios";
import { API_ENDPOINT } from "@/utils/constants";
import { I_CollectionData } from "@/types/Offer";
import { IData } from "@/types/Collection";

interface IVexpyState {
  profile: I_PROFILE;
  tokenData: any[];
  collection: I_CollectionData;
  setProfile: { (_profile: I_PROFILE): void };
  setCollection: { (_collection: I_CollectionData): void };
  fetchProfile: { (address: string): void };
  fetchTokens: {
    (address: string, currentPage: number, pageSize: number): Promise<
      IData<any>
    >;
  };
}
export const useVexpyStore = create<IVexpyState>((set, get) => ({
  profile: {
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
  },
  tokenData: [{}],
  collection: {
    collection: 
      {
        collection: "",
        property_version: "",
        token_data_id_collection: "",
        token_data_id_creator: "",
        token_data_id_name: "",
        volume: 0,
        supply: 0,
        listed: 0,
        owner: 0,
        floor: 0,
        slug: "",
        royalty: 0,
        image_uri: "",
        description: "",
        metadata_uri: "",
        creator: "",
        symbol: "",
        website: "",
        email: "",
        twitter: "",
        discord: "",
        telegram: "",
        github: "",
        instagram: "",
        medium: "",
        logo_url: "",
        banner_url: "",
        featured_url: "",
        large_image_url: "",
        attributes: "",
        create_tx_version: 0,
        verified: false,
        items_total: 0,
        owners_total: 0,
        topoffer: 0,
        sales_24h: 0,
      },
    items: [],
    slug: "",
    metadata: {},
  },
  setProfile: (_profile: I_PROFILE) => {
    set((state: any) => ({ ...state, profile: _profile }));
  },

  setCollection: (_collection: I_CollectionData) => {
    set((state: any) => ({ ...state, collection: _collection }));
  },

  fetchProfile: async (address: string) => {
    const res = await axios.get(
      `${API_ENDPOINT}/profile/user?address=${address}`
    );
    set((state: any) => ({ ...state, profile: res.data }));
  },

  fetchTokens: async (
    address: string,
    currentPage: number,
    pageSize: number
  ): Promise<IData<any>> => {
    const response = await axios(
      `${API_ENDPOINT}/market/collected/${address}?page=${currentPage}&pageSize=${pageSize}&slug=`
    );

    set((state: any) => ({ ...state, tokenData: response.data?.items }));
    return response.data;
  },
}));
