import React, { useState, useEffect, ChangeEventHandler } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";
import { RequestParameters } from "../../services/loremIpsumService";
import baconIpsumService from "../../services/baconIpsumService";

export interface GameMode {
    isLorem: boolean;
    isBacon: boolean;
}

const App = () => {
    const [text, setText] = useState("");
    const [gameMode, setGameMode] = useState<GameMode>({
        isLorem: true,
        isBacon: false,
    });
    const [theme, setTheme] = useState("lorem");
    const [requestParameters, setRequestParameters] =
        useState<RequestParameters>({
            isWithPunctuation: true,
            length: "short",
            meat: "all-meat",
        });

    useEffect(() => {
        if (gameMode.isLorem) {
            loremIpsumService
                .getParagraphs(requestParameters.length)
                .then((result) => {
                    if (requestParameters.isWithPunctuation) {
                        setText(result);
                    } else {
                        const newText = removePunctuation(result);
                        setText(newText);
                    }
                });
        }
        if (gameMode.isBacon) {
            baconIpsumService
                .getParagraphs(requestParameters.length, requestParameters.meat)
                .then((result) => {
                    if (requestParameters.isWithPunctuation) {
                        setText(result);
                    } else {
                        const newText = removePunctuation(result);
                        setText(newText);
                    }
                });
        }
    }, [requestParameters, gameMode]);

    const handleLengthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const length = target.value as RequestParameters["length"];
        setRequestParameters((prev) => ({ ...prev, length: length }));
    };

    const handlePunctuationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const punctuation = target.value;
        setRequestParameters((prev) => ({
            ...prev,
            isWithPunctuation: punctuation === "1",
        }));
    };
    const handleMeatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        const meat = target.value as RequestParameters["meat"];
        setRequestParameters((prev) => ({ ...prev, meat: meat }));
    };

    const removePunctuation = (text: string): string => {
        const regex = /([a-zA-Z]|\s)/g;
        const lowerCaseText = text.toLowerCase();
        const newText = lowerCaseText.match(regex)!.join("");
        return newText;
    };

    const changeToBacon = () => {
        setGameMode((prev) => ({ ...prev, isLorem: false, isBacon: true }));
        setTheme("bacon");
    };

    const changeToLorem = () => {
        setGameMode((prev) => ({ ...prev, isLorem: true, isBacon: false }));
        setTheme("lorem");
    };

    return (
        <div className="app" data-theme={theme}>
            <Header
                gameMode={gameMode}
                changeToBacon={changeToBacon}
                changeToLorem={changeToLorem}
            />

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
                        {gameMode.isBacon && (
                            <div className="options__group">
                                <select onChange={handleMeatChange}>
                                    <option value="all-meat">carnivore</option>
                                    <option value="meat-and-filler">
                                        omnivore
                                    </option>
                                </select>
                            </div>
                        )}
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
