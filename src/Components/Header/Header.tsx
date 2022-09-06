import "./Header.css";
import { GameMode } from "../App/App";
import React from "react";

type HeaderProps = {
    gameMode: GameMode;
    changeToBacon: any;
    changeToLorem: any;
};

const Header = ({ gameMode, changeToBacon, changeToLorem }: HeaderProps) => {
    const handleGameModeClick = (event: React.MouseEvent<HTMLLIElement>) => {
        if (event.currentTarget.id === "bacon") {
            changeToBacon();
        }
        if (event.currentTarget.id === "lorem") {
            changeToLorem();
        }
    };
    return (
        <header className="header">
            <h1 className="header__title">
                {gameMode.isLorem ? "Lorem" : "Bacon"} Typum
                <span className="header__text-cursor">|</span>
            </h1>
            <nav className="header__nav">
                <ul className="nav__list">
                    {gameMode.isLorem && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="bacon"
                        >
                            🥓
                        </li>
                    )}
                    {gameMode.isBacon && (
                        <li
                            className="list__game-mode"
                            onClick={handleGameModeClick}
                            id="lorem"
                        >
                            🏛️
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
