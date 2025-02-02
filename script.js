const input = document.getElementById('input');
const buttons = document.querySelectorAll('.inputs button');
const alertBtn = document.getElementById('alert');
const historyBtn = document.getElementById('history-btn');

let expression = '';
let lastResult = '';
let calculationHistory = [];

buttons.forEach(button => {
    button.addEventListener('click', () => handleInput(button.textContent));
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', '%', 'Enter', 'Backspace', 'Escape'];
    
    if (validKeys.includes(key)) {
        e.preventDefault();
        if (key === 'Enter') {
            handleInput('=');
        } else if (key === 'Backspace') {
            clearLastCharacter();
        } else if (key === 'Escape') {
            clearInput();
        } else {
            handleInput(key);
        }
    }
});

function handleInput(value) {
    switch(value) {
        case 'C':
            clearInput();
            break;
        case '=':
            calculateResult();
            break;
        default:
            updateExpression(value);
    }
}

function updateExpression(value) {
    if (input.value === '0' || input.value === 'Error') {
        input.value = '';
    }

    if (lastResult !== '') {
        if ('0123456789('.includes(value)) {
            expression = '';
            lastResult = '';
        } else {
            expression = lastResult;
            lastResult = '';
        }
    }

    expression += value;
    input.value = expression;

    input.scrollLeft = input.scrollWidth;
}

function calculateResult() {
    try {
        let evalExpression = expression.replace(/%/g, '/100');

        let result = eval(evalExpression);

        // Handle division by zero
        if (!isFinite(result)) {
            throw new Error('Division by zero');
        }

        result = Number(result.toFixed(10)).toString();

        if (expression !== result) {
            calculationHistory.unshift({
                expression: expression,
                result: result,
                timestamp: new Date()
            });
        
            if (calculationHistory.length > 10) {
                calculationHistory.pop();
            }
        }
        
        input.value = result;
        lastResult = result;
        expression = result;
    } catch (error) {
        input.value = 'Error';
        expression = '';
        lastResult = '';
    }
}

function clearInput() {
    expression = '';
    lastResult = '';
    input.value = '0';
}

function clearLastCharacter() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        input.value = expression;
        if (expression === '') {
            input.value = '0';
        }
    }
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning";
    } else if (hour < 17) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

alertBtn.addEventListener('click', () => {
    const greeting = getGreeting();
    alert(`${greeting}! The result is: ${input.value}`);
});

historyBtn.addEventListener('click', () => {
    if (calculationHistory.length === 0) {
        alert('No calculation history yet');
        return;
    }
    
    let historyText = 'Recent Calculations:\n\n';
    calculationHistory.forEach((calc, index) => {
        const dateTime = calc.timestamp.toLocaleDateString() + ' ' + calc.timestamp.toLocaleTimeString();
        historyText += `${index + 1}. ${calc.expression} = ${calc.result}\n   ${dateTime}\n\n`;
    });
    
    alert(historyText);
});

function adjustInputSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    input.style.width = (containerWidth - 40) + 'px'; 
}

window.addEventListener('load', adjustInputSize);
window.addEventListener('resize', adjustInputSize);