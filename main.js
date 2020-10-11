'use strict';
(function() {
  var snake, food, playing, score;
  var clicked = false;

  // $(function(){
  //   setGame();
  // });


  $('.new').click(function(event) {
    score = 0;
    $('.score').html(score);
    $(this).html('').hide();
    $('.grid').css({
      'width': '',
      'height': '',
      'flex-grow': ''
    });
    playGame('x');
  });

  // $('.new').click(function(event) {
  //   score = 0;
  //   $('.score').html(score);
  //   $(this).hide();
  //   $('.level').show();
  // });

  // $('.level').click(function(event) {
  //   $('.level').hide();
  //   var x = $(this).attr('value');
  //   playGame(x);
  // });

  // $('.msg').click(function(event) {
  //   setGame();
  //   $('.msg').hide();
  // });

  // function setGame(){
  //   $('.new').show();
  // }

  // function setUp(snake, food, $grid){
  //   var newWidth = $grid.width()/(Math.floor($grid.width()/snake.Code().width()));
  //   snake.size = newWidth;
  //   $('.snake').css({
  //     'width': snake.size,
  //     'padding-bottom': snake.size,
  //   });

  // }

  function playGame(level){
    playing = true;
    snake = null;
    food = null;
    var $grid = $('.grid');

    snake = new Snake($grid);
    snake.size = snake.Code().width();

    //change height to match snake size, which is based on width to create correct grid size
    $grid.css({
      'width': Math.floor($grid.width()/snake.size)*snake.size,
      'height': Math.floor($grid.height()/snake.size)*snake.size,
      'flex-grow': 0
    });

    //adding padding bottom equal to width
    $('.snake').css('padding-bottom', snake.size);


    food = new Food($grid);
    food.make();
    food.Code.css({
      "padding-bottom" : food.size
    });

    var ID = setInterval(function(){
      if (snake.moving && !snake.gameOver){
        snake.move();
        $('.score').html(score);
      }
      else if(snake.gameOver){
        clearInterval(ID);
        console.log('game over');
        $('.new').show('fast', function() {
          $(this).html('Play Again?');
        });
        playing = false;
      }
    }, 200);
  }

  $(document).keydown(function (e) {
    if(playing){
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
    }
  });

  document.addEventListener('swiped-left', function(e) {
    if (playing) {
      snake.vx = snake.vy = 0;
      snake.vx = -1;
      console.log("left")
    }
  });

  document.addEventListener('swiped-right', function(e) {
    if (playing) {
      snake.vx = snake.vy = 0;
      snake.vx = 1;
      console.log("right")
    }
  });

  document.addEventListener('swiped-up', function(e) {
    if (playing) {
      snake.vx = snake.vy = 0;
      snake.vy = -1;
      console.log("up")
    }
  });

  document.addEventListener('swiped-down', function(e) {
    if (playing) {
      snake.vx = snake.vy = 0;
      snake.vy = 1;
      console.log("down")
    }
  });

  // $('.stop').click(function() {
  //   snake.moving = !snake.moving;
  //   if (!snake.moving) {
  //     this.innerHTML = 'Unpause';
  //   }
  //   else {
  //     this.innerHTML = 'Pause Game';
  //   }
  //   console.log(snake.moving);
  // });

  function Snake($grid){
    this.grid = $grid;
    this.grid.prepend('<div class="snake head"></div>');
    this.moving = true;
    this.position = [[0,0]];
    this.headX = this.position[0][0];
    this.headY = this.position[0][1];
    this.vx = 0;
    this.vy = 0;
    // this.size = this.Code.width();
    this.size = 50;
    this.gameOver = false;
  }

  Snake.prototype.Code = function(){
    return $('.snake');
  }

  Snake.prototype.move = function(){
    // this.size = this.Code().width();

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
        score++;
        food.make();
        this.addTail(snakeHeadX, snakeHeadY);
      }
    }
  }

  Snake.prototype.addTail = function(snakeHeadX, snakeHeadY){
    this.grid.append('<div class="snake"></div>');
    this.Code().css('padding-bottom', this.size);
    this.position.unshift([snakeHeadX, snakeHeadY]);
    this.move();
  }

  Snake.prototype.wallCheck = function(snakeHeadX, snakeHeadY){
    if ((snakeHeadX > this.grid.width() - 10 || snakeHeadX < 0) || (snakeHeadY > this.grid.height() - 10 || snakeHeadY < 0)){
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
    this.x;
    this.y;
    this.gridW = $grid.width();
    this.gridH = $grid.height();
    $grid.append('<div class="food"></div>');
    this.Code = $('.food');
    this.size = this.Code.width();
  }

  Food.prototype.make = function($grid){
    var xR = Math.floor(Math.random()*(this.gridW/this.size));
    var yR = Math.floor(Math.random()*(this.gridH/this.size));
    var xLimit = xR*this.size;
    var yLimit = yR*this.size;
    // var xLimit = Math.floor(Math.random()*(this.gridW/this.size))*this.size;
    // var yLimit = Math.floor(Math.random()*(this.gridH/this.size))*this.size;
    console.log('xR ' + xR + '* size ' + this.size + '=xlimit ' + xLimit);
    console.log('yR ' + yR + '* size ' + this.size + '=ylimit ' + yLimit);
    console.log('end');
    if (collision([xLimit, yLimit], snake.position)) {
      xLimit = Math.floor(Math.random()*(this.gridW/this.size))*this.size;
      yLimit = Math.floor(Math.random()*(this.gridH/this.size))*this.size;
      console.log('food collision');
    }
    this.x = xLimit;
    this.y = yLimit;
    this.Code.css({
        top: this.y,
        left: this.x
      });
  }

  function collision(item, snakeArray) {
    for (var i = 2; i < snakeArray.length; i++) {
      if(item[0] == snakeArray[i][0] && item[1] == snakeArray[i][1]){
        return true;
      }
    };
    return false;
  }

}());