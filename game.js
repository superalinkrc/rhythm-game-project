window.onload = () => {
const gameCanvas = document.getElementById('gameCanvas');
const gameContext = gameCanvas.getContext('2d');

const noteSpeed = 3;
const spawnRate = 1000;

let notes = [];

function spawnNote(){
    const isRed = Math.random() > 0.5;

    const note = {
        x: gameCanvas.width,
        y: 80,
        width: 50,
        height: 50,
        color: isRed ? 'red' : 'blue'
    };

    notes.push(note);
}

function draw(){
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    for(let i = 0; i < notes.length; i++){
        const note = notes[i];

        note.x = note.x - noteSpeed;

        gameContext.fillStyle = note.color;
        gameContext.fillRect(note.x,note.y,note.width, note.height);

        if(note.x + note.width < 0){
            notes.splice(i,1);
            i--;
        }
    }

    requestAnimationFrame(draw);
}

setInterval(spawnNote, spawnRate);
draw();

}

