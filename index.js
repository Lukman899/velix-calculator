
const display = document.querySelector(".display-container input");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let resultShown = false;

function updateDisplay() {
    display.value = expression;
}

function calculate() {
    if (!expression || expression === "Error") return;

    try {
        let exp = expression.replace(/−/g, "-");

        if (!/^[0-9+\-*/.%\s]+$/.test(exp)) {
            throw new Error("Invalid expression");
        }

        exp = exp.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

        if (/[^0-9.)]$/.test(exp)) return;

        const result = Function(`"use strict"; return (${exp})`)();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(Number(result.toPrecision(12)));
        resultShown = true;
    } catch {
        expression = "Error";
        resultShown = true;
    }

    updateDisplay();
}

function handleInput(value) {
    if (value === "AC") {
        expression = "";
        resultShown = false;
    } else if (value === "DEL") {
        expression = resultShown ? "" : expression.slice(0, -1);
        resultShown = false;
    } else if (value === "=") {
        calculate();
        return;
    } else {
        if (expression === "Error") {
            expression = "";
        }

        if (resultShown) {
            if (!["+", "−", "*", "/", "%"].includes(value)) {
                expression = "";
            }
            resultShown = false;
        }

        if (["+", "−", "*", "/"].includes(value)) {
            if (!expression) {
                if (value !== "−") return;
            } else if (/[+−*/.]$/.test(expression)) {
                expression = expression.slice(0, -1);
            }
        }

        if (value === ".") {
            const currentNumber = expression.split(/[+−*/]/).pop();

            if (currentNumber.includes(".")) return;
            if (!currentNumber) value = "0.";
        }

        if (value === "%") {
            if (!/\d$/.test(expression)) return;
        }

        expression += value;
    }

    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleInput(button.textContent.trim());
    });
});

document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const key = event.key;
    let value;

    if (/^[0-9]$/.test(key)) {
        value = key;
    } else if (["+", "-", "*", "/", ".", "%"].includes(key)) {
        value = key === "-" ? "−" : key;
    } else if (key === "Enter" || key === "=") {
        value = "=";
    } else if (key === "Backspace") {
        value = "DEL";
    } else if (key === "Escape" || key === "Delete") {
        value = "AC";
    } else {
        return;
    }

    event.preventDefault();
    handleInput(value);
});
