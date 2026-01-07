window.onload = () => {
const gameCanvas = document.getElementById('gameCanvas');
const gameContext = gameCanvas.getContext('2d');

const song = document.getElementById('gameSong');
const normalHitSound = document.getElementById('normalHitSound');
const specialHitSound = document.getElementById('specialHitSound');
const missHitSound = document.getElementById('missHitSound');
const backVideo = document.getElementById('backgroundVideo');


const score = document.querySelector('.score');
const lives = document.querySelector('.lives');
const feedback = document.getElementById('feedbackText');

// play instruction shoud delete it? 
const playInstruction = document.getElementById('playInstruction');

const noteSpeed = 3;
const spawnRate = 500;
const lineX = 150;
const noteSize = 50;

let notes = [];
let scoreValue = 0;
let livesValue = 10;


let alreadyRunning = false;


function playSound(sound){
   if(sound){
        sound.currentTime = 0;
        sound.play();
   }
    
}

function updateElements() {
    score.innerText = `Score: ${scoreValue}`;
    lives.innerText = `Lives: ${livesValue}`;
}

function showFeedback(text, type){
    feedback.innerText = text;
    feedback.className = type;

    setTimeout(() => {
        feedback.innerText = '';
    }, 750);
}

let gameLoop;
let spawnInterval;

function gameOver() {
    alreadyRunning = false;
    clearInterval(spawnInterval);
    cancelAnimationFrame(gameLoop);
    song.pause();
    backVideo.pause();

    alert("It's over, player! You have the final score: " + scoreValue);
    location.reload();
}

function spawnNote(){

    if(Number.isFinite(song.duration) && song.duration > 0){
        if(song.currentTime > song.duration - 12){
            console.log("Ending soon");
            clearInterval(spawnInterval);
            return;
        }
    }
 
    const isRed = Math.random() > 0.5;

    const isSpecial = Math.random() <0.1;

    const note = {
        x: gameCanvas.width,
        y: 80,
        width: 30,
        height: 50,
        color: isSpecial ? 'yellow' : (isRed? 'red':'blue'),
        isSpecial: isSpecial,
        key: isSpecial ? null : (isRed? 'f' : 'j'),
        keySpecial: isSpecial ? 'b' : null,
        hit: false,
        processed: false
    };

    notes.push(note);
}

function draw(){
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    for(let i = 0; i < notes.length; i++){
        const note = notes[i];

        note.x = note.x - noteSpeed;

        if(!note.hit){
            if(!note.isSpecial){
                gameContext.beginPath();
                gameContext.fillStyle = note.color;
           //gameContext.fillRect(note.x,note.y,note.width, note.height);
           gameContext.arc(note.x + 25, note.y + 25, 25, 0, Math.PI * 2);
                gameContext.fillStyle =  note.color;
                 gameContext.fill();
            } else {
                gameContext.fillStyle = "yellow";
                gameContext.fillRect(note.x + 15, note.y - 15, 20, 80);
                //gameContext.fill();
            }
            
            
        }

        

       /* if(note.x + note.width < 0){ b            notes.splice(i,1);
            i--;
        }
            */
        if(!note.hit && !note.processed && (note.x + noteSize) < (lineX - 20)){
            livesValue--;
            scoreValue-=200;
            note.processed = true;
            showFeedback("MISS", "bad");
            updateElements();

            if(livesValue <= 0) {
                gameOver();
            }
        }

        if((note.x + noteSize) < 0){
            notes.splice(i,1);
            i--;
        }
    }

    if(alreadyRunning){
        gameLoop = requestAnimationFrame(draw);
    }

    
}

function startGame() {

    playInstruction.style.display = 'none';
   //
        alreadyRunning = true; 
        song.play();
        backVideo.play();
        spawnInterval = setInterval(spawnNote, spawnRate);
        draw();
        
    
}

document.addEventListener('keydown', (event) => {
    /*if(!alreadyRunning){
        if(event.code === "Space"){
            startGame();
        }
    } */

    if(event.code === "Space"){
        if(alreadyRunning){
            gameOver();
        } else {
            startGame();
        }
    }

    const key = event.key.toLowerCase();
    if(key !== 'f' && key !== 'j' && key !== 'b') {
        return;
    }

    const targetNote = notes.find(n => !n.hit 
        && (n.key === key || n.keySpecial === key) 
        && !n.processed
        && Math.abs((n.x +noteSize/2) - lineX) < 100);

    if(targetNote) {
        const noteCenter = targetNote.x + (noteSize/2);
        const distance = Math.abs(noteCenter - lineX);

        targetNote.hit = true;

        if(distance < 15) {
            if(targetNote.isSpecial){
                playSound(specialHitSound);
                scoreValue += 50;
            } else {
                playSound(normalHitSound);
                scoreValue += 20;
            }
            
            showFeedback("Perfect!", "perfect");
        } else if (distance < 50) {
           if(targetNote.isSpecial){
                playSound(specialHitSound);
                scoreValue += 25;
            } else {
                playSound(normalHitSound);
                scoreValue += 10;
            }
            showFeedback("Good!", "good");
        } else {
            if(!targetNote.isSpecial){
                
                scoreValue -= 10;
            }
            playSound(missHitSound);
            livesValue --;
            showFeedback("Not good!", "bad"); //lol

        }
     } else {
        livesValue--;
        playSound(missHitSound);
        showFeedback("Ooof!", "bad");
     }

     updateElements();
     if(livesValue <= 0){
        gameOver();
     }


    
})

song.onended = () => {
    alert("Round complete! Your score is " + scoreValue + "!");
    location.reload();
}

}

