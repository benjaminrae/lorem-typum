import React, { useState, useEffect, ChangeEventHandler } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";
import { length } from "../../services/loremIpsumService";

const App = () => {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(false);
    const [length, setLength] = useState<length>("short");
    const [isWithPunctuation, setIsWithPunctuation] = useState(true);

    useEffect(() => {
        loremIpsumService.getParagraphs(length).then((result) => {
            if (isWithPunctuation) {
                setText(result);
            } else {
                const newText = removePunctuation(result);
                setText(newText);
            }
        });
        setShowText(true);
    }, [isWithPunctuation, length]);

    const handleLengthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const length = target.value as length;
        setLength(length);
    };

    const handlePunctuationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const punctuation = target.value;
        setIsWithPunctuation(punctuation === "1");
    };

    const removePunctuation = (text: string): string => {
        const regex = /([a-zA-Z]|\s)/g;
        const lowerCaseText = text.toLowerCase();
        const newText = lowerCaseText.match(regex)!.join("");
        return newText;
    };
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
