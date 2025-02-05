import { useEffect, useState } from "react";
import { Offer } from "../types/Offer";
import { API_ENDPOINT } from "../utils/constants";

export function useOffers(): {
  offers: Offer[];
  loading: boolean;
} {
  const [offers, updateOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch(`${API_ENDPOINT}/market/fetch`);
      const offers = (await response.json()).map((i: Offer) => i as Offer);
      updateOffers(offers);
      setLoading(false);
    };
    fetchOffers();
  }, []);
  return { offers, loading };
}
