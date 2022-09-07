import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";
import { RequestParameters } from "../../services/loremIpsumService";
import baconIpsumService from "../../services/baconIpsumService";
import hipsterIpsumService from "../../services/hipsterIpsumService";

export interface GameMode {
    isLorem: boolean;
    isBacon: boolean;
    isHipster: boolean;
    isPirate: boolean;
    isNew: boolean;
}

const App = () => {
    const [text, setText] = useState("");
    const [gameMode, setGameMode] = useState<GameMode>({
        isLorem: true,
        isBacon: false,
        isHipster: false,
        isPirate: false,
        isNew: false,
    });
    const [theme, setTheme] = useState("lorem");
    const [requestParameters, setRequestParameters] =
        useState<RequestParameters>({
            isWithPunctuation: true,
            length: "short",
            meat: "all-meat",
            hipster: "hipster-centric",
        });

    useEffect(() => {
        if (gameMode.isNew) {
            return;
        }
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
        if (gameMode.isHipster) {
            hipsterIpsumService
                .getParagraphs(
                    requestParameters.length,
                    requestParameters.hipster
                )
                .then((result) => {
                    if (requestParameters.isWithPunctuation) {
                        setText(result);
                    } else {
                        const newText = removePunctuation(result);
                        setText(newText);
                    }
                });
        }
        setGameMode((prev) => ({ ...prev, isNew: true }));
        // handleNewGameChange();
    }, [requestParameters, gameMode]);

    const handleLengthChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const length = target.value as RequestParameters["length"];
        setRequestParameters((prev) => ({ ...prev, length: length }));
        setGameMode((prev) => ({ ...prev, isNew: false }));
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
        setGameMode((prev) => ({ ...prev, isNew: false }));
    };
    const handleMeatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        const meat = target.value as RequestParameters["meat"];
        setRequestParameters((prev) => ({ ...prev, meat: meat }));
        setGameMode((prev) => ({ ...prev, isNew: false }));
    };
    const handleHipsterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { target } = event;
        const hipster = target.value as RequestParameters["hipster"];
        setRequestParameters((prev) => ({ ...prev, hipster: hipster }));
        setGameMode((prev) => ({ ...prev, isNew: false }));
    };

    const removePunctuation = (text: string): string => {
        const regex = /([a-zA-Z]|\s)/g;
        const lowerCaseText = text.toLowerCase();
        const newText = lowerCaseText.match(regex)!.join("");
        return newText;
    };

    const changeToBacon = () => {
        setGameMode((prev) => ({ ...prev, isNew: false }));
        setGameMode((prev) => ({
            ...prev,
            isLorem: false,
            isBacon: true,
            isHipster: false,
        }));
        setTheme("bacon");
    };

    const changeToLorem = () => {
        setGameMode((prev) => ({ ...prev, isNew: false }));
        setGameMode((prev) => ({
            ...prev,
            isLorem: true,
            isBacon: false,
            isHipster: false,
        }));
        setTheme("lorem");
    };
    const changeToHipster = () => {
        setGameMode((prev) => ({ ...prev, isNew: false }));
        setGameMode((prev) => ({
            ...prev,
            isLorem: false,
            isBacon: false,
            isHipster: true,
        }));
        setTheme("hipster");
    };

    const handleNewGameChange = () => {
        setGameMode((prev) => ({ ...prev, isNew: false }));
    };

    return (
        <div className="app" data-theme={theme}>
            <Header
                gameMode={gameMode}
                changeToBacon={changeToBacon}
                changeToLorem={changeToLorem}
                changeToHipster={changeToHipster}
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
                        {gameMode.isHipster && (
                            <div className="options__group">
                                <select onChange={handleHipsterChange}>
                                    <option value="hipster-centric">
                                        full hipster
                                    </option>
                                    <option value="hipster-latin">
                                        half hipster
                                    </option>
                                </select>
                            </div>
                        )}
                    </div>
                </section>
                <section className="">
                    {/* <button onClick={handleStartClick}>Start</button> */}
                    <TypingField
                        typingText={text}
                        gameMode={gameMode}
                        handleNewGameChange={handleNewGameChange}
                    />
                </section>
            </div>
        </div>
    );
};

export default App;
