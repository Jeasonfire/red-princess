/*
 *  Red Princess is an action platformer game.
 *  Copyright (C) 2014 Jens "Jeasonfire" Pitkänen

 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Include functions related to player

var PLAYER_SPEED = 100;
var PLAYER_SPEED_RUN = PLAYER_SPEED * 2;
var PLAYER_JUMP_SPEED = -300;
var PLAYER_VARIABLE_JUMP_TIME = 120;

var pRunning = false;
var pOnFloor = false;
var pFiring = false;
var pFiringHand = 0;
var pFiringDirection = "right";
var pSpeed = PLAYER_SPEED;
var pDir = "still"; // This should only be "still", "left" or "right"
var pLastDir = pDir;
var pJumpTime = 0; // Used for variable jump timing
var pAnimPriority = 0;
var pAnimCurrent = "standstill";
var pAnimPlay = false;

function playerInput() {
    // Running
    if (isRunKeyDown() && pOnFloor) {
        pSpeed = PLAYER_SPEED_RUN;
    } else if (!isRunKeyDown()) {
        pSpeed = PLAYER_SPEED;
    }

    // Left/right movement
    if (isLeftKeyDown() && !isRightKeyDown()) {
        player.body.velocity.x = -pSpeed;
    } else if (isRightKeyDown() && !isLeftKeyDown()) {
        player.body.velocity.x = pSpeed;
    } else {
        player.body.velocity.x = 0;
    }

    // Jumping
    if (isUpKeyDown() && pOnFloor) {
        player.body.velocity.y = PLAYER_JUMP_SPEED;
        pJumpTime = game.time.now + PLAYER_VARIABLE_JUMP_TIME;
    } else if (isUpKeyDown() && game.time.now < pJumpTime) {
        player.body.velocity.y = PLAYER_JUMP_SPEED;
    }

    // Firing
}

function playerUpdate() {
    pRunning = pSpeed > PLAYER_SPEED;
    pOnFloor = player.body.onFloor();
    pLastDir = pDir;
    if (player.body.velocity.x < 0) {
        pDir = "left";
    } else if (player.body.velocity.x > 0) {
        pDir = "right";
    } else {
        pDir = "still";
    }
}

function playerAnimate() {
    restartAnimationParams();
    if (pDir == "still") {
        // Player not moving left or right
        if (pOnFloor) {
            setAnimationAndPlay(1, "standstill");
        } else {
            setAnimationAndPlay(1, "jumpstill");
        }
    } else {
        if (!pOnFloor) {
            // In air, play air animation
            setAnimationAndPlay(2, "jump" + pDir);
        }
        if (!pRunning) {
            // Not running, walk around
            setAnimationAndPlay(1, "walk" + pDir);
        } else {
            // Running, run around
            setAnimationAndPlay(1, "run" + pDir);
        }
    }
    playAnimation();
}

function restartAnimationParams() {
    pAnimPriority = 0;
    pAnimPlay = false;
    if (player.animations.getAnimation(pAnimCurrent).isFinished) {
        pAnimCurrent = "";
    }
}

function setAnimationAndPlay(animPriority, anim) {
    setAnimPlay(animPriority, setAnimation(animPriority, anim));
}

// Returns true if animation is not playing, false if prioritycheck failed or 
// animation already playing
function setAnimation(animPriority, anim) {
    if (animPriority >= pAnimPriority) {
        pAnimPriority = animPriority;
        var sameAnim = anim != pAnimCurrent;
        pAnimCurrent = anim;
        return sameAnim;
    }
    return false;
}

function setAnimPlay(animPriority, play) {
    if (animPriority >= pAnimPriority) {
        pAnimPlay = play;
    }
}

function playAnimation() {
    if (!pAnimPlay) {
        return;
    }
    player.animations.play(pAnimCurrent);
}