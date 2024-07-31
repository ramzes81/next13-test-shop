import isomorphicFetch from "isomorphic-unfetch";

export default async function fetch<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await isomorphicFetch(input, init);
  return res.json();
}
