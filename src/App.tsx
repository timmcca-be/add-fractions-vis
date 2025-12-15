import { useState, Fragment } from "react";

const gridDimension = 60;
const expressionPattern =
    /^\s*(?<numerator1>\d+)\s*\/(?<denominator1>\d+)\s*\+\s*(?<numerator2>\d+)\s*\/?(?<denominator2>\d+)?\s*$/;
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

function ExpressionDisplay({ a, b }: { a: Fraction; b: Fraction }) {
    const commonDenominator = lcm(a.denominator, b.denominator);
    if (gridDimension % commonDenominator !== 0) {
        return (
            <p>
                This expression cannot be displayed on a {gridDimension}x
                {gridDimension} grid
            </p>
        );
    }

    // const aScaled = {
    //     numerator: a.numerator * (commonDenominator / a.denominator),
    //     denominator: commonDenominator,
    // };
    // const bScaled = {
    //     numerator: b.numerator * (commonDenominator / b.denominator),
    //     denominator: commonDenominator,
    // };
    // const result = {
    //     numerator: aScaled.numerator + bScaled.numerator,
    //     denominator: commonDenominator,
    // };

    const aNumColumns = a.numerator * (gridDimension / a.denominator);
    const bNumRows = b.numerator * (gridDimension / b.denominator);
    if (aNumColumns + bNumRows > gridDimension) {
        return (
            <p>
                The result of this expression is greater than 1, so it cannot be
                displayed.
            </p>
        );
    }

    const aCount: GridCount = { count: aNumColumns, color: "red" };
    const bCount: GridCount = { count: bNumRows, color: "blue" };

    return (
        <>
            <Grid counts={[aCount]} />
            <Grid counts={[bCount]} />
            <Grid counts={[bCount, aCount]} />
        </>
    );
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

interface GridCount {
    count: number;
    color: "red" | "blue";
}

function Grid({ counts }: { counts: GridCount[] }) {
    const remainder =
        gridDimension - counts.reduce((acc, count) => acc + count.count, 0);
    const countsWithRemainder = [
        ...counts,
        { count: remainder, color: "white" },
    ];
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridDimension}, 1rem)`,
                height: "1rem",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                borderLeft: "1px solid black",
            }}
        >
            {countsWithRemainder.map((count) =>
                Array.from({ length: count.count }).map((_, index) => (
                    <div
                        style={{
                            backgroundColor: count.color,
                            borderRight: "1px solid black",
                        }}
                        key={index}
                    />
                ))
            )}
        </div>
    );
}

export default App;
