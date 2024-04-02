import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Head from "next/head";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Platella</title>
        <meta
          name="title"
          content="Platella: Revolutionize Your Cooking Experience with Interactive Recipes & Cookbooks"
        />
        <meta
          name="description"
          content="Discover Platella, the ultimate recipe web app/PWA for food enthusiasts. Create cookbooks, manage grocery lists, share recipes, and explore our unique UX for asynchronous cooking steps"
        />
        <meta
          name="keywords"
          content="Platella, recipe app, cooking web app, cookbooks, online recipes, grocery list, recipe sharing, cooking UX, food app, meal planning"
        />
        <link rel="shortcut icon" href="/iconx/favicon.ico" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://platella.vercel.app" />
        <meta name="twitter:title" content="Platella" />
        <meta
          name="twitter:description"
          content="Rethinking the UX of digitized recipes"
        />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Platella" />
        <meta
          property="og:description"
          content="Rethinking the UX of digitized recipes!"
        />
        <meta property="og:site_name" content="Platella" />
        <meta property="og:url" content="https://platella.vercel.app" />
        <meta property="og:image" content="/icons/og.png" />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <SessionProvider session={session}>
        <main
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            inter.variable,
          )}
        >
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
