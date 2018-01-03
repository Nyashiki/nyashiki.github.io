
var running = false;
var agent_func = null;

//
// Runボタンが押されたとき，この関数が呼ばれる．
// ここでは何もせずに，一定時間でagentを動かす処理のみ記述する．
//
var run = function() {
  if (!running) {
    agent_func = setInterval(agent_master, 50);
    running = true;
  }
};

//
// Stopボタンが押されたとき，この関数が呼ばれる．
//
var stop = function() {
  if (running) {
    clearInterval(agent_func);
    running = false;
  }
};

//
// agentの動きをここで制御する．
//
var agent_master = function() {
  var dy = [ 0, -1, 1, 0 ];
  var dx = [ -1, 0, 0, 1 ];

  var move_dir = run_agent();
  var y = Environment.agent.y;
  var x = Environment.agent.x;
  var ny = y + dy[move_dir];
  var nx = x + dx[move_dir];
  
  // 移動できない場所へ移動しようとしていたら，エラーを吐く．
  var movable = true;
  if (ny < 0 || ny >= Environment.HEIGHT) {
    movable = false;
  } else if (nx < 0 || nx >= Environment.WIDTH) {
    movable = false;
  } else if (Environment.field[ny][nx] === Environment.OBSTACLE) {
    movable = false;
  }

  if (!movable) {
    console.error("Unable to move to (" + ny + ", " + nx + ")");
    clearInterval(agent_func);
    running = false;

    return;
  }
  
  // エージェントを移動．
  Environment.agent.y = ny;
  Environment.agent.x = nx;

  // 鍵があったら取得．
  var key = Environment.agent.get_key ? 1 : 0; // 移動前の取得情報をメモ．  
  if (ny === Environment.key.y && nx === Environment.key.x) {
    Environment.key.enable = false;
    Environment.agent.get_key = true;
  }

  // 宝箱があったら取得．
  var goal = false;
  if (ny == Environment.treasure.y && nx === Environment.treasure.x) {
    Environment.treasure.enable = false;
    goal = true;
  }

  // ゲームクリアしたら，初期状態にしてもう一度．
  if (goal) {
    // Q値の更新．
    // 鍵を持ってゴールしていたら，報酬100．
    if (Environment.agent.get_key) {
      Q[1][y][x][move_dir] = Q[1][y][x][move_dir] + 0.1 * (100 - Q[1][y][x][move_dir]);
    } // そうでなければ，報酬50． 
    else {
      Q[0][y][x][move_dir] = Q[0][y][x][move_dir] + 0.1 * (50 - Q[0][y][x][move_dir]);
    }
    init();
  } else {
    // Q値の更新．
    var q_max = -9999999;
    for (var i = 0; i < 4; i++) {
      var k = Environment.agent.get_key? 1 : 0;
      if (q_max < Q[k][ny][nx][i]) {
        q_max = Q[k][ny][nx][i];
      }
    }
    Q[key][y][x][move_dir] = Q[key][y][x][move_dir] + 0.1 * (0.95 * q_max - Q[key][y][x][move_dir]);
  }


  draw();
};

//
// agentの動きはここで記述する．
// 戻り値は，移動方向．
//  0: 左，1: 上，2: 下，3: 右
//
// Q学習するエージェント．
//
var iteration = 0;
var run_agent = function() {
  var dy = [ 0, -1, 1, 0 ];
  var dx = [ -1, 0, 0, 1 ];

  iteration++;

  // epsilon
  var epsilon = iteration / 3000;
  
  if (epsilon < Math.random()) {
    // random move
    while (true) {
      var dir = Math.floor(Math.random() * 4); // [0, 3]の乱数を発生．
      var ny = Environment.agent.y + dy[dir];
      var nx = Environment.agent.x + dx[dir];
    
      var movable = true;
      if (ny < 0 || ny >= Environment.HEIGHT) {
        movable = false;
      } else if (nx < 0 || nx >= Environment.WIDTH) {
        movable = false;
      } else if (Environment.field[ny][nx] === Environment.OBSTACLE) {
        movable = false;
      }
    
      if (movable) {
        return dir;
      }
    }
  } else {
    // greedy
    var key = (Environment.agent.get_key)? 1 : 0;
    var y = Environment.agent.y;
    var x = Environment.agent.x;
    
    var max_dir = -1;
    for (var i = 0; i < 4; i++) {
      var ny = y + dy[i];
      var nx = x + dx[i];
      if (ny < 0 || ny >= Environment.HEIGHT) {
        continue;
      }
      if (nx < 0 || nx >= Environment.WIDTH) {
        continue;
      }
      if (Environment.field[ny][nx] === Environment.OBSTACLE) {
        continue;
      }
      var k = (key === 1 || (Environment.key.y === ny && Environment.key.x === nx))? 1 : 0;
      if (max_dir == -1 || Q[k][y][x][i] > Q[key][y][x][max_dir]) {
        max_dir = i;
      } 
    }

    return max_dir;
  }

  return -1; // ここに到達することはない．
};
