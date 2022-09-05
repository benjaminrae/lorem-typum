import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";

type length = "short" | "medium" | "long";

const App = () => {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(false);
    const [length, setLength] = useState<length>("short");
    const [isWithPunctuation, setIsWithPunctuation] = useState(true);

    useEffect(() => {
        console.log(length, "len/paras");
        loremIpsumService
            .getParagraphs(length)
            .then((result) => setText(result));
        setShowText(true);
        const regex = /([a-zA-Z]|\s)/g;
        if (!isWithPunctuation) {
            const lowerCaseText = text.toLowerCase();
            const newText = lowerCaseText.match(regex)?.join("");
            if (typeof newText === "string") {
                setText(newText);
            }
        }
    }, [isWithPunctuation, length]);

    const handleLengthChange = (event: any) => {
        setLength(event.target.value);
    };

    const handlePunctuationChange = (event: any) => {
        setIsWithPunctuation(event.target.value === 1);
    };

    const removePunctuation = () => {};
    return (
        <div className="app">
            <Header />

            <div className="app__main-container">
                <section className="main-container__options">
                    <div className="options__title"> Paragraphs:</div>
                    <div className="options__groups">
                        <div className="options__group">
                            <select onChange={handleLengthChange}>
                                <option value="short">short</option>
                                <option value="medium">medium</option>
                                <option value="long">long</option>
                            </select>
                        </div>
                        <div className="options__group">
                            <select onChange={handlePunctuationChange}>
                                <option value={1}>with punctuation</option>
                                <option value={0}>no punctuation</option>
                            </select>
                        </div>
                    </div>
                </section>
                <section className="">
                    {/* <button onClick={handleStartClick}>Start</button> */}
                    <TypingField typingText={text} />
                </section>
            </div>
        </div>
    );
};

export default App;
