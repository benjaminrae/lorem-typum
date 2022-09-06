import axios from "axios";

import { RequestParameters } from "./loremIpsumService";
// https://baconipsum.com/api/?type=meat-and-filler
// https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1
// https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=1
// https://baconipsum.com/api/?type=meat-and-filler&paras=5&format=text
// https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=html

const baseUrl = new URL("https://baconipsum.com/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async (
    length: RequestParameters["length"],
    meat: RequestParameters["meat"]
) => {
    let sentences;
    switch (length) {
        case "short":
            sentences = 5;
            break;
        case "medium":
            sentences = 10;
            break;
        case "long":
            sentences = 20;
            break;
        default:
            sentences = 5;
            break;
    }
    const request = axios.get(
        `${corsProxyUrl}${baseUrl}/?type=${meat}&sentences=${sentences}&start-with-lorem=1&format=text`
    );
    return await request
        .then((response: { data: string }) => {
            return response.data;
        })
        .catch((error: string) => {
            return error;
        });
};

const baconIpsumService = {
    getParagraphs,
};
export default baconIpsumService;
