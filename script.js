// Sound setup - Web Audio API Synthesizer for modern pop clicks
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// Elements
const prevDisplay = document.getElementById('previous-operand');
const currDisplay = document.getElementById('current-operand');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.getElementById('checkbox');
const historyToggleBtn = document.getElementById('history-toggle');
const historySidebar = document.getElementById('history-sidebar');

// State
let expression = '';
let currentInput = '0';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let evaluated = false;

// Initialize Theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    themeToggle.checked = true;
} else {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle.checked = false;
}

themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// Toggle History Panel
historyToggleBtn.addEventListener('click', () => {
    historySidebar.classList.toggle('active');
    playClickSound();
});

// Render initial history
renderHistory();

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ripple effect
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        playClickSound();

        const action = this.dataset.action;
        const value = this.dataset.value;

        handleInput(action, value);
    });
});

function handleInput(action, value) {
    if (evaluated && action !== 'sci' && action !== 'append' && action !== 'delete' && action !== 'clear') {
        // Continue operation with previous result
        evaluated = false;
    }
    
    if (evaluated && (action === 'append' || action === 'sci')) {
        // Start fresh
        expression = '';
        currentInput = '';
        evaluated = false;
    }

    switch(action) {
        case 'clear':
            expression = '';
            currentInput = '0';
            break;
        case 'delete':
            if (currentInput !== '0' && currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                if (currentInput === '') currentInput = '0';
            } else if (expression.length > 0) {
                expression = expression.slice(0, -1);
            }
            break;
        case 'append':
        case 'sci':
            if (currentInput === '0' && value !== '.' && !['+', '-', '*', '/'].includes(value)) {
                currentInput = value;
            } else {
                currentInput += value;
            }
            break;
        case 'calculate':
            try {
                let fullExpr = expression + currentInput;
                // auto close parens
                let openParens = (fullExpr.match(/\(/g) || []).length;
                let closeParens = (fullExpr.match(/\)/g) || []).length;
                for (let i = 0; i < openParens - closeParens; i++) {
                    fullExpr += ')';
                }
                
                // sanitize
                let sanitizedExpr = fullExpr
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/π/g, 'pi');
                
                sanitizedExpr = sanitizedExpr.replace(/log\(/g, 'log10(');
                sanitizedExpr = sanitizedExpr.replace(/ln\(/g, 'log(');

                const result = math.evaluate(sanitizedExpr);
                
                // Format result to avoid crazy floats
                const formattedResult = math.format(result, { precision: 14 });
                
                addToHistory(fullExpr, formattedResult);
                
                expression = fullExpr + ' =';
                currentInput = formattedResult.toString();
                evaluated = true;
            } catch (err) {
                currentInput = 'Error';
                evaluated = true;
            }
            break;
    }
    
    updateDisplay();
}

function updateDisplay() {
    prevDisplay.innerText = expression;
    // Replace operators with nice symbols
    let displayInput = currentInput.replace(/\*/g, '×').replace(/\//g, '÷');
    currDisplay.innerText = displayInput || '0';
    
    // Add small animation
    currDisplay.style.transform = 'scale(1.05)';
    setTimeout(() => {
        currDisplay.style.transform = 'scale(1)';
    }, 100);
}

function addToHistory(expr, res) {
    const formattedExpr = expr.replace(/\*/g, '×').replace(/\//g, '÷');
    history.unshift({ expr: formattedExpr, res });
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<div class="expr">${item.expr}</div><div class="res">${item.res}</div>`;
        div.addEventListener('click', () => {
            currentInput = item.res.toString();
            expression = '';
            evaluated = false;
            updateDisplay();
            playClickSound();
            
            // Optionally close sidebar on mobile when selecting a history item
            if (window.innerWidth <= 800) {
                historySidebar.classList.remove('active');
            }
        });
        historyList.appendChild(div);
    });
}

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleInput('calculate');
    } else if (e.key === 'Escape') {
        handleInput('clear');
    } else if (e.key === 'Backspace') {
        handleInput('delete');
    } else {
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','(',')','^'];
        if (validKeys.includes(e.key)) {
            handleInput('append', e.key);
        }
    }
});
