"use strict"

var Environment = { }; // 名前空間
var Q = new Array(2); // Q[key][agent_y][agent_x][dir] 2 * 4 * 4 * 4 = 128

class Unit {
  constructor(y, x) {
    this.y = y;
    this.x = x;
    this.enable = true;
  }
};

// 定数たち
Environment.HEIGHT = 4;
Environment.WIDTH  = 4;

Environment.EMPTY    = 0;
Environment.OBSTACLE = 1;

var load_img_count = 0;

window.onload = function() {
  // キャンバスの取得
  Environment.canvas = document.getElementById("environment_cav"); 

  if (!Environment.canvas || !Environment.canvas.getContext) {
    alert("canvasを正しく取得できませんでした．")
  }

  Environment.ctx = Environment.canvas.getContext("2d");
  
  // エージェントの画像の読み込み．
  Environment.agent_img = new Image();
  Environment.agent_img.src = "img/robot.png";

  // 鍵の画像の読み込み．
  Environment.key_img = new Image();
  Environment.key_img.src = "img/key.png";

  // 宝箱の画像の読み込み．
  Environment.treasure_img = new Image();
  Environment.treasure_img.src = "img/treasure.png";

  // Q値を初期化．
  for (var i = 0; i < 2; i++) {
    Q[i] = new Array(4);
    for (var j = 0; j < 4; j++) {
      Q[i][j] = new Array(4);
      for (var k = 0; k < 4; k++) {
        Q[i][j][k] = new Array(4);
        for (var l = 0; l < 4; l++) {
          Q[i][j][k][l] = Math.random();
        }
      }
    }
  }
  
  init();

  load_img_count = 0;
  // 画像の読み込み待ち．
  Environment.agent_img.onload    = function() { draw(); };
  Environment.key_img.onload      = function() { draw(); };
  Environment.treasure_img.onload = function() { draw(); };
};

//
// environmentの初期化などをここで行う．
//
var init = function() {
  // エージェントの初期化．
  Environment.agent = new Unit(0, 0);
  Environment.agent.get_key = false;

  // 鍵の初期化．
  Environment.key = new Unit(2, 0);
  
  // 宝箱の初期化．
  Environment.treasure = new Unit(0, 3);

  // フィールドの初期化．
  Environment.field = [
    [ Environment.EMPTY,    Environment.EMPTY, Environment.OBSTACLE, Environment.GOAL  ],
    [ Environment.OBSTACLE, Environment.EMPTY, Environment.OBSTACLE, Environment.EMPTY ],
    [ Environment.KEY,      Environment.EMPTY, Environment.OBSTACLE, Environment.EMPTY ],
    [ Environment.OBSTACLE, Environment.EMPTY, Environment.EMPTY,    Environment.EMPTY ]
  ];
};

//
// environmentの描画
//
var draw = function() {
  // 画面をクリア．
  Environment.ctx.beginPath();
  Environment.ctx.clearRect(0, 0, Environment.WIDTH, Environment.HEIGHT);

  // フィールドの描画．
  Environment.ctx.beginPath();
  for (var y = 0; y < Environment.HEIGHT; y++) {
    for (var x = 0; x < Environment.WIDTH; x++) {
      Environment.ctx.fillStyle = "rgb(220, 220, 220)";
      Environment.ctx.fillRect(10 + 100 * x, 10 + 100 * y, 100, 100);         
      if (Environment.field[y][x] === Environment.OBSTACLE) {
        Environment.ctx.fillStyle = "rgb(0, 0, 0)";
        Environment.ctx.fillRect(10 + 100 * x, 10 + 100 * y, 100, 100);         
      }
    }
  }

  // 鍵の描画．
  if (Environment.key.enable) {
    Environment.ctx.drawImage(Environment.key_img, 13 + 100 * Environment.key.x, 12 + 100 * Environment.key.y);
  }
  // 宝箱の描画．
  if (Environment.treasure.enable) {
    Environment.ctx.drawImage(Environment.treasure_img, 13 + 100 * Environment.treasure.x, 12 + 100 * Environment.treasure.y);
  }
  // エージェントの描画．
  Environment.ctx.drawImage(Environment.agent_img, 15 + 100 * Environment.agent.x, 12 + 100 * Environment.agent.y);  

  // Q値の描画．
  var qtable = document.getElementById("qtable");  
  qtable.innerHTML = "";
  for (var j = 0; j < 4; j++) {
    for (var k = 0; k < 4; k++) {
      var max_dir = 0;
      for (var l = 1; l < 4; l++) {
        if (Q[0][j][k][l] > Q[0][j][k][max_dir]) {
          max_dir = l;
        }
      }
      if (max_dir === 0) {
        qtable.innerText += "←";
      } else if (max_dir === 1) {
        qtable.innerText += "↑";
      } else if (max_dir === 2) {
        qtable.innerText += "↓";
      } else if (max_dir === 3) {
        qtable.innerText += "→";        
      } else {
        qtable.innerText += "E";        
      }
    }

    qtable.innerHTML += "&nbsp&nbsp&nbsp&nbsp";
    for (var k = 0; k < 4; k++) {
      var max_dir = 0;
      for (var l = 1; l < 4; l++) {
        if (Q[1][j][k][l] > Q[1][j][k][max_dir]) {
          max_dir = l;
        }
      }
      if (max_dir === 0) {
        qtable.innerText += "←";
      } else if (max_dir === 1) {
        qtable.innerText += "↑";
      } else if (max_dir === 2) {
        qtable.innerText += "↓";
      } else if (max_dir === 3) {
        qtable.innerText += "→";        
      } else {
        qtable.innerText += "E";        
      }
    }

    qtable.innerHTML += "<br>";
  }
};