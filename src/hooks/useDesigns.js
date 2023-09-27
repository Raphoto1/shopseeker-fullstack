//imports de app
import useSWR from "swr";

export const fetcher = async (...args) => await fetch(...args).then((res) => res.json());

export const useDesigns = async () => {
  const urlPath = `/api/design`;
  const { data, error, isLoading } = await useSWR(urlPath, fetcher);
  console.log(data);
  return {
    data: data,
    error: error,
    isLoading: isLoading,
  };
};

export const useFavoriteDesigns = async () => {
  console.log("entro al fetcher");
  const urlPath = `/api/design?sortField=likes&sortQ=-1&limit=2`;
    const { data, error, isLoading } = await useSWR(urlPath, fetcher);
    console.log(`desde use ${data.payload.docs}`);
  return { data: data.payload.docs, error: error, isLoading: isLoading };
};

export const testFav = () => {
  return new Promise((resolve, reject) => {
    const urlPath = `/api/design?sortField=likes&sortQ=-1&limit=2`;
    const { data, error, isLoading } = useSWR(urlPath, fetcher)
    console.log(data);
    resolve(data)
  })
}