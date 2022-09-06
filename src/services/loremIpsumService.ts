import axios from "axios";

export type length = "short" | "medium" | "long";

const baseUrl = new URL("https://loripsum.net/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async (length: length) => {
    const request = axios.get(
        `${corsProxyUrl}${baseUrl}/1/${length}/plaintext`
    );
    return await request
        .then((response: { data: string }) => {
            return response.data;
        })
        .catch((error: string) => {
            return error;
        });
};

const loremIpsumService = {
    getParagraphs,
};
export default loremIpsumService;
