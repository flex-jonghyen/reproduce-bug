import type { AppProps } from "next/app";

import { Div, Button } from "@flex-components/simple-components";
import { DoubleButton } from "@flex-components/complex-components";
import { useForm } from "react-hook-form";

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useForm();
  return (
    <div>
      <Component {...pageProps} />
      <Div>
        <Button>123</Button>
      </Div>
      <DoubleButton />
    </div>
  );
}

export default MyApp;
