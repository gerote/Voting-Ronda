import axios from "axios";
export default async function fetcher(url) {
  const res = await axios.get(url, { timeout: 7000 });
  return res.data;
}
