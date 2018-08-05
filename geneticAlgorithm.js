class word{
    constructor(a, b){
        this.chars = [];
        this.low = 32; 
        this.high = 122;
        if(!b){
            this.chars = new Array(a);
            for(let i = 0; i < this.chars.length; i++){
                this.chars[i] = random(this.low, this.high);
            }
        }else if(a && b){
            // console.log(a);
            // console.log(b);
            for(let i = 0; i < a.chars.length; i++){
                if(Math.random() < .5){
                    // console.log(a.chars[i]);
                    this.chars.push(a.chars[i]);
                }else{
                    // console.log(b.chars[i]);
                    this.chars.push(b.chars[i]);
                }
                if(Math.random() < 0.005){
                    this.chars[i] = random(this.low, this.high);
                }
                // console.log(this.chars);
            }
            // console.log(this.chars);
        }
    }

    calculateFitness(target){
        let fitness = 0;
        for(let i = 0; i < target.length; i++){
            if(toInt(target[i]) === this.chars[i]) fitness += 10;
            // console.log(target[i]);
            // console.log(this.chars[i]);
            // console.log(toInt(target[i]));
        }
        return fitness; 
    }

    getWord(){
        let out = "";
        for(let letter of this.chars){
            out += String.fromCharCode(letter);
        }
        return out; 
    }

    getDNA(){
        return this.chars;
    }

    copy(){
        // console.log(this);
        return new word(this, this);
    }
}

const populationSize = 2000;
const generations = 100;
let target = "Garrett Burroughs"
let population = [];
let name;
let algorithm;

function initAlgorithm(){
    name = document.getElementById("name");
    algorithm =  setInterval(runGeneration, 200);

}

for(let i = 0; i < populationSize; i++){
    population.push(new word(target.length));
}

// console.log(population);
function runGeneration(){
    let parentPool = [];
    for(let member of population){
        for(let i = 0; i < member.calculateFitness(target); i++){
            parentPool.push(member.copy());
        }
    }

    // console.log(parentPool);

    population = [];

    for(let i = 0; i < populationSize; i++){
        population.push(new word(random(parentPool), random(parentPool)));
    }


    let bestIndex = 0;
    for(let i = 0; i < populationSize; i++){
        if(population[i].calculateFitness(target) > population[bestIndex].calculateFitness(target)){
            bestIndex = i;
        }
    }
    name.innerHTML = population[bestIndex].getWord();
    if(population[bestIndex].getWord() === target){
        // console.log("done");
        clearInterval(algorithm);
    }
}


function toInt(char){
    return char.charCodeAt(0);
}

function random(a, b){
    if(a instanceof Array && !b){
        return a[random(a.length)];
    }else if(b){
        return Math.floor(Math.random() * (b - a)) + a;
    }else{
        return Math.floor(Math.random() * a);
    }
}
