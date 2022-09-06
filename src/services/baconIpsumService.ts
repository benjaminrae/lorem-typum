import axios from "axios";

// https://baconipsum.com/api/?type=meat-and-filler
// https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1
// https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=1
// https://baconipsum.com/api/?type=meat-and-filler&paras=5&format=text
// https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=html

const baseUrl = new URL("https://loripsum.net/api");
const corsProxyUrl = new URL("https://wonderfulcorsproxy.herokuapp.com/");
const getParagraphs = async () => {
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

const baconIpsumService = {
    getParagraphs,
};
export default baconIpsumService;
