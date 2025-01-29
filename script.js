// Get DOM elements
const input = document.getElementById('input');
const buttons = document.querySelectorAll('.inputs button');
const alertBtn = document.getElementById('alert');
const historyBtn = document.getElementById('history-btn');

// Initialize variables
let expression = '';
let lastResult = '';
let calculationHistory = [];

// Add click event listeners to all calculator buttons
buttons.forEach(button => {
    button.addEventListener('click', () => handleInput(button.textContent));
});

// Handle keyboard input
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

// Handle input from both clicks and keyboard
function handleInput(value) {
    switch (value) {
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

// Update the expression
function updateExpression(value) {
    if (input.value === '0' || input.value === 'Error') {
        input.value = '';
    }

    // Handle special cases after result
    if (lastResult !== '') {
        if ('0123456789('.includes(value)) {
            expression = '';
            lastResult = '';
        } else {
            expression = lastResult;
            lastResult = '';
        }
    }

    // Add the new value and update display
    expression += value;
    input.value = expression;

    // Ensure cursor stays at the end for RTL input
    input.scrollLeft = input.scrollWidth;
}

// Calculate the result
function calculateResult() {
    try {
        // Replace % with /100
        let evalExpression = expression.replace(/%/g, '/100');

        // Evaluate the expression
        let result = eval(evalExpression);

        // Handle division by zero
        if (!isFinite(result)) {
            throw new Error('Division by zero');
        }

        // Format the result
        result = Number(result.toFixed(10)).toString();

        // Add to history
        if (expression !== result) {
            calculationHistory.unshift({
                expression: expression,
                result: result,
                timestamp: new Date()
            });
            // Keep only last 10 calculations
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

// Clear the input
function clearInput() {
    expression = '';
    lastResult = '';
    input.value = '0';
}

// Function to clear last character
function clearLastCharacter() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        input.value = expression;
        if (expression === '') {
            input.value = '0';
        }
    }
}

// Get time-based greeting
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

// Add alert button functionality with time-based greeting
alertBtn.addEventListener('click', () => {
    const greeting = getGreeting();
    alert(`${greeting}! The result is: ${input.value}`);
});

// Handle history button click
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

// Make input field responsive to device width
function adjustInputSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    input.style.width = (containerWidth - 40) + 'px'; // 40px for padding
}

// Call adjustInputSize on load and resize
window.addEventListener('load', adjustInputSize);
window.addEventListener('resize', adjustInputSize);