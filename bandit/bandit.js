var slotMax   = new Object;
var tryRemain = 50;
var money     = 3000;
var kCost     = 100;
var kGift     = 200;
var kBigGift  = 500;
var result    = "まだ回してない"

window.onload = function() {
  Init();
};

var Init = function() {
  slotMax = [
    10, 15, 12
  ];
};

var SlotClick = function(slotNum) {
  // もう回せない
  if (tryRemain == 0) {
    return;
  }
  // もう所持金がない
  if (money < kCost) {
    return;
  }
  var rnd = Math.floor(Math.random() * slotMax[slotNum - 1]);
  
  tryRemain--;
  money -= kCost;

  // 大当たり
  if (rnd == 0) {
    money +=kBigGift;
    result = '<font color="red">大当たり</font>';
  }
  // 当たり
  else if (rnd < 3) {
    money += kGift;
    result = '<font color="red">当たり</font>';
  }
  // はずれ
  else {
    result = '<font color="blue">はずれ</font>';
  }

  Show();
};

var Show = function() {
  var tryRemainElem = document.getElementById("tryRemain");
  var moneyElem     = document.getElementById("money");
  var resultElem    = document.getElementById("result");

  tryRemainElem.innerHTML = tryRemain;
  moneyElem.innerHTML     = money;
  resultElem.innerHTML        = result; 
}
