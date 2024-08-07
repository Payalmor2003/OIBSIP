document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const operators = document.querySelectorAll('.operator');
    const equalButton = document.getElementById('equal');
    const clearButton = document.getElementById('clear');

    let displayValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');

            if (['+', '-', '*', '/'].includes(value)) {
                handleOperator(value);
            } else if (value === '.') {
                inputDecimal(value);
            } else if (value === 'C') {
                clearDisplay();
            } else {
                inputDigit(value);
            }
        });
    });

    function clearDisplay() {
        displayValue = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        display.textContent = displayValue;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
        display.textContent = displayValue;
    }

    function inputDecimal(dot) {
        if (!displayValue.includes(dot)) {
            displayValue += dot;
        }
        display.textContent = displayValue;
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            display.textContent = displayValue;
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    clearButton.addEventListener('click', clearDisplay);
    equalButton.addEventListener('click', () => {
        if (operator && !waitingForSecondOperand) {
            const inputValue = parseFloat(displayValue);
            const result = calculate(firstOperand, inputValue, operator);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            display.textContent = displayValue;
            firstOperand = result;
            operator = null;
            waitingForSecondOperand = true;
        }
    });
});
