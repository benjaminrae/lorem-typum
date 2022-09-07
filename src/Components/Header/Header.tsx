import "./Header.css";
import { GameMode } from "../App/App";
import React from "react";

type HeaderProps = {
    gameMode: GameMode;
    changeToBacon: () => void;
    changeToLorem: () => void;
    changeToHipster: () => void;
};

const Header = ({
    gameMode,
    changeToBacon,
    changeToLorem,
    changeToHipster,
}: HeaderProps) => {
    const handleGameModeClick = (event: React.MouseEvent<HTMLLIElement>) => {
        if (event.currentTarget.id === "bacon") {
            changeToBacon();
        }
        if (event.currentTarget.id === "lorem") {
            changeToLorem();
        }
        if (event.currentTarget.id === "hipster") {
            changeToHipster();
        }
    };
    return (
        <header className="header">
            <h1 className="header__title">
                {gameMode.isLorem
                    ? "Lorem"
                    : gameMode.isBacon
                    ? "Bacon"
                    : gameMode.isHipster
                    ? "Hipster"
                    : gameMode.isPirate
                    ? "Pirate"
                    : ""}{" "}
                Typum
                <span className="header__text-cursor">|</span>
            </h1>
            <nav className="header__nav">
                <ul className="nav__list">
                    {!gameMode.isLorem && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="lorem"
                        >
                            🏛️
                        </li>
                    )}
                    {!gameMode.isBacon && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="bacon"
                        >
                            🥓
                        </li>
                    )}
                    {!gameMode.isHipster && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="hipster"
                        >
                            🧔‍♂️
                        </li>
                    )}
                    {!gameMode.isPirate && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="pirate"
                        >
                            🏴‍☠️
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
