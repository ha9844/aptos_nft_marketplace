import Owned from "./Owned";
import ActiveOffer from "./ActiveOffer";
import { useRouter } from "next/router";
import ExpiredOffer from "./ExpiredOffer";
import ReceivedOffer from "./ReceivedOffer";
const ProfileTabs = () => {
  const router = useRouter();

  let tab = router.query.tab as string;
  return (
    <>
      {tab == "collected" && <Owned />}
      {tab == "activeoffer" && <ActiveOffer />}
      {tab == "expiredoffer" && <ExpiredOffer />}
      {tab == "receivedoffer" && <ReceivedOffer />}
    </>
  );
};

export default ProfileTabs;
