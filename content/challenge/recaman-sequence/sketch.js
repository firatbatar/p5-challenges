const LIMIT = 300;
const OFF = 70;
let visited = new Array(LIMIT).fill(false);
let sequence = [0];

function setup() {
    // createCanvas(1872, 1404).parent('sketch-holder');
    createCanvas(1200, 1200).parent('sketch-holder');
    visited[0] = true;

    while (sequence[sequence.length - 1] < LIMIT) {
        let prev = sequence[sequence.length - 1];
        let next = prev - sequence.length;
        if (next < 0 || visited[next]) {
            next = prev + sequence.length;
        }
        if (next >= LIMIT) break;
        sequence.push(next);
        visited[next] = true;
    }

    background(255);

    push();
    strokeWeight(2);
    stroke(0);
    // line(0, height, width, 0);
    pop();

    push();
    // translate(0, height);
    let angle = atan(height / width);
    let hyp = height / sin(angle);
    let highest = sequence[sequence.length - 1] + (LIMIT / 30) ** 1.5;
    for (let i = 0; i < sequence.length - 1; i++) {
        let p1 = sequence[i];
        let p2 = sequence[i + 1];

        let r = (p2 - p1) / 2;
        let mid = (p1 + p2) / 2;

        let mappedR = r * hyp / highest;
        let mappedMid = mid * hyp / highest + OFF;
        let mappedX  = mappedMid * cos(angle);
        let mappedY = height - mappedMid * sin(angle);


        let m = atan(width / height);
        let angleStart = 0.5 * PI + m;
        let angleEnd = 1.50 * PI + m;
        if (i % 2 == 1) {
            angleStart += PI;
            angleEnd += PI;
        }

        push();
        strokeWeight(1);
        stroke(0);
        noFill();
        arc(mappedX, mappedY, 2 * mappedR, 2 * mappedR, angleStart, angleEnd);
        pop();
    }
    pop();
}

function draw() {
    
}