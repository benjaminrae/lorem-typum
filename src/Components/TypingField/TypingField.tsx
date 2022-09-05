import "./TypingField.css";
import { useState, useEffect, useRef } from "react";

type TypingFieldProps = {
    typingText: string;
};

interface letter {
    character: string;
    isCurrent: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
}

type word = letter[];

type typingData = word[];

const TypingField = ({ typingText }: TypingFieldProps) => {
    const [typingData, setTypingData] = useState<typingData | null>([]);
    const [typingInput, setTypingInput] = useState("");
    const [showTypingInput, setShowTypingInput] = useState(false);
    const wordInput = useRef<null | HTMLInputElement>(null);
    // console.log(wordInput);

    // useEffect(() => {
    //     console.log(document.activeElement);
    //     setShowTypingInput(document.activeElement === wordInput.current);
    // }, [wordInput]);

    useEffect(() => {
        if (!typingData) {
            return;
        }
        const typingTextWords = typingText.split(" ");
        typingTextWords[1] = "typum";
        const typingTextWordsAndLetters = typingTextWords.map(
            (word, wordIndex) => {
                const splitWord = word.split("").map((letter, letterIndex) => {
                    return {
                        character: letter,
                        isCurrent: wordIndex === 0 && letterIndex === 0,
                        isCorrect: false,
                        isIncorrect: false,
                    };
                });
                return splitWord;
            }
        );

        setTypingData(typingTextWordsAndLetters);
    }, [typingText]);

    useEffect(() => {
        if (!typingInput) {
            return;
        }
        if (typingData === null) {
            return;
        }
        const typingInputWords = typingInput.split(" ");
        let newTypingData = [...typingData];
        typingInputWords.forEach((word, wordIndex) => {
            word.split("").forEach((letter, letterIndex) => {
                if (
                    typingInputWords[wordIndex][letterIndex] ===
                    typingData[wordIndex][letterIndex].character
                ) {
                    newTypingData[wordIndex][letterIndex].isCorrect = true;
                }
                if (
                    typingInputWords[wordIndex][letterIndex] !==
                    typingData[wordIndex][letterIndex].character
                ) {
                    newTypingData[wordIndex][letterIndex].isIncorrect = true;
                }
                newTypingData = newTypingData.map((word) => {
                    return word.map((letter) => {
                        letter.isCurrent = false;
                        return letter;
                    });
                });
                if (typingData[wordIndex][letterIndex + 1]) {
                    newTypingData[wordIndex][letterIndex + 1].isCurrent = true;
                } else {
                    newTypingData[wordIndex + 1][0].isCurrent = true;
                }
                setTypingData(newTypingData);
            });
        });
    }, [typingInput]);

    const handleKeyPress = (event: any) => {
        // console.log(event.key);
        return event;
    };

    const handleTypingInputChange = (event: any) => {
        setTypingInput(event.target.value);
    };

    const handleTypingFieldClick = (event: any) => {
        if (wordInput.current !== null) {
            wordInput.current.focus();
        }
    };

    const handleInputOnFocus = () => {
        setShowTypingInput(true);
    };

    const handleInputOnBlur = () => {
        setShowTypingInput(false);
    };

    return (
        <section
            className={
                showTypingInput ? "typing-field" : "typing-field--blurred"
            }
            onClick={handleTypingFieldClick}
        >
            {!showTypingInput && (
                <div className="typing-field__focus-warning">
                    Click to continue
                </div>
            )}
            <div
                className={
                    showTypingInput
                        ? "typing-field__input"
                        : "typing-field__input--blurred"
                }
            >
                <input
                    // onKeyDown={handleKeyPress}
                    tabIndex={0}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    className="input__input"
                    value={typingInput}
                    onChange={handleTypingInputChange}
                    ref={wordInput}
                    onFocus={handleInputOnFocus}
                    onBlur={handleInputOnBlur}
                />
                {/* <input id="wordsInput" class="" tabindex="0" autocomplete="off" autocapitalize="off" autocorrect="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" list="autocompleteOff" /> */}
                {typingData &&
                    typingData.map((word, index) => {
                        return (
                            <div className="input__word" key={index}>
                                {word.map((letter, index) => (
                                    <>
                                        <div
                                            key={index}
                                            className={
                                                letter.isCorrect
                                                    ? "word__character--correct"
                                                    : letter.isIncorrect
                                                    ? "word__character--incorrect"
                                                    : "word__character"
                                            }
                                            onKeyDown={handleKeyPress}
                                        >
                                            {letter.isCurrent && (
                                                <div className="word__position-marker"></div>
                                            )}
                                            {letter.character}
                                        </div>
                                    </>
                                ))}
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};

export default TypingField;
