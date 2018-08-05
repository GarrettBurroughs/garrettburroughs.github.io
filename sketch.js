console.log(Tone.Transport.bpm);
let synth = new Tone.Synth().toMaster();
let low = 2;
let high = 5;
Tone.Transport.bpm._initialValue = 180;
let secondPerMeasure = (1 / Tone.Transport.bpm._initialValue) * 4 * 60;

function setup(){
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    createCanvas(w, h);
    let canvas = document.getElementsByTagName('canvas')[0];    
    canvas.id = "background";
    let div = document.createElement("div");
    div.id = "name"
    document.querySelector("body").appendChild(div);
    playNote();
    initAlgorithm();
}

let particles = [];
function draw(){
    background(40);
    for(let p of particles){
        p.update();
        p.render();
    }
}

let notes = [17.32, 19.45, 23.12, 25.96, 29.14];
function genNote(){
    let startingNote = random(notes);
    let n = notes.indexOf(startingNote);
    let oct = floor(random(low, high)) + 1;
    let endFrequency = startingNote * Math.pow(2, oct);
    let dur = Math.pow(2, (floor(random(0, 3)) + 1));
    // console.log(dur);

    return {
        frequency: endFrequency,
        duration: dur,
        octave: oct,
        note: n
    }
}


class Particle{
    constructor(position, velocity, color){
        this.position = position;
        this.radius = 30;
        this.velocity = velocity;
        this.color = color;
        this.startTime = Date.now();
        this.lifeTime = 3;
    }

    update(){
        this.position.add(this.velocity);
        if(Date.now() - this.startTime > this.lifeTime * 1000){
           let index = particles.indexOf(this);
           particles.splice(index, 1);
        }
    }

    render(){
        fill(this.color);
        noStroke();
        ellipse(this.position.x, this.position.y, this.radius);
    }
}

function burst(x, y, color){
    let particles = [];
    let angle = 0;
    let particleNum = 10;
    for(let i= 0; i < particleNum; i++){
        angle += PI / particleNum;
        particles.push(new Particle(createVector(x, y), createVector(Math.cos(angle), Math.sin(angle)), color));
        particles.push(new Particle(createVector(x, y), createVector(Math.cos(angle + PI), Math.sin(angle + PI)), color));
    }
    return particles;
}

// function mousePressed(){
//     let note = genNote();
//     let xPos = map(note.note * note.octave, low, high * 5, 50, width - 50);
//     let yPos = map(note.duration, 0, 9, 50, height - 50);
//     // console.log(yPos);
//     // console.log(note.note, note.octave, note.duration);

//     particles = particles.concat(burst(xPos, yPos, randomColor()));
//     console.log(note.duration);
//     console.log(8 / note.duration);
//     console.log(note.frequency);
//     synth.triggerAttackRelease(note.frequency, 8 / note.duration + 'n');
// }

function randomColor(){
    return color(random(255), random(255), random(255), 100);
}

function playNote(){
    let note = genNote();
    let xPos = map(note.note * note.octave, low, high * 5, 50, width - 50);
    let yPos = map(note.duration, 0, 9, 50, height - 50);
    particles = particles.concat(burst(xPos, yPos, randomColor()));
    synth.triggerAttackRelease(note.frequency, 8 / note.duration + 'n');
    setTimeout(playNote, 1000 * secondPerMeasure / note.duration);
    console.log(1000 * secondPerMeasure / note.duration);
}
