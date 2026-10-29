const display = document.querySelector('input[type="text"]');
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let previousInput = "";
let operator = "";
let resultDisplayed = false;


buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.innerText;
        // console.log(value);


        if (!isNaN(value) || value === ".") {

            if (resultDisplayed) {
                currentInput = value;
                resultDisplayed = false;
            } else {
                currentInput = currentInput === "0"
                    ? value
                    : currentInput + value;
            }

            updateDisplay(currentInput);
            return;
        }
        if (value === "AC") {
            currentInput = "0";
            previousInput = "";
            operator = "";
            resultDisplayed = false;
            updateDisplay("0");
            return;
        }

        if (value === 'DEL') {
            currentInput = currentInput.slice(0, -1) || "0";
            updateDisplay(currentInput);
            return;
        }

        if (["/", "*", "-", "+", "%"].includes(value)) {

            if (resultDisplayed) {
                previousInput = display.value;
                resultDisplayed = false;
            } else {
                if (currentInput) {
                    previousInput = previousInput ? calculate().toString() : currentInput;
                }
            }

            currentInput = "";
            operator = value;updateDisplay(previousInput);
            return;
        }

        if (value === "=") {
            if (currentInput && previousInput && operator) {
                const result = calculate();
                updateDisplay(result);
                previousInput = result.toString();
                currentInput = "";
                operator = "";
                resultDisplayed = true;
            }
            return;
        }
    });
});
function updateDisplay(value) {
    display.value = value;
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        return 0;
    }
    switch (operator) {
        case "+":
            return prev + current;
        case "-":
            return prev - current;
        case "/":
            return prev / current;
        case "*":
            return prev * current;

        default:
            return current;
    }
}