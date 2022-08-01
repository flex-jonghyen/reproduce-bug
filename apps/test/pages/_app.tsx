import type { AppProps } from "next/app";

import { DoubleButton } from "@flex-components/complex-components";
import { Button, Div } from "@flex-components/simple-components";
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
