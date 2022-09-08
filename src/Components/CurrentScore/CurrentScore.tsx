import "./CurrentScore.css";
import { useState, useEffect } from "react";
import { TimerData, TypingData } from "../TypingField/TypingField";
type CurrentScoreProps = {
    timerData: TimerData;
    typingData: TypingData | null;
    typingText: string;
};

type Score = {
    rawWPM: number;
    correct: number;
    incorrect: number;
};

type ScoreData = Score[];

const CurrentScore = ({
    timerData,
    typingData,
    typingText,
}: CurrentScoreProps) => {
    const [scoreData, setScoreData] = useState<ScoreData>([]);

    useEffect(() => {
        if (!timerData.timeElapsed) {
            console.log("no time elapsed");
            return;
        }
        console.log("timeelapsed");
        const oldScoreData = [...scoreData];
        const newScoreData = oldScoreData.concat({
            rawWPM: calculateRawWPM(),
            correct: 0,
            incorrect: 0,
        });
        console.log(newScoreData);
        setScoreData([...newScoreData]);
    }, [timerData]);

    const calculateRawWPM = () => {
        // using formula => (characters/5) / Time(min)
        const words = typingText.length / 5;
        const minutes = timerData.timeElapsed / 60000;
        return words / minutes;
    };
    return (
        <section>
            <table>
                <tr>
                    <td>Raw WPM:</td>
                    <td>
                        {scoreData.length &&
                            scoreData.at(-1)?.rawWPM.toFixed(3)}
                    </td>
                    <td>Correct:</td>
                    <td>--</td>
                    <td>Failed:</td>
                    <td>--</td>
                    <td>Time:</td>
                    <td>
                        {timerData.endTime
                            ? `${timerData.timeElapsed / 1000}s`
                            : "--"}
                    </td>
                </tr>
            </table>
        </section>
    );
};

export default CurrentScore;
