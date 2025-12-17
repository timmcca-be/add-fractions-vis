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
    if (a.numerator > a.denominator || b.numerator > b.denominator) {
        return <p>Improper fractions are not supported.</p>;
    }

    if (a.denominator === 0 || b.denominator === 0) {
        return <p>Denominator cannot be zero.</p>;
    }

    const gridStyle = {
        display: "grid",
        border: "2px solid #242424",
        gap: "2px",
        backgroundColor: "#242424",
        gridTemplateRows: `repeat(${b.denominator}, 3rem)`,
        gridTemplateColumns: `repeat(${a.denominator}, minmax(0, 3rem))`,
    };

    const numOverflowBlocks =
        a.numerator * b.denominator +
        b.numerator * a.denominator -
        a.denominator * b.denominator;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                alignItems: "start",
                flexWrap: "wrap",
            }}
        >
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div style={gridStyle}>
                    {Array.from({ length: b.denominator }).map((_, bIndex) => (
                        <Fragment key={bIndex}>
                            {Array.from({ length: a.denominator }).map(
                                (_, aIndex) => (
                                    <Block
                                        aIndex={aIndex}
                                        bIndex={bIndex}
                                        a={a}
                                        b={b}
                                    />
                                )
                            )}
                        </Fragment>
                    ))}
                </div>
                {numOverflowBlocks > 0 && (
                    <div style={gridStyle}>
                        {Array.from({ length: b.denominator }).map(
                            (_, bIndex) => (
                                <Fragment key={bIndex}>
                                    {Array.from({ length: a.denominator }).map(
                                        (_, aIndex) => (
                                            <Block
                                                aIndex={aIndex}
                                                bIndex={bIndex}
                                                a={{
                                                    numerator:
                                                        numOverflowBlocks /
                                                        b.denominator,
                                                    denominator: a.denominator,
                                                }}
                                                b={{
                                                    numerator: 0,
                                                    denominator: b.denominator,
                                                }}
                                            />
                                        )
                                    )}
                                </Fragment>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Block({
    aIndex,
    bIndex,
    a,
    b,
}: {
    aIndex: number;
    bIndex: number;
    a: Fraction;
    b: Fraction;
}) {
    const color = getColor(a, b, aIndex, bIndex);
    return (
        <div
            key={aIndex}
            style={{
                backgroundColor: color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {color === red && <IconStarFilled color="white" />}
            {color === blue && <IconMoonFilled color="white" />}
        </div>
    );
}

function getColor(a: Fraction, b: Fraction, aIndex: number, bIndex: number) {
    if (bIndex < b.numerator) {
        return blue;
    }
    const segmentSize = gcd(a.denominator, b.denominator);
    const numRedSegments = (a.numerator * b.denominator) / segmentSize;
    const bottomSegmentIndex =
        Math.floor(aIndex / segmentSize) * (b.denominator - b.numerator) +
        (bIndex - b.numerator);
    if (bottomSegmentIndex < numRedSegments) {
        return red;
    }
    return "white";
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export default App;
