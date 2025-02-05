import Listed from "./Listed";
import Activity from "./Activity";

import { useRouter } from "next/router";
import OfferTab from "./OfferTab";
import AnalyseTab from "./AnalyseTab";
const CollectionTabs = (collection: any) => {
  const router = useRouter();

  let tab = router.query.tab as string;
  return (
    <>
      {tab == "listed" && <Listed _collection={collection} />}
      {tab == "activity" && <Activity />}
      {/* {tab == "offers" && <OfferTab />} */}
      {tab == "analyse" && <AnalyseTab />}
    </>
  );
};

export default CollectionTabs;
