import axios from "axios";

const nuxtconfig = useRuntimeConfig();

const username = nuxtconfig.wordpressUserName;
const token = nuxtconfig.wordpressAuthToken;

const credentials = Buffer.from(`${username}:${token}`).toString("base64");

const defaultConfig = {
    baseURL: nuxtconfig.wordpressURL,
    timeout: 10000,
    headers: {
        Authorization: "Basic " + credentials,
        "Content-Type": "application/json",
    },
};

// 直接创建并导出实例
const useWP = axios.create(defaultConfig);

export default useWP;
