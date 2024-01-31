class Mass {
    constructor(mass, ropeLength, angle, originX = 0, originY = 0) {
        this.mass = mass;
        this.ropeLength = ropeLength;
        this.angle = angle;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.x = originX + ropeLength * sin(angle);
        this.y = originY + ropeLength * cos(angle);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    setRopeLength(ropeLength, originX = 0, originY = 0) {
        this.ropeLength = ropeLength;
        this.x = originX + ropeLength * sin(this.angle);
        this.y = originY + ropeLength * cos(this.angle);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    setAngle(angle, originX = 0, originY = 0) {
        this.angle = angle;
        this.x = originX + this.ropeLength * sin(angle);
        this.y = originY + this.ropeLength * cos(angle);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    draw(originX = 0, originY = 0) {
        push();
        stroke(0);
        strokeWeight(2);
        line(originX, originY, this.x, this.y);
        fill(0);
        ellipse(this.x, this.y, this.mass, this.mass);
        pop();
    }

    update(originX = 0, originY = 0) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;
        this.x = originX + this.ropeLength * sin(this.angle);
        this.y = originY + this.ropeLength * cos(this.angle);
    }

    reset(originX = 0, originY = 0) {
        this.angle = 0;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.x = originX + this.ropeLength * sin(this.angle);
        this.y = originY + this.ropeLength * cos(this.angle);
        this.prevX = this.x;
        this.prevY = this.y;
    }
}

const gravity = 1;
let traceCanvas;

let mass1;
let mass1Slider;
let ropeLength1Slider;
let angle1Slider;

let mass2;
let mass2Slider;
let ropeLength2Slider;
let angle2Slider;

let tags = [];

let startButton;
let isStarted = false;

function setup() {
    createCanvas(800, 800).parent('sketch-holder');

    traceCanvas = createGraphics(width, height);
    traceCanvas.background(220);
    traceCanvas.translate(width / 2, 50);

    // Create the masses
    mass1 = new Mass(40, 200, 0);
    mass2 = new Mass(40, 200, 0, mass1.x, mass1.y);

    // Create the sliders
    tags.push(createP("Set mass 1: ").position(width + 20, 0));
    mass1Slider = createSlider(10, 100, 40, 1).position(width + 120, 7);
    tags.push(createP("Set rope length 1: ").position(width + 20, 40));
    ropeLength1Slider = createSlider(100, 300, 200, 1).position(width + 175, 45);
    tags.push(createP("Set angle 1: ").position(width + 20, 80));
    angle1Slider = createSlider(-PI / 2, PI / 2, 0, 0.01).position(width + 122, 86);

    tags.push(createP("Set mass 2: ").position(width + 320, 0));
    mass2Slider = createSlider(10, 100, 40, 1).position(width + 420, 7);
    tags.push(createP("Set rope length 2: ").position(width + 320, 40));
    ropeLength2Slider = createSlider(100, 300, 200, 1).position(width + 475, 45);
    tags.push(createP("Set angle 2: ").position(width + 320, 80));
    angle2Slider = createSlider(-PI / 2, PI / 2, 0, 0.01).position(width + 422, 86);
    // Create the start button
    startButton = createButton("Start").position(width + 20, 130);
    startButton.mousePressed(() => {
        if (!isStarted) {
            isStarted = true;

            // Disable the sliders
            mass1Slider.attribute("disabled", "");
            ropeLength1Slider.attribute("disabled", "");
            angle1Slider.attribute("disabled", "");
            mass2Slider.attribute("disabled", "");
            ropeLength2Slider.attribute("disabled", "");
            angle2Slider.attribute("disabled", "");

            // Change the button text
            startButton.html("Stop");
        } else {
            isStarted = false;

            // Reset the masses
            mass1.reset();
            mass2.reset(mass1.x, mass1.y);

            // Clear the trace
            traceCanvas.background(220);
            
            // Enable the sliders
            mass1Slider.removeAttribute("disabled");
            ropeLength1Slider.removeAttribute("disabled");
            angle1Slider.removeAttribute("disabled");
            mass2Slider.removeAttribute("disabled");
            ropeLength2Slider.removeAttribute("disabled");
            angle2Slider.removeAttribute("disabled");

            // Change the button text
            startButton.html("Start");
        }
    });

    // Move the sliders and the button into the sketch-holder div
    mass1Slider.parent('sketch-holder');
    ropeLength1Slider.parent('sketch-holder');
    angle1Slider.parent('sketch-holder');
    mass2Slider.parent('sketch-holder');
    ropeLength2Slider.parent('sketch-holder');
    angle2Slider.parent('sketch-holder');
    tags.forEach(tag => tag.parent('sketch-holder'));
    startButton.parent('sketch-holder');

}

function draw() {
    background(220);

    // Show the trace
    image(traceCanvas, 0, 0);
    // Trnslate the origin point to the middle-up of the canvas
    translate(width / 2, 50);

    // Draw the masses
    mass1.draw();
    mass2.draw(mass1.x, mass1.y);
    
    if (!isStarted) {
        mass1.mass = mass1Slider.value();
        mass1.setRopeLength(ropeLength1Slider.value());
        mass1.setAngle(angle1Slider.value());
        mass2.mass = mass2Slider.value();
        mass2.setRopeLength(ropeLength2Slider.value(), mass1.x, mass1.y);
        mass2.setAngle(angle2Slider.value(), mass1.x, mass1.y);
    } else {
        // Calculate the angular acceleration
        // Thanks to Erik Neumann for the formulas! Check their website https://www.myphysicslab.com/pendulum/double-pendulum-en.html
        mass1.angleAcceleration = 
            (-gravity * (2 * mass1.mass + mass2.mass) * sin(mass1.angle) - mass2.mass * gravity * sin(mass1.angle - 2 * mass2.angle) -
                2 * sin(mass1.angle - mass2.angle) * mass2.mass * (mass2.angleVelocity * mass2.angleVelocity * mass2.ropeLength +
                        mass1.angleVelocity * mass1.angleVelocity * mass1.ropeLength * cos(mass1.angle - mass2.angle))) /
            (mass1.ropeLength * (2 * mass1.mass + mass2.mass - mass2.mass * cos(2 * mass1.angle - 2 * mass2.angle)));
        mass2.angleAcceleration =
            (2 * sin(mass1.angle - mass2.angle) * (mass1.angleVelocity * mass1.angleVelocity * mass1.ropeLength * (mass1.mass + mass2.mass) +
                    gravity * (mass1.mass + mass2.mass) * cos(mass1.angle) +
                    mass2.angleVelocity * mass2.angleVelocity * mass2.ropeLength * mass2.mass * cos(mass1.angle - mass2.angle))) /
            (mass2.ropeLength * (2 * mass1.mass + mass2.mass - mass2.mass * cos(2 * mass1.angle - 2 * mass2.angle)));
        // Update
        mass1.update();
        mass2.update(mass1.x, mass1.y);

        // Draw the trace
        traceCanvas.stroke(0);
        traceCanvas.line(mass2.prevX, mass2.prevY, mass2.x, mass2.y);
    }
}
