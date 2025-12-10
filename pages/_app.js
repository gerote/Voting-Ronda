import "../styles/globals.css";
import { SWRConfig } from "swr";
import fetcher from "../utils/fetcher";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
