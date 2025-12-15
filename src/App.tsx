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

    const aScaled = {
        numerator: a.numerator * (commonDenominator / a.denominator),
        denominator: commonDenominator,
    };
    const bScaled = {
        numerator: b.numerator * (commonDenominator / b.denominator),
        denominator: commonDenominator,
    };
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
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <Grid
                orientation="column"
                counts={[
                    {
                        count: a.numerator,
                        color: "red",
                    },
                ]}
                denominator={a.denominator}
                separators={{
                    shouldShowHorizontal: false,
                    shouldShowVertical: true,
                }}
            />
            <Grid
                orientation="row"
                counts={[
                    {
                        count: b.numerator,
                        color: "blue",
                    },
                ]}
                denominator={b.denominator}
                separators={{
                    shouldShowHorizontal: true,
                    shouldShowVertical: false,
                }}
            />
            <Grid
                orientation="row"
                counts={[
                    {
                        count: bScaled.numerator,
                        color: "blue",
                    },
                    {
                        count: aScaled.numerator,
                        color: "red",
                    },
                ]}
                denominator={commonDenominator}
                separators={{
                    shouldShowHorizontal: true,
                    shouldShowVertical: false,
                }}
            />
        </div>
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

function Grid({
    orientation,
    separators,
    counts,
    denominator,
}: {
    orientation: "column" | "row";
    separators: {
        shouldShowVertical: boolean;
        shouldShowHorizontal: boolean;
    };
    counts: GridCount[];
    denominator: number;
}) {
    const remainder =
        denominator - counts.reduce((acc, count) => acc + count.count, 0);
    const countsWithRemainder = [
        ...counts,
        { count: remainder, color: "white" },
    ];
    return (
        <div
            style={{
                display: "grid",
                width: "30rem",
                height: "30rem",
                gridTemplateRows: `repeat(${denominator}, 1fr)`,
                gridTemplateColumns: `repeat(${denominator}, 1fr)`,
                gridAutoFlow: orientation,
                borderTop: "2px solid black",
                borderLeft: "2px solid black",
                borderBottom: separators.shouldShowHorizontal
                    ? undefined
                    : "2px solid black",
                borderRight: separators.shouldShowVertical
                    ? undefined
                    : "2px solid black",
            }}
        >
            {countsWithRemainder.map((count) =>
                Array.from({ length: count.count }).map((_, index) => (
                    <Fragment key={index}>
                        {Array.from({ length: denominator }).map((_, index) => (
                            <div
                                style={{
                                    backgroundColor: count.color,
                                    borderBottom:
                                        separators.shouldShowHorizontal
                                            ? "2px solid black"
                                            : undefined,
                                    borderRight: separators.shouldShowVertical
                                        ? "2px solid black"
                                        : undefined,
                                }}
                                key={index}
                            />
                        ))}
                    </Fragment>
                ))
            )}
        </div>
    );
}

export default App;
