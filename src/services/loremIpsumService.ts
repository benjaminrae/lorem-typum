import axios from "axios";

export interface RequestParameters {
    isWithPunctuation: boolean;
    length: "short" | "medium" | "long";
    meat: "all-meat" | "meat-and-filler";
    hipster: "hipster-centric" | "hipster-latin";
}

const baseUrl = new URL("https://loripsum.net/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async (length: RequestParameters["length"]) => {
    const request = axios.get(
        `${corsProxyUrl}${baseUrl}/1/${length}/plaintext`
    );
    return await request
        .then((response: { data: string }) => {
            return response.data.trimEnd();
        })
        .catch((error: string) => {
            return error;
        });
};

const loremIpsumService = {
    getParagraphs,
};
export default loremIpsumService;
