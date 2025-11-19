const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NOTE_SPEED = 3;
const SPAWN_RATE = 1000;

let notes = [];

function spawnNote(){
    const isRed = Math.random() > 0.5;

    const note = {
        x: canvas.width,
        y: 80,
        width: 50,
        height: 50,
        color: isRed ? 'red' : 'blue'
    };

    notes.push(note);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < notes.length; i++){
        const note = notes[i];

        note.x = note.x - NOTE_SPEED;

        ctx.fillStyle = note.color;
        ctx.fillRect(note.x,note.y,note.width, note.height);

        if(note.x + note.width < 0){
            notes.splice(i,1);
            i--;
        }
    }

    requestAnimationFrame(draw);
}

setInterval(spawnNote, SPAWN_RATE);
draw();
