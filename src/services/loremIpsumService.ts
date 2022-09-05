import axios from "axios";

const baseUrl = new URL("https://loripsum.net/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async (length: "short" | "medium" | "long") => {
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
