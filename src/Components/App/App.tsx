import React, { useState } from "react";
import "./App.css";
import Header from "../Header/Header";
import loremIpsumService from "../../services/loremIpsumService";
import TypingField from "../TypingField/TypingField";
const App = () => {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(false);

    const handleStartClick = () => {
        loremIpsumService
            .getParagraphs(1, "short")
            .then((result) => setText(result));
        setShowText(true);
    };

    return (
        <>
            <Header />
            <section className="app"></section>
            <button onClick={handleStartClick}>Start</button>
            <TypingField typingText={text} />
        </>
    );
};

export default App;
