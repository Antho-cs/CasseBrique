let canvas = document.getElementById("myCanvas");
let margeCanva = (document.body.offsetWidth - canvas.width)/2;
let ctx = canvas.getContext("2d");

const COLOR = "#0C1B6D";

// Définit l'interval de frame (mouvement)
let interval = setInterval(draw, 10);

// Position de la balle
let x = canvas.width/2;
let y = canvas.height-30;

// Direction de la balle
let dx = 2;
let dy = -2;

// Contour de la balle
let ballRadius = 10;

// Position de la plateforme de base
PtX = canvas.width/2-50 ;
PtY = canvas.height-30;

// Variable pour les bricks
let brWidth = 75;
let brHeight = 20;
let brRow = 4;
let brColumn = 9
let brPadding = 10;
let brOffsetTop = 30;
let brOffsetLeft = 30;

let bricks = [];
for(let Column = 0; Column < brColumn; Column++) {
    bricks[Column] = [];
    for(let Row = 0; Row < brRow; Row++) {
        bricks[Column][Row] = { PoX: 0, PoY: 0, status: 1 };
    }
}

let score = 0;

// Création de la balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.closePath();
// Colision Mur
    // Changement de direction : Largeur
    // Si la somme de x et dx est supérieur à (la largeur de la fenetre - la taille de la balle )
    // OU
    // Si la somme de x et dx est inférieur à la taille de la balle
    // direction opposé
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius ) {
        dx = -dx;
    }
    // Changement de direction : Hauteur
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

}
// Création de la plateforme
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(PtX, PtY, 100, 20);
    ctx.fillStyle = COLOR;
    ctx.fill();
    ctx.closePath();

    document.body.onmousemove = event => {
        //  console.log(`Position de la souris : X : ${event.clientX} , Y : ${event.clientY}`);
        let mouseX = event.clientX;
        // Position de la souris - la marge de la fenetre  - la moitié de la platforme (100/2)
        PtX = mouseX - ((document.body.offsetWidth - canvas.width) /2 ) -50;

        // Gestion de la sortie de la souris
        if ( mouseX <  margeCanva + 50) {
            PtX = 0;
        }
        if ( mouseX > margeCanva + canvas.width - 50) {
            PtX = canvas.width - 100;
        }
    }
    // Colision plateforme
    // Si la Plat Y = position balle
    // ET
    // Si la Plat X - la moitie de la Plat est inférieur à position balle
    // ET
    // Si la Plat X + la taille de la Plat est Supérieur à position balle
    if (PtY === y + dy  && PtX - 50 < x + dx && PtX + 100 > x + dx){

        dy = -dy;
    }
    if (PtY < y - 10) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
    }
}

function  drawBricks() {

    for ( let Column = 0; Column < brColumn; Column++) {
        for (let Row = 0; Row < brRow; Row++) {
            if(bricks[Column][Row].status === 1) {
                // Position des briques
                let brX = (Column * (brWidth + brPadding)) + brOffsetLeft;
                let brY = (Row * (brHeight + brPadding)) + brOffsetTop;
                bricks[Column][Row].PoX = brX;
                bricks[Column][Row].PoY = brY;

                ctx.beginPath();
                ctx.rect(brX, brY, brWidth, brHeight);
                ctx.fillStyle = COLOR;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = COLOR;
    ctx.fillText("Score: "+score, 8, 20);
}

function detectColision() {
    for (let Column = 0; Column < brColumn; Column++) {
        for (let Row = 0; Row < brRow; Row++) {
            let b = bricks[Column][Row];
            if (b.status === 1) {
                // Colision avec une Briques
                if (x > b.PoX && x < b.PoX + brWidth && y > b.PoY && y < b.PoY + brHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brRow * brColumn) {
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

    function draw() {

        // Efface les traces de la balle
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawPlatform();
        drawBall();
        detectColision();
        drawScore();

        // Donne le mouvement de la balle
        x += dx;
        y += dy;

    }




