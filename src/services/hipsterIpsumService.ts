import axios from "axios";

import { RequestParameters } from "./loremIpsumService";

const baseUrl = new URL("http://hipsum.co/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async (
    length: RequestParameters["length"],
    hipster: RequestParameters["hipster"]
) => {
    let paragraphs;
    switch (length) {
        case "short":
            paragraphs = 1;
            break;
        case "medium":
            paragraphs = 2;
            break;
        case "long":
            paragraphs = 3;
            break;
        default:
            paragraphs = 1;
            break;
    }
    const request = axios.get(
        `${corsProxyUrl}${baseUrl}/?type=${hipster}&paras=${paragraphs}&start-with-lorem=1`
    );
    return await request
        .then((response: { data: string[] }) => {
            return response.data.join(" ");
        })
        .catch((error: string) => {
            return error;
        });
};
getParagraphs("long", "hipster-centric");
const hipsterIpsumService = {
    getParagraphs,
};
export default hipsterIpsumService;
