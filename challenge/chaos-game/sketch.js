document.addEventListener('contextmenu', event => event.preventDefault());


let vertexCount;
let proportion;

let vertices;
let movingPoint;

let iterateButton;
let toggleAuto;
let clearButton;
let resetButton;
let vertexButton;
let customVertices;

let vertexCountSlider;
let proportionSlider;

let isAuto = false;
let isCustom = false;

let iterCount = 0;



function setup() {
  createCanvas(1000, 1000);
  background(0);

  vertexCountSlider = createSlider(3, 6, 3, 1);
  vertexCount = vertexCountSlider.value();

  proportionSlider = createSlider(0.01, 0.99, 0.5, 0.01);
  proportion = proportionSlider.value();

  iterateButton = createButton("Iterate");
  iterateButton.mousePressed(iterate);

  toggleAuto = createButton("Toggle Auto");
  toggleAuto.mousePressed(() => {
    isAuto = !(isAuto || isCustom);
  });

  clearButton = createButton("Clear");
  clearButton.mousePressed(clearScreen);

  resetButton = createButton("Reset");
  resetButton.mousePressed(resetGame);

  vertexButton = createButton("Randomize Vertices");
  vertexButton.mousePressed(() => {
    resetGame();
    console.log("Vertices randomized!");
  });

  customVertices = createButton("Custom Vertices")
  customVertices.mousePressed(() => {
    isAuto = false;
    if (!isCustom) {
      vertices = [];
      movingPoint = {};
      clearScreen();
    } else {
      if (vertices.length >= 3) {
        vertexCount = vertices.length;
        resetGame(randomize=false);
      } else {
        vertexCount = vertexCountSlider.value();
        resetGame();
      }
    }

    isCustom = !isCustom;
  })


  movingPoint = newMovingPoint();

  push();
  stroke(255);
  strokeWeight(5);
  point(movingPoint.x, movingPoint.y);
  pop();


  switch (vertexCount) {
    case 3:
      vertices = [
        {'label': 1, 'x': width/2, 'y': 40},
        {'label': 2, 'x': 40, 'y': height - 40},
        {'label': 3, 'x': width - 40, 'y': height - 40}
      ]
      break;
    case 4:
      vertices = [
        {'label': 1, 'x': 40, 'y': 40},
        {'label': 2, 'x': width - 40, 'y': 40},
        {'label': 3, 'x': 40, 'y': height - 40},
        {'label': 4, 'x': width - 40, 'y': height - 40}
      ]
      break;
  }
  


  drawVertices(vertices);
}

function draw() {
  if (isAuto) {
    iterate();
  }
}

function iterate() {
  selected = random(vertices);
  iterCount++;
  // console.log(`${selected.label} is selected.`);
  console.log(`Iteration: ${iterCount}`);

  dx = selected.x - movingPoint.x;
  dy = selected.y - movingPoint.y;

  proportion = proportionSlider.value();

  movingPoint.x += dx * proportion;
  movingPoint.y += dy * proportion;

  push();
  stroke(255);
  strokeWeight(5);
  point(movingPoint.x, movingPoint.y);
  pop();
}

function randomizeVertices() {
  vertexCount = vertexCountSlider.value();
  vertices = [];
  for (let i = 0; i < vertexCount; i++) {
    let x = random(width-20);
    let y = random(height-20);

    vertices[i] = {'label': i+1, 'x': x, 'y': y};
  }
}

function drawVertices(vertices) {
  push();
  stroke(255, 0, 0);
  strokeWeight(8);
  vertices.forEach(elem => {
    point(elem.x, elem.y);
  });
  pop();
}

function newMovingPoint(x, y) {
  let newPoint = {
    'x': x || random(width-20),
    'y': y || random(height-20)
  };

  return newPoint;
}
function clearScreen() {
  background(0);
  drawVertices(vertices);
  
  push();
  stroke(255);
  strokeWeight(5);
  point(movingPoint.x, movingPoint.y);
  pop();

  console.log("Screen cleaned!");
}

function resetGame(x, y, randomize=true) {
  proportion = proportionSlider.value();

  if (randomize) {
    randomizeVertices();
  }
  
  isAuto = false;
  movingPoint = newMovingPoint(x, y);
  clearScreen();

  console.log("Game resetted");
}

function mousePressed(event) {
  if (isCustom) {
    let x = event.clientX; 
    let y = event.clientY;
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    } 

    if (event.button == 0) {
      vertices.push({'label': vertices.length+1, 'x': x, 'y': y});
      push();
      stroke(255, 0, 0);
      strokeWeight(8);
      point(x, y);
      pop();
    } else if (event.button == 2) {
      if (vertices.length >= 3) {
        vertexCount = vertices.length;
        resetGame(x, y, false);
      } else {
        vertexCount = vertexCountSlider.value();
        resetGame();
      }
      isCustom = false;
    }
  }
}