import { I_PROFILE } from "@/types/Profile";
import { API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { Auth, signOut, getAuth } from "firebase/auth";
import { auth } from "@/utils/firebaseSetup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Admin({ _profile }: { _profile: I_PROFILE[] }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const logOut = async (auth: Auth) => {
    await signOut(auth);
    router.push("/");
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user == null) {
      router.push("/login");
    } else {
      setIsLogin(false);
    }
  }, [router]);
  return isLogin ? (
    <div className="h-screen flex justify-center items-center">
      <div className="loader"></div>
    </div>
  ) : (
    <>
      <main className="max-w-[1500px] mx-auto" >
        <div className="flex justify-end p-4">
          <FaSignOutAlt
            className="text-3xl hover:text-gray-400"
            onClick={() => logOut(auth)}
          />
        </div>
        <div className="text-3xl text-center py-4">User</div>
        <div>
          <div className="grid grid-cols-7 text-center">
            <div>Address</div>
            <div>Name</div>
            <div>Bio</div>
            <div>Email</div>
            <div>Website</div>
            <div>Twitter</div>
            <div>Instagra</div>
          </div>
          <div className="w-full">
            {_profile?.map((item: I_PROFILE, index: number) => (
              <div className="grid grid-cols-7 text-center w-full" key={index}>
                <div>{item.address?.slice(-5)}</div>
                <div>{item.name}</div>
                <div>{item.bio}</div>
                <div>{item.email}</div>
                <div>{item.website}</div>
                <div>{item.twitter}</div>
                <div>{item.instagram}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  const res = await axios.get(`${API_ENDPOINT}/profile/users`);
  let _profile = res.data;
  return { props: { _profile } };
}
