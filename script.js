let steps = [];
let currentStep = 0;

function startSimulation() {
    const size = parseInt(document.getElementById('size').value);
    const arrayInput = document.getElementById('array').value;
    let arr = arrayInput.split(',').map(Number);
    
    // Validate input
    if (arr.length !== size || arr.some(isNaN)) {
        alert('Please enter a valid array with the specified number of elements.');
        return;
    }

    steps = generateSteps(arr);
    currentStep = 0;
    document.getElementById('simulation').classList.remove('hidden');
    updateDisplay();
}

function generateSteps(arr) {
    let steps = [];
    let copy = [...arr];
    steps.push({ array: [...copy], keyIndex: -1, compareIndex: -1, sortedIndex: 0 });
    
    for (let i = 1; i < copy.length; i++) {
        const key = copy[i];
        // Step: highlight the key
        steps.push({ array: [...copy], keyIndex: i, compareIndex: -1, sortedIndex: i });
        
        let j = i - 1;
        while (j >= 0 && copy[j] > key) {
            copy[j + 1] = copy[j];
            // Step: shift element
            steps.push({ array: [...copy], keyIndex: i, compareIndex: j, sortedIndex: i });
            j--;
        }
        copy[j + 1] = key;
        // Step: insert key
        steps.push({ array: [...copy], keyIndex: i, compareIndex: -1, sortedIndex: i + 1 });
    }
    return steps;
}

function updateDisplay() {
    const step = steps[currentStep];
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    
    step.array.forEach((num, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = num;
        
        if (index === step.keyIndex) element.classList.add('key');
        if (index === step.compareIndex) element.classList.add('compare');
        if (index < step.sortedIndex) element.classList.add('sorted');
        
        container.appendChild(element);
    });
    
    document.getElementById('prevBtn').disabled = currentStep === 0;
    document.getElementById('nextBtn').disabled = currentStep === steps.length - 1;
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateDisplay();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateDisplay();
    }
}