// @ts-ignore
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN! });

export const useWeb3Storage = () => ({
  async storeAsJson(content: any, fileName: string): Promise<string> {
    if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) {
      throw new Error("Web3storage token not defined");
    }

    const stringifiedContent = JSON.stringify(content);
    const file = new File([stringifiedContent], fileName, { type: "application/json" });
    return client.put([file], { wrapWithDirectory: false });
  },

  async storeImage(file: File): Promise<string> {
    if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) {
      throw new Error("Web3storage token not defined");
    }

    return client.put([file], { wrapWithDirectory: false });
  },

  async getJson<T>(cid: string): Promise<T> {
    console.log(`Fetching ${cid} from IPFS`);
    const res = await fetch(`https://${cid}.ipfs.dweb.link`);
    if (!res || !res.ok) {
      throw new Error(`Error getting cid ${cid}: [${res?.status}] ${res?.statusText}`);
    }
    return res.json();
  },
});
