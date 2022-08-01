import type { AppProps } from "next/app";

// import { Div } from '@flex-components/simple-components';
// import { useForm } from "react-hook-form";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
