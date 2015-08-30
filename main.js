'use strict';
(function() {
  var snake, food, playing;
  var clicked = false;

  $(function(){
    $('.grid').append('<div class="msg">Press Play to start the game!</div>');
    $('.play').click(function(event) {
       if (!playing){
        $('.msg').remove();
        playGame();
       }
    });
  });

  function playGame(){
    playing = true;
    var $grid = $('.grid');

    snake = new Snake($grid);
    food = new Food($grid);
    food.make();

    var ID = setInterval(function(){
      if (snake.moving && !snake.gameOver){
        snake.move();
      }
      else if(snake.gameOver){
        clearInterval(ID);
        console.log("game over");
        $grid.append('<div class="msg">Game Over!<br>Press Play to start again.</div>');
        playing = false;
      }
    }, 200);
  }

  $(document).keydown(function (e) {
    snake.vx = snake.vy = 0;
    switch (e.which){
      case 37: //left
        snake.vx = -1;
        break;
      case 38: //up
        snake.vy = -1;
        break;
      case 39: //right
        snake.vx = 1;
        break;
      case 40: //down
        snake.vy = 1;
        break;
    }
  });

  $('.stop').click(function() {
    snake.moving = !snake.moving;
    if (!snake.moving) {
      this.innerHTML = 'Unpause';
    }
    else {
      this.innerHTML = 'Pause Game';
    }
    console.log(snake.moving);
  });

  function collision(item, snakeArray) {
    for (var i = 2; i < snakeArray.length; i++) {
      if(item[0] == snakeArray[i][0] && item[1] == snakeArray[i][1]){
        return true;
      }
    };
    return false;
  }

  function Snake($grid){
    this.moving = true;
    this.position = [[0,0]];
    this.headX = this.position[0][0];
    this.headY = this.position[0][1];
    this.vx = 1;
    this.vy = 0;
    this.size = 10;
    this.gameOver = false;
    this.grid = $grid;
    this.grid.append('<div class="snake"></div>');
  }

  Snake.prototype.Code = function(){
    return $('.snake');
  }

  Snake.prototype.move = function(){
    //new coords
    var snakeHeadX = this.position[0][0] + this.vx*this.size;
    var snakeHeadY = this.position[0][1] + this.vy*this.size;

    if(this.wallCheck(snakeHeadX, snakeHeadY) || collision(this.position[0], this.position)){
      this.endGame();
      food.Code.remove();
    }
    else {
      this.position.unshift([snakeHeadX, snakeHeadY]);
      this.position.pop();

      var t = this;
      this.Code().each(function(index){
        $(this).css({
          top: t.position[index][1],
          left: t.position[index][0]
        });
      });
      // If snake head gets food, move food location
      if (this.position[0][0] == food.x && this.position[0][1] == food.y){
        food.make();
        this.addTail(snakeHeadX, snakeHeadY);
      }
    }
  }

  Snake.prototype.addTail = function(snakeHeadX, snakeHeadY){
    this.grid.append('<div class="snake"></div>');
    this.position.unshift([snakeHeadX, snakeHeadY]);
    this.move();
  }

  Snake.prototype.wallCheck = function(snakeHeadX, snakeHeadY){
    if ((snakeHeadX > this.grid.outerWidth() - 10 || snakeHeadX < 0) || (snakeHeadY > this.grid.outerHeight() - 10 || snakeHeadY < 0)){
      return true;
    }
    else
      return false;
  }

  Snake.prototype.endGame = function(){
    this.Code().remove();
    this.gameOver = true;
  }

  function Food($grid){
    this.size = 10;
    this.x;
    this.y;
    this.gridW = $grid.outerWidth();
    this.gridH = $grid.outerHeight();
    $grid.append('<div class="food"></div>');
    this.Code = $('.food');
  }

  Food.prototype.make = function($grid){
    var xLimit = Math.floor(Math.random()*(this.gridW)/10)*10;
    var yLimit = Math.floor(Math.random()*(this.gridH)/10)*10;
    if (collision([xLimit, yLimit], snake.position)) {
      xLimit = Math.floor(Math.random()*(this.gridW)/10)*10;
      yLimit = Math.floor(Math.random()*(this.gridH)/10)*10;
    }
    this.x = xLimit;
    this.y = yLimit;
    this.Code.css({
        top: this.y,
        left: this.x
      });
  }

}());