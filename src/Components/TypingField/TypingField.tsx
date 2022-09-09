import "./TypingField.css";
import React, { useState, useEffect, useRef } from "react";
import { GameMode } from "../App/App";
import CurrentScore from "../CurrentScore/CurrentScore";

type TypingFieldProps = {
    typingText: string;
    gameMode: GameMode;
    handleNewGameChange: () => void;
};

type Letter = {
    character: string;
    isCurrent: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    isDeleted?: boolean;
    isCorrected?: boolean;
    isExtra?: boolean;
};

type Word = Letter[];

export type TypingData = Word[];

export type TimerData = {
    isTimerStarted: boolean;
    timerVariable: TimerData | null;
    startTime: number | null;
    endTime: number | null;
    timeElapsed: number;
};

const TypingField = ({
    typingText,
    gameMode,
    handleNewGameChange,
}: TypingFieldProps) => {
    const [typingData, setTypingData] = useState<TypingData | null>([]);
    const [typingInput, setTypingInput] = useState("");
    const [showTypingInput, setShowTypingInput] = useState(false);
    const [offset, setOffset] = useState(0);
    const [gameEnd, setGameEnd] = useState(false);
    const [timerData, setTimerData] = useState<TimerData>({
        isTimerStarted: false,
        timerVariable: null,
        startTime: null,
        endTime: null,
        timeElapsed: 0,
    });
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    const wordInput = useRef<null | HTMLInputElement>(null);
    const currentLetter = useRef<null | HTMLDivElement>(null);
    const typingField = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (gameMode.isNew) {
            resetTypingInput();
        }
    }, [gameMode]);

    useEffect(() => {
        if (!typingData) {
            return;
        }
        const newTypingData = setUpTypingData(typingText);
        setTypingData(newTypingData);
        // handleNewGameChange();
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
                    // console.log("too may letters");
                    newTypingData = removeCursors(newTypingData);

                    const newLetter: Letter = {
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
                                // console.log(letterIndex, newLetterIndex);
                                letter.isDeleted = false;
                                return letter;
                            } else {
                                letter.isDeleted = true;
                                // console.log("delete");

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
                } else if (typingInput.at(-1) === " ") {
                    newTypingData[wordIndex + 1][0].isCurrent = true;
                } else {
                    newTypingData[wordIndex][letterIndex].isCurrent = true;
                }
                if (currentLetter.current) {
                    currentLetter.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
                setTypingData(newTypingData);
                checkEndOfWords(newTypingData, wordIndex, letterIndex);
            });
        });
    }, [typingInput]);

    useEffect(() => {
        if (currentLetter.current?.offsetTop === offset) {
            return;
        }
        if (currentLetter.current && typingField.current) {
            setOffset(currentLetter.current.offsetTop);
            typingField.current.style.transform = `translateY(-${
                offset * 0.75
            }px)`;
        }
    }, [currentLetter.current, offset]);

    const resetOffset = () => {
        const newOffset = 0;
        setOffset(newOffset);
        typingField.current!.style.transform = `translateY(-${newOffset}px)`;
    };
    const setUpTypingData = (
        typingText: TypingFieldProps["typingText"]
    ): TypingData => {
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
        return typingTextWordsAndLetters;
    };

    const checkEndOfWords = (
        newTypingData: TypingData,
        wordIndex: number,
        letterIndex: number
    ) => {
        // console.log(wordIndex, "wordIndex", newTypingData.length - 1);
        if (
            wordIndex === newTypingData.length - 1 &&
            !newTypingData[wordIndex][letterIndex + 1]
        ) {
            setGameEnd(true);
            const timeNow = Date.now();
            setTimerData((prev) => ({
                ...prev,
                endTime: timeNow,
                timeElapsed: timeNow - prev.startTime!,
                isTimerStarted: false,
            }));
            setShowTypingInput(false);
        }
    };

    const resetTypingInput = () => {
        setTypingInput("");
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
        }
        return event;
    };

    const handleTypingInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { target } = event;
        setTypingInput(target.value);
    };

    const handleTypingFieldClick = (event: React.MouseEvent) => {
        if (gameEnd) {
            handleNewGameChange();
            setOffset(0);
            resetOffset();
            setGameEnd(false);
            return;
        }
        if (wordInput.current !== null) {
            wordInput.current.focus();
        }
    };

    const handleInputOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!timerData.isTimerStarted) {
            const timeNow = Date.now();
            setTimerData((prev) => ({
                ...prev,
                isTimerStarted: true,
                startTime: timeNow,
            }));
        }
        setShowTypingInput(true);
    };

    const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setShowTypingInput(false);
    };

    const removeCursors = (newTypingData: Word[]) => {
        return newTypingData.map((word) => {
            return word.map((letter) => {
                letter.isCurrent = false;
                return letter;
            });
        });
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!event.getModifierState(event.key)) {
            setIsCapsLockOn(false);
        }
        if (event.getModifierState(event.key) && event.key === "CapsLock") {
            setIsCapsLockOn(true);
        }
    };
    const checkCapsLock = () => {};

    // const removeExtras = (newTypingData: word[]) => {
    //     return newTypingData.map((word) => {});
    // };

    return (
        <section
            className={
                showTypingInput ? "typing-field" : "typing-field--blurred"
            }
            onClick={handleTypingFieldClick}
        >
            {!showTypingInput && (
                <div className="typing-field__focus-warning">
                    {gameEnd ? "Click to start again" : "Click to continue"}
                </div>
            )}
            <div className="typing-field__input-wrapper">
                <div
                    className={
                        gameEnd
                            ? "typing-field__input--blurred"
                            : showTypingInput
                            ? "typing-field__input"
                            : "typing-field__input--blurred"
                    }
                    ref={typingField}
                >
                    <input
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyUp}
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

                    {typingData &&
                        typingData.map((word, wordIndex) => {
                            return (
                                <div className="input__word" key={wordIndex}>
                                    {word.map((letter, letterIndex) => (
                                        <div key={letterIndex}>
                                            <div
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
                                                            letter.isCorrect
                                                                ? "word__position-marker--right"
                                                                : letter.isExtra
                                                                ? "word__position-marker--right"
                                                                : "word__position-marker"
                                                        }
                                                    ></div>
                                                )}
                                                {letter.character}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                </div>
            </div>
            <CurrentScore
                timerData={timerData}
                typingData={typingData}
                typingText={typingText}
            />
            <div>{isCapsLockOn && "Caps lock is on!"}</div>
        </section>
    );
};

export default TypingField;
