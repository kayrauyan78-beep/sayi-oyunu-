let numbers = [];
let target = 0;
let userInput = "";
let attempts = 0;

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame(){
  userInput = "";
  attempts = 0;
  document.getElementById("message").innerText = "";
  numbers = [];
  for(let i=0;i<4;i++){
    numbers.push(Math.floor(Math.random()*9)+1);
  }
  document.getElementById("numbers").innerText = "Sayılar: " + numbers.join(", ");
  generateTarget();
  document.getElementById("display").innerText = "";
  if(document.getElementById("voiceToggle").checked){
    speak("Sayılar: " + numbers.join(", "));
    speak("Hedef: " + target);
  }
}

function generateTarget(){
  let ops = ['+','-','*'];
  while(true){
    let a = numbers[0], b = numbers[1], c = numbers[2], d = numbers[3];
    let op1 = ops[Math.floor(Math.random()*3)];
    let op2 = ops[Math.floor(Math.random()*3)];
    let op3 = ops[Math.floor(Math.random()*3)];
    let result = calculateL2R(a, op1, b, op2, c, op3, d);
    if(result > 0 && Number.isInteger(result)){
      target = result;
      document.getElementById("target").innerText = "Hedef: " + target;
      break;
    }
  }
}

function calculateL2R(a, op1, b, op2, c, op3, d){
  let res = operate(a, op1, b);
  res = operate(res, op2, c);
  res = operate(res, op3, d);
  return res;
}

function operate(x, op, y){
  if(op=='+') return x+y;
  if(op=='-') return x-y;
  if(op=='*') return x*y;
  if(op=='/') return x/y;
}

function clickButton(val){
  if(val=='C'){ userInput=""; document.getElementById("display").innerText=""; return; }
  userInput += val;
  document.getElementById("display").innerText = userInput;
}

function calculate(){
  let tokens = userInput.split(/([+\-*/])/);
  if(tokens.length != 7){ wrongAnswer(); return; }
  let a = parseInt(tokens[0]), b = parseInt(tokens[2]), c = parseInt(tokens[4]), d = parseInt(tokens[6]);
  let op1 = tokens[1], op2 = tokens[3], op3 = tokens[5];
  let result = calculateL2R(a, op1, b, op2, c, op3, d);
  if(result == target){
    document.getElementById("message").innerText = "Tebrikler! Doğru!";
    if(document.getElementById("voiceToggle").checked) speak("Tebrikler! Doğru!");
  }else{
    attempts++;
    if(attempts >= 3){
      let answer = `${numbers[0]} ${op1} ${numbers[1]} ${op2} ${numbers[2]} ${op3} ${numbers[3]}`;
      document.getElementById("message").innerText = "Üzgünüm! Cevap: " + answer;
      if(document.getElementById("voiceToggle").checked) speak("Üzgünüm! Cevap: " + answer);
    }else{
      wrongAnswer(result);
    }
  }
}

function wrongAnswer(res){
  document.getElementById("message").innerText = "Yanlış! Sonuç: " + res;
  if(document.getElementById("voiceToggle").checked) speak("Yanlış! Sonuç " + res);
  userInput="";
  document.getElementById("display").innerText="";
}

function speak(text){
  let msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'tr-TR'; // Türkçe sesi ayarladık
  window.speechSynthesis.speak(msg);
}
