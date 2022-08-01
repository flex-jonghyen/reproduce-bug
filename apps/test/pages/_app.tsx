import type { AppProps } from "next/app";

import { Div } from "@flex-components/simple-components";
import { useForm } from "react-hook-form";

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useForm();
  return (
    <div>
      <Component {...pageProps} />
      <Div />
    </div>
  );
}

export default MyApp;
