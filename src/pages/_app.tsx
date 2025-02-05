import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useMemo, useState } from "react";
import dynamic from 'next/dynamic';

import { useRouter } from "next/router";

import {
  PontemWalletAdapter,
  MartianWalletAdapter,
  AptosWalletAdapter,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";

import { ModalContext, ModalState } from "@/components/Navbar/ModalContext";
import { ThemeProvider } from "next-themes";


const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>({
    walletModal: false,
  });
  const wallets = useMemo(
    () => [
      new MartianWalletAdapter(),
      new AptosWalletAdapter(),
      new PontemWalletAdapter(),
    ],
    []
  );
  const modals = useMemo(
    () => ({
      modalState,
      setModalState: (modalState: ModalState) => {
        setModalState(modalState);
      },
    }),
    [modalState]
  );

  return (
    <WalletProvider
      wallets={wallets}
      autoConnect={false}
    >
      <ModalContext.Provider value={modals}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Navbar />
          <Component {...pageProps} />
          {!router.pathname.includes("/collection/") && <Footer />}
        </ThemeProvider>
      </ModalContext.Provider>
    </WalletProvider>
  );
}
