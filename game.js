let buttonColors = ["red", "blue", "green", "yellow", "purple", "cyan"];
let gamePattern = [];
let userClickedPattern = [];

let gameStarted = false;
let level = 0;

let difficulty = "normal";
let numberOfButtons = 4;
let timeoutReset;

// Main logic for the game loop
function nextSequence() {
    $("#level-title").text(`Level ${level++}`);
    let randomNumber = Math.floor(Math.random() * numberOfButtons);
    let randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);

    $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);

    gameStarted = true;

    userClickedPattern.length = 0;
}

//Plays sound files
function playSound(name) {
    let audio = new Audio(`sounds/${name}.mp3`);
    audio.play();
    audio.volume = 0.05;
}

// Logic that lets the game know which color has been clicked
$(".btn").click(function (e) {
    let userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

// Animating buttons by adding and removing a CSS class after a delay
function animatePress(currentColor) {
    $(`#${currentColor}`).addClass("pressed");
    setTimeout(() => {
        $(`#${currentColor}`).removeClass("pressed");
    }, 100);
}

// Compares the array of the player's clicks against the main game array
function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {

        if (userClickedPattern.length === gamePattern.length) {
            timeoutReset = setTimeout(function () {
                nextSequence();
            }, 1000);
            if (difficulty === "insane") {
                setTimeout(() => {
                    randomOrder();
                }, 500);
            }
        }
    } else {
        if (gameStarted) {
            playSound("wrong");

            $("body").addClass("game-over");
            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 200);

            $("#level-title").text("Game Over");
            gameStarted = false;
            //Used to restart the game when you pressed a key on your keyboard
            // $(document).keypress(function (e) {
            //     startOver();
            // });
        }
    }
}

//Resets all the necessary variables to start the game again
function startOver() {
    gameStarted = false;
    level = 0;
    gamePattern.length = 0;
    $("#level-title").text("Press Start");
    $("#start").text("START");
    clearTimeout(timeoutReset);
}

// Used to start the game when you pressed a key on your keyboard
// $(document).keypress(function (e) {
//     if (!gameStarted) {
//         $("#level-title").text("Level " + level);
//         nextSequence();
//     }
// });

// Functionality for the difficulty buttons
$(".difficulty").click(function () {
    difficulty = `${this.id}`;

    if (!gameStarted) {
        difficultySelection();
    }
});

//Logic for selecting difficulty and make the necessary changes to make everything work with more or less color buttons
function difficultySelection() {
    switch (difficulty) {
        case (difficulty = "normal"):
            numberOfButtons = 4;
            $("#purple").addClass("display-none");
            $("#cyan").addClass("display-none");
            break;

        case (difficulty = "hard"):
            numberOfButtons = 5;
            $("#purple").removeClass("display-none");
            $("#cyan").addClass("display-none");
            break;

        case (difficulty = "extreme"):
            numberOfButtons = 6;
            $("#cyan").removeClass("display-none");
            $("#purple").removeClass("display-none");
            break;

        case (difficulty = "insane"):
            numberOfButtons = 6;
            $("#cyan").removeClass("display-none");
            $("#purple").removeClass("display-none");
            break;
    }
}

//Function to randomize the placement of the color buttons
function randomOrder() {
    let reference = [...buttonColors];
    let newOrder = [];
    newOrder = reference.sort(() => 0.5 - Math.random());

    for (let i = 0; i < reference.length; i++) {
        $("." + buttonColors[i]).attr("id", newOrder[i]);
    }
}

// Start button to start the game, makes the restart button and appear and hides itself
$("#start").click(function () {
    if (!gameStarted) {
        $("#level-title").text("Level " + level);
        nextSequence();
    }
    $("#restart").removeClass("hidden");
    $("#start").addClass("hidden");
});

// Restart button that resets all the necessary variables, makes the start button appear and hides itself
$("#restart").click(function () {
    startOver();
    $("#restart").addClass("hidden");
    $("#start").removeClass("hidden");
});
