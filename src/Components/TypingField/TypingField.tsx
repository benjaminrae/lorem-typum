import "./TypingField.css";
import React, { useState, useEffect, useRef } from "react";

type TypingFieldProps = {
    typingText: string;
};

interface letter {
    character: string;
    isCurrent: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    isDeleted?: boolean;
    isCorrected?: boolean;
    isExtra?: boolean;
}

type word = letter[];

type typingData = word[];

const TypingField = ({ typingText }: TypingFieldProps) => {
    const [typingData, setTypingData] = useState<typingData | null>([]);
    const [typingInput, setTypingInput] = useState("");
    const [showTypingInput, setShowTypingInput] = useState(false);
    const wordInput = useRef<null | HTMLInputElement>(null);
    const currentLetter = useRef<null | HTMLDivElement>(null);

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
                if (letterIndex >= typingData[wordIndex].length) {
                    console.log("too may letters");
                    newTypingData = removeCursors(newTypingData);

                    const newLetter: letter = {
                        character: typingInputWords[wordIndex][letterIndex],
                        isCurrent: true,
                        isCorrect: false,
                        isIncorrect: true,
                        isExtra: true,
                    };
                    newTypingData[wordIndex].push(newLetter);
                    setTypingData(newTypingData);
                    return;
                }
                if (typingData[wordIndex][letterIndex].isCurrent) {
                    newTypingData = newTypingData.map((word, newWordIndex) => {
                        return word.map((letter, newLetterIndex) => {
                            if (wordIndex !== newWordIndex) {
                                return letter;
                            }
                            if (!letter.isExtra) {
                                return letter;
                            }
                            if (
                                letter.isExtra &&
                                letterIndex >= newLetterIndex
                            ) {
                                console.log(letterIndex, newLetterIndex);
                                letter.isDeleted = false;
                                return letter;
                            } else {
                                letter.isDeleted = true;
                                console.log("delete");
                                return letter;
                            }
                        });
                    });
                    setTypingData(newTypingData);
                }
                if (
                    typingInputWords[wordIndex][letterIndex] ===
                        typingData[wordIndex][letterIndex].character &&
                    !typingData[wordIndex][letterIndex].isExtra
                ) {
                    newTypingData[wordIndex][letterIndex].isCorrect = true;
                }
                if (
                    typingInputWords[wordIndex][letterIndex] !==
                        typingData[wordIndex][letterIndex].character &&
                    !typingData[wordIndex][letterIndex].isExtra
                ) {
                    newTypingData[wordIndex][letterIndex].isIncorrect = true;
                }
                newTypingData = removeCursors(newTypingData);
                if (typingData[wordIndex][letterIndex + 1]) {
                    newTypingData[wordIndex][letterIndex + 1].isCurrent = true;
                } else {
                    newTypingData[wordIndex + 1][0].isCurrent = true;
                }
                if (currentLetter.current) {
                    currentLetter.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
                setTypingData(newTypingData);
            });
        });
    }, [typingInput]);

    useEffect(() => {
        if (currentLetter.current) {
            currentLetter.current.scrollIntoView();
        }
    }, []);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
        }
        // console.log(event);
        return event;
    };

    const handleTypingInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { target } = event;
        setTypingInput(target.value);
    };

    const handleTypingFieldClick = (event: React.MouseEvent) => {
        if (wordInput.current !== null) {
            wordInput.current.focus();
        }
    };

    const handleInputOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setShowTypingInput(true);
    };

    const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setShowTypingInput(false);
    };

    const removeCursors = (newTypingData: word[]) => {
        return newTypingData.map((word) => {
            return word.map((letter) => {
                letter.isCurrent = false;
                return letter;
            });
        });
    };

    const removeExtras = (newTypingData: word[]) => {
        return newTypingData.map((word) => {});
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
            <div className="typing-field__input-wrapper">
                <div
                    className={
                        showTypingInput
                            ? "typing-field__input"
                            : "typing-field__input--blurred"
                    }
                >
                    <input
                        onKeyDown={handleKeyPress}
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
                        typingData.map((word, wordIndex) => {
                            return (
                                <div className="input__word" key={wordIndex}>
                                    {word.map((letter, letterIndex) => (
                                        <>
                                            <div
                                                key={letterIndex}
                                                className={
                                                    letter.isDeleted
                                                        ? "word__character--deleted"
                                                        : letter.isExtra
                                                        ? "word__character--extra"
                                                        : letter.isCorrect
                                                        ? "word__character--correct"
                                                        : letter.isIncorrect
                                                        ? "word__character--incorrect"
                                                        : "word__character"
                                                }
                                                ref={
                                                    letter.isCurrent
                                                        ? currentLetter
                                                        : null
                                                }
                                            >
                                                {letter.isCurrent && (
                                                    <div
                                                        className={
                                                            letterIndex ===
                                                            word.length - 1
                                                                ? "word__position-marker--right"
                                                                : "word__position-marker"
                                                        }
                                                    ></div>
                                                )}
                                                {letter.character}
                                            </div>
                                        </>
                                    ))}
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
};

export default TypingField;
