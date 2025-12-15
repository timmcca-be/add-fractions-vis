import { useState, Fragment } from "react";
import { IconStarFilled, IconMoonFilled } from "@tabler/icons-react";

const expressionPattern =
    /^\s*(?<numerator1>\d+)\s*\/(?<denominator1>\d+)\s*\+\s*(?<numerator2>\d+)\s*\/(?<denominator2>\d+)\s*$/;
interface ExpressionGroups {
    numerator1: string;
    denominator1: string;
    numerator2: string;
    denominator2: string;
}

function App() {
    const [expression, setExpression] = useState("1/4 + 2/3");
    const groups = expression.match(expressionPattern)?.groups as
        | ExpressionGroups
        | null
        | undefined;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1rem",
            }}
        >
            <label
                style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}
            >
                Expression:
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    style={{ fontSize: "1rem" }}
                />
            </label>
            {groups == null ? (
                <p>Invalid expression</p>
            ) : (
                <ExpressionDisplay
                    a={{
                        numerator: parseInt(groups.numerator1),
                        denominator: parseInt(groups.denominator1),
                    }}
                    b={{
                        numerator: parseInt(groups.numerator2),
                        denominator: parseInt(groups.denominator2 ?? "1"),
                    }}
                />
            )}
        </div>
    );
}

interface Fraction {
    numerator: number;
    denominator: number;
}

const visualScale = 3;
const blue = "#08f";
const red = "#f44";

function ExpressionDisplay({ a, b }: { a: Fraction; b: Fraction }) {
    if (
        a.numerator * b.denominator + b.numerator * a.denominator >
        a.denominator * b.denominator
    ) {
        return <p>Expression sums to more than 1.</p>;
    }

    const gridStyle = {
        display: "grid",
        border: "2px solid black",
        gap: "2px",
        backgroundColor: "black",
        gridTemplateRows: `repeat(${b.denominator}, ${visualScale}rem)`,
        gridTemplateColumns: `repeat(${a.denominator}, ${visualScale}rem)`,
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <div style={gridStyle}>
                {Array.from({ length: a.denominator }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor:
                                index < a.numerator ? red : "white",
                            gridRow: "1 / -1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {index < a.numerator && (
                            <IconStarFilled color="white" />
                        )}
                    </div>
                ))}
            </div>
            <div style={gridStyle}>
                {Array.from({ length: b.denominator }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor:
                                index < b.numerator ? blue : "white",
                            gridColumn: "1 / -1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {index < b.numerator && (
                            <IconMoonFilled color="white" />
                        )}
                    </div>
                ))}
            </div>
            <div style={gridStyle}>
                {Array.from({ length: b.denominator }).map((_, bIndex) => (
                    <Fragment key={bIndex}>
                        {Array.from({ length: a.denominator }).map(
                            (_, aIndex) => {
                                const color = getColor(a, b, aIndex, bIndex);
                                return (
                                    <div
                                        key={aIndex}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: color,
                                        }}
                                    >
                                        {color === red && (
                                            <IconStarFilled color="white" />
                                        )}
                                        {color === blue && (
                                            <IconMoonFilled color="white" />
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

function getColor(a: Fraction, b: Fraction, aIndex: number, bIndex: number) {
    if (bIndex < b.numerator) {
        return blue;
    }
    const segmentSize = gcd(a.denominator, b.denominator);
    const bottomSegmentIndex =
        Math.floor(aIndex / segmentSize) * (b.denominator - b.numerator) +
        (bIndex - b.numerator);
    const numRedSegments = (a.numerator * b.denominator) / segmentSize;
    if (bottomSegmentIndex < numRedSegments) {
        return red;
    }
    return "white";
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export default App;
