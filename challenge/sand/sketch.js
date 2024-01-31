/*
Fırat Batar - 01.31.2024
Inspired from Daniel Shiffman's Coding Challenge #180 - Falling Sand
https://thecodingtrain.com/challenges/180-falling-sand
*/


let size = 10;
let brushSize = 5;
let numOfCols; let numOfRows;
let grid;
let colorShift = 0;

let brushSizeSlider;
let gridSizeSlider;
let resetButton;


function createEmptyGrid(rows, cols) {
    let newGrid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        newGrid[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            newGrid[i][j] = 0;
        }
    }
    
    return newGrid;
}

function updateGrid() {
    let newGrid = createEmptyGrid(numOfRows, numOfCols);

    for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
            if (grid[i][j] > 0) {
                let bottom = grid[i][j + 1];
                if (bottom == 0) {
                    // Move down if possible
                    newGrid[i][j + 1] = grid[i][j];
                } else if (bottom > 0) {  // If bottom is filled, fall to the left or right
                    let bottomLeft; let bottomRight;
                    if (i != 0) bottomLeft = grid[i - 1][j + 1];
                    if (i != numOfRows - 1) bottomRight = grid[i + 1][j + 1];

                    if (bottomLeft == 0 && bottomRight == 0) {  // If both left and right are empty, randomly choose left or right
                        if (random() < 0.5) {
                            // Move left
                            newGrid[i - 1][j + 1] = grid[i][j];
                        } else {
                            // Move right
                            newGrid[i + 1][j + 1] = grid[i][j];
                        }
                    } else if (bottomLeft == 0) {
                        // Move left
                        newGrid[i - 1][j + 1] = grid[i][j];
                    } else if (bottomRight == 0) {
                        // Move right
                        newGrid[i + 1][j + 1] = grid[i][j];
                    } else {
                        // Stay
                        newGrid[i][j] = grid[i][j];
                    }
                } else {
                    // Stay
                    newGrid[i][j] = grid[i][j];
                }
            }
        }
    }

    grid = newGrid;  // Update the grid
}

function setup() {
    createCanvas(800, 800).parent('sketch-holder');
    colorMode(HSB, 500, 100, 100);

    numOfCols = floor(width / size) + 1;
    numOfRows = floor(height / size) + 1;

    grid = createEmptyGrid(numOfRows, numOfCols);

    createP("Set brush size: ").position(width + 20, 0).parent('sketch-holder');
    brushSizeSlider = createSlider(1, 11, 5, 2).position(width + 140, 2).parent('sketch-holder');
    createP("Set grid size: ").position(width + 20, 40).parent('sketch-holder');
    gridSizeSlider = createSlider(1, 40, 10, 5).position(width + 140, 45).parent('sketch-holder');
    resetButton = createButton("Reset").position(width + 20, 80).parent('sketch-holder');
    resetButton.mousePressed(() => {
        grid = createEmptyGrid(numOfRows, numOfCols);
    });
}

function draw() {
    background(0);

    brushSize = brushSizeSlider.value();  // Adjust brush size
    if (gridSizeSlider.value() != size) {  // Check if grid size has changed
        // Reset the grid with new size
        size = gridSizeSlider.value();
        numOfCols = floor(width / size) + 1;
        numOfRows = floor(height / size) + 1;
        grid = createEmptyGrid(numOfRows, numOfCols);
    }
    
    // Show the cells
    for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
            if (grid[i][j] > 0) {
                noStroke();
                fill((grid[i][j] + frameCount) % 500, 100, 100);  // Change color based on frame count and color shift
                rect(i * size, j * size, size, size);
            }
        }
    }

    // Show brush
    let brushRow = floor(mouseX / size);
    let brushCol = floor(mouseY / size);
    if (brushSize == 1) {
        // Brush size of one won't work with the loop below
        noStroke();
        fill((colorShift + frameCount) % 500, 100, 100);  // Brush color also shifts
        rect(brushRow * size, brushCol * size, size, size);
    } else {
        for (let i = -floor(brushSize / 2); i <= floor(brushSize / 2); i++) {
            for (let j = -floor(brushSize / 2); j <= floor(brushSize / 2); j++) {
                if (abs(i * j) >= floor(brushSize / 2)) continue; // Skip corners
                
                let cellRow = brushRow + i;
                let cellCol = brushCol + j;
                if (cellRow >= 0 && cellRow < numOfRows && cellCol >= 0 && cellCol < numOfCols) {
                    noStroke();
                    fill((colorShift + frameCount) % 500, 100, 100);  // Brush color also shifts
                    rect(cellRow * size, cellCol * size, size, size);
                }        
            }
        }
    }
        
    updateGrid();
}

function mouseDragged() {
    let brushRow = floor(mouseX / size);
    let brushCol = floor(mouseY / size);

    if (brushSize == 1) {
        // Brush size of one won't work with the loop below
        grid[brushRow][brushCol] = 1;
        return;
    }

    for (let i = -floor(brushSize / 2); i <= floor(brushSize / 2); i++) {
        for (let j = -floor(brushSize / 2); j <= floor(brushSize / 2); j++) {
            if (abs(i * j) >= floor(brushSize / 2)) continue;  // Skip corners
            if (random() >= 0.7) continue; // Skip some cells randomly

            let cellRow = brushRow + i;
            let cellCol = brushCol + j;
            
            if (cellRow >= 0 && cellRow < numOfRows && cellCol >= 0 && cellCol < numOfCols) {
                if (grid[cellRow][cellCol] == 1) continue; // Skip if cell is already filled
                grid[cellRow][cellCol] = colorShift;  // Set cell to current color shift
            }        
        }
    }

    // Update color shift
    colorShift += 1;
    if (colorShift > 500) colorShift = 1;
}