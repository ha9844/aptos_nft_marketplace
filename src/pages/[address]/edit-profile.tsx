import CoverImageDropZone from "@/components/Utils/CoverImageDropZone";
import ImageDropZone from "@/components/Utils/ImageDropZone";
import { I_PROFILE } from "@/types/Profile";
import { API_ENDPOINT } from "@/utils/constants";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { pinToIpfs } from "@/utils/utils";
import { useVexpyStore } from "@/store";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

export default function Edit({ _profile }: { _profile: I_PROFILE }) {
  const router = useRouter();
  const address = router.query.address as string;
  const [imageObject, setImageObject] = useState<File | null>(null);
  const [profile, setProfile] = useState<I_PROFILE>(_profile);
  const [coverImageObject, setCoverImageObject] = useState<File | null>(null);
  const [isUpload1, setIsUpload1] = useState<boolean>(false);
  const [isUpload2, setIsUpload2] = useState<boolean>(false);
  const [isUpload3, setIsUpload3] = useState<boolean>(false);
  const [isUnique, setIsUnique] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean | undefined>(
    _profile.isVerifeid
  );
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const _setProfile = useVexpyStore((state) => state.setProfile);
  useEffect(() => {
    (async () => {
      if (imageObject) {
        setIsUpload1(true);
        const cid = await pinToIpfs(imageObject);
        setProfile({
          ...profile,
          avatarImage: `https://cloudflare-ipfs.com/ipfs/${cid}`,
        });
        let res = await axios.put(
          `${API_ENDPOINT}/profile/user?address=${address}`,
          {
            ...profile,
            avatarImage: `https://cloudflare-ipfs.com/ipfs/${cid}`,
          }
        );
        _setProfile(res.data);
        toast.success("Your picture have been updated!");
        setIsUpload1(false);
      }
    })();
  }, [imageObject]);

  useEffect(() => {
    (async () => {
      if (coverImageObject) {
        setIsUpload2(true);
        const cid = await pinToIpfs(coverImageObject);
        setProfile({
          ...profile,
          coverImage: `https://cloudflare-ipfs.com/ipfs/${cid}`,
        });

        let res = await axios.put(
          `${API_ENDPOINT}/profile/user?address=${address}`,
          {
            ...profile,
            coverImage: `https://cloudflare-ipfs.com/ipfs/${cid}`,
          }
        );
        _setProfile(res.data);
        toast.success("Your cover have been updated!");
        setIsUpload2(false);
      }
    })();
  }, [coverImageObject]);

  const updateProfile = async () => {
    if (isUpload1 || isUpload2) {
      toast.error("Please wait until image is uploaded!");
      return;
    }
    setIsUpload3(true);
    let res = await axios.put(
      `${API_ENDPOINT}/profile/user?address=${address}`,
      profile
    );
    _setProfile(res.data);
    toast.success("Successful Updated!");
    setIsUpload3(false);
  };

  const emailVerification = async () => {
    setIsCodeOpen(!isCodeOpen);

    await axios.put(`${API_ENDPOINT}/profile/user?address=${address}`, {
      ...profile,
    });
    await axios.get(
      `${API_ENDPOINT}/profile/email?email=${profile.email}&address=${address}`
    );
    toast.success("Verification code have been sent to your Email!");
    const res = await axios.get(
      `${API_ENDPOINT}/profile/user?address=${address}`
    );
    setProfile(res.data);
  };
  const submitCode = async () => {
    if (code == profile.code) {
      setVerified(true);
      await axios.put(`${API_ENDPOINT}/profile/user?address=${address}`, {
        ...profile,
        isVerifeid: true,
      });
      setIsCodeOpen(!isCodeOpen);
    } else {
      setVerified(false);
    }
  };
  const updateName = async (e: any) => {
    setProfile({
      ...profile,
      name: e.target.value,
    });
    const res = await axios.get(
      `${API_ENDPOINT}/profile/user?name=${e.target.value}`
    );
    if (res.data) {
      setIsUnique(true);
    } else {
      setIsUnique(false);
    }
  };

  return (
    <>
      <Head>
        <title>Top NFT Collections - Vexpy</title>
        <meta property="og:title" content="Top NFT Collections - Vexpy" />
        <meta
          property="og:description"
          content="Browse top aptos NFTs on vexpy.com."
        />
        <meta name="twitter:site" content="@vexpy_com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        <CoverImageDropZone
          imageObject={coverImageObject}
          setImageObject={setCoverImageObject}
          imageUri={profile.coverImage}
          isLoad={isUpload2}
        />
        <div className="max-w-[768px] px-4 md:px-0 mx-auto py-16 ">
          <div>
            <div className="flex gap-2 items-center">
              <BsArrowLeftCircleFill
                className="hover:text-gray-500 hover:cursor-pointer"
                onClick={() => router.back()}
              />
              <div className="text-3xl font-bold">Profile Settings</div>
            </div>
            <div className="py-2">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </div>
          </div>
          <div className="border-b my-12"></div>
          <div className="flex gap-8 pb-16 flex-col sm:flex-row">
            <div className="mx-8 flex justify-center sm:block">
              <ImageDropZone
                imageObject={imageObject}
                setImageObject={setImageObject}
                imageUri={profile.avatarImage}
                isLoad={isUpload1}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.name}
                  onChange={(e) => updateName(e)}
                  className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                />
                {isUnique && (
                  <div className="text-sm text-red-600">
                    Invalid username. The username is already taken.
                  </div>
                )}

                {/\s/.test(profile?.name) && (
                  <div className="text-sm text-red-600">
                    The username should not contain spaces.
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="bio">Bio</label>
                <textarea
                  name="bio"
                  value={profile?.bio}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      bio: e.target.value,
                    })
                  }
                  className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                />
              </div>
              {isCodeOpen ? (
                <div>
                  <div className="flex flex-col relative">
                    <label htmlFor="code">Verified Code</label>
                    <input
                      type="text"
                      name="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                    />
                    <div
                      className="text-xs absolute right-4 bottom-5 hover:text-[#40a789] hover:cursor-pointer"
                      onClick={() => submitCode()}
                    >
                      Submit
                    </div>
                  </div>
                  {!verified && (
                    <div className="text-xs text-red-600 -mt-2">
                      Wrong code!
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col relative">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile?.email}
                    disabled={profile.isVerifeid}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                    className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                  />
                  {verified ? (
                    <div className="text-xs absolute right-4 bottom-5 text-[#40a789]">
                      Verified
                    </div>
                  ) : (
                    <div
                      className="text-xs absolute right-4 bottom-5 hover:text-[#40a789] hover:cursor-pointer"
                      onClick={() => emailVerification()}
                    >
                      Verify
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="name">Website</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.website}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      website: e.target.value,
                    })
                  }
                  className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">Twitter</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.twitter}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      twitter: e.target.value,
                    })
                  }
                  className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">Instagram</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.instagram}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      instagram: e.target.value,
                    })
                  }
                  className="my-2 text-xl px-4 py-1 dark:bg-[#292524] border-2 dark:border-[#44403C] rounded-full outline-none"
                />
              </div>
              <button
                className="bg-[#63C3A7] hover:bg-[#40a789] py-2 rounded-full flex items-center justify-center"
                onClick={() => updateProfile()}
                // disabled={isUpload}
              >
                {isUpload3 && <span className="loader mr-2" />}
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({
  query,
}: {
  query: { address: string };
}) {
  const res = await axios.get(
    `${API_ENDPOINT}/profile/user?address=${query.address}`
  );
  let _profile = res.data;
  return { props: { _profile } };
}
