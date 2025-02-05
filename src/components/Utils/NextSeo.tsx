import Head from "next/head";
export default function NextSeo({
  metaTags,
}: {
  metaTags: {
    title: string;
    ogTitle: string;
    ogDescription: string;
    twitterSite: string;
    twitterCard: string;
  };
}) {
  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta property="og:title" content={metaTags.ogTitle} />
        <meta property="og:description" content={metaTags.ogDescription} />
        <meta name="twitter:site" content={metaTags.twitterSite} />
        <meta name="twitter:card" content={metaTags.twitterCard} />
      </Head>
    </>
  );
}
