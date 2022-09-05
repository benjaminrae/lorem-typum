import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";
const App = () => {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        loremIpsumService
            .getParagraphs(1, "short")
            .then((result) => setText(result));
        setShowText(true);
    }, []);

    // const handleStartClick = () => {};

    return (
        <div className="app">
            <Header />

            <div className="app__main-container">
                <section className="">
                    {/* <button onClick={handleStartClick}>Start</button> */}
                    <TypingField typingText={text} />
                </section>
            </div>
        </div>
    );
};

export default App;
