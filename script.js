let steps = [];
let currentStep = 0;
let animationQueue = [];

function startSimulation() {
    const size = parseInt(document.getElementById('size').value);
    const arrayInput = document.getElementById('array').value;
    let arr = arrayInput.split(',').map(Number);
    
    if (arr.length !== size || arr.some(isNaN)) {
        alert(`Please enter exactly ${size} valid numbers separated by commas.`);
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
    steps.push({
        array: [...copy],
        keyIndex: -1,
        compareIndex: -1,
        sortedIndex: 0,
        description: 'Initial array'
    });
    
    for (let i = 1; i < copy.length; i++) {
        const key = copy[i];
        steps.push({
            array: [...copy],
            keyIndex: i,
            compareIndex: -1,
            sortedIndex: i,
            description: `Selecting key value ${key} at position ${i+1}`
        });
        
        let j = i - 1;
        while (j >= 0 && copy[j] > key) {
            steps.push({
                array: [...copy],
                keyIndex: i,
                compareIndex: j,
                sortedIndex: i,
                description: `Comparing ${copy[j]} (position ${j+1}) with key ${key}`
            });
            
            copy[j + 1] = copy[j];
            steps.push({
                array: [...copy],
                keyIndex: i,
                compareIndex: j,
                sortedIndex: i,
                description: `Shifting ${copy[j]} from position ${j+1} to ${j+2}`
            });
            j--;
        }
        copy[j + 1] = key;
        steps.push({
            array: [...copy],
            keyIndex: i,
            compareIndex: -1,
            sortedIndex: i + 1,
            description: `Inserting key ${key} at position ${j+2}`
        });
    }
    return steps;
}

async function updateDisplay() {
    const step = steps[currentStep];
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    
    animationQueue = [];
    
    step.array.forEach((num, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = num;
        
        if (index === step.keyIndex) {
            element.classList.add('key');
            element.innerHTML += `<div class="tooltip">Key: ${num}</div>`;
        }
        if (index === step.compareIndex) {
            element.classList.add('compare');
            element.innerHTML += `<div class="tooltip">Comparing: ${num}</div>`;
        }
        if (index < step.sortedIndex) {
            element.classList.add('sorted');
        }

        element.style.transition = 'transform 0.5s';
        element.style.transform = `translateX(${index * 85}px)`;
        
        container.appendChild(element);
        
        if (currentStep > 0 && steps[currentStep].array[index] !== steps[currentStep-1].array[index]) {
            animationQueue.push(() => {
                element.classList.add('moving');
                element.style.transform = `translateX(${index * 85}px)`;
            });
        }
    });

    document.getElementById('explanation').innerHTML = `
        <strong>Step ${currentStep + 1} of ${steps.length}:</strong> 
        ${step.description}
    `;

    document.getElementById('prevBtn').disabled = currentStep === 0;
    document.getElementById('nextBtn').disabled = currentStep === steps.length - 1;

    await new Promise(r => setTimeout(r, 50));
    animationQueue.forEach(fn => fn());
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