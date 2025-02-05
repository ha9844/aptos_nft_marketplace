import { useEffect, useState } from "react";
import { auth } from "@/utils/firebaseSetup";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useTheme } from "next-themes";

export default function Login() {
  const router = useRouter();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const { theme } = useTheme();
  const [userInfo, setUserInfo] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const signin = () => {
    setIsLoad(false);

    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        setIsLoad(true);
        router.push("/admin");
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
      <main className="h-[calc(100vh-192px)] flex items-center ">
        <div className="w-[500px] mx-auto rounded-xl">
          <div className="text-2xl text-center pb-4">Sign in to Admin Page</div>
          <div className="dark:bg-[#1C1917] dark:text-gray-200 p-8 flex flex-col gap-6 border border-[#44403C] rounded-xl">
            <div className="text-lg flex flex-col w-full gap-2">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                value={userInfo?.email}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    email: e.target.value,
                  })
                }
                className="px-4 py-1 bg-[#121212] outline-none border rounded border-[#44403C]"
              />
            </div>
            <div className="text-lg flex flex-col w-full gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={userInfo?.password}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    password: e.target.value,
                  })
                }
                className="px-4 py-1 bg-[#121212] outline-none border rounded border-[#44403C]"
              />
            </div>
            {isLoad ? (
              <button className="hover:bg-[#63C3A7] bg-[#40a789] py-2 rounded mt-4 flex justify-center items-center gap-2">
                <span className="loader"></span>
                Signing...
              </button>
            ) : (
              <button
                className="hover:bg-[#63C3A7] bg-[#40a789] py-2 rounded mt-4"
                onClick={() => signin()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
