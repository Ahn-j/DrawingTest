//canvasAPI사용
//html의 canvas에 접근
const canvas = document.querySelector('canvas');
const colorChange = document.getElementById('color');
//클래스네임 color-option 인 디브들은 배열이아니라 HTMLCollection이기때문에 이벤트를 추가
//하기위해서는 배열로 만들어줘야한다
const colorChangeOption = Array.from(
  document.getElementsByClassName('color-option')
);
const lineWidth = document.getElementById("line-width");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");

const p = document.querySelector("p");
//그림을 그리기위함
const ctx = canvas.getContext('2d');

//상수정의
const CANVAS_WIDTH = 540;
const CANVAS_HEIGHT = 540;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// //힌번에 사각형만들기
// //ctx.fillRect(10, 10, 50, 50);
// //스탭을 나워 사각형만들기
// //일단 선부터 작성후 
// ctx.rect(20, 10, 100, 100);
// ctx.rect(120, 110, 100, 100);
// ctx.rect(220, 210, 100, 100);
// //fill() 하면 사각형이작성됨
// ctx.fill();
// //새로운 사각형을 만들기위함(새로운 경로에서 생성)
// ctx.beginPath();
// ctx.rect(420, 10, 100, 100);
// ctx.rect(320, 110, 100, 100);
// ctx.fillStyle = 'red';
// ctx.fill();

// //선긋기(선으로 사각형만들기)
// ctx.moveTo(50, 50); //선 작성시작점지정
// ctx.lineTo(150, 50);
// ctx.lineTo(150, 150);
// ctx.lineTo(50, 150);
// ctx.lineTo(50, 50);
// ctx.fill();

// //사각형을 사용해 집을 그려보자꾸나 
// ctx.fillRect(100, 200, 40, 200);
// ctx.fillRect(300, 200, 40, 200);
// ctx.lineWidth = 2;
// ctx.strokeRect(195, 300, 50, 100);
// ctx.fillRect(100, 180, 240, 20);
// ctx.moveTo(100, 180);
// ctx.lineTo(225, 50);
// ctx.lineTo(340, 180);
// ctx.fill();

// ctx.beginPath();
// //사람추가
// ctx.fillRect(400, 350, 10, 40);
// ctx.fillRect(390, 350, 2, 20);
// ctx.fillRect(418, 350, 2, 20);
// ctx.arc(405, 338, 10, 0, 2 * Math.PI);
// ctx.fillRect(418, 380, 2, 20);
// ctx.fillRect(390, 380, 2, 20);
// ctx.fill();
// ctx.beginPath();//새로운경로로 작성
// ctx.fillStyle = 'white';
// ctx.arc(402, 336, 2,  Math.PI, 2 * Math.PI);
// ctx.arc(408, 336, 2,  Math.PI, 2 * Math.PI);
// ctx.fill();

//input태그의 벨류값을 라인굵기의 초기값으로 지정
ctx.lineWidth = lineWidth.value;
p.innerText = 'width : ' + lineWidth.value;
//라인끝처리모양지정
ctx.lineCap = "round";
//변수 설정
let isPainting = false;
let isFilling = false;

function onMove(e){
  //isPainting값이 true일때만 선 긋기
  if(isPainting && !isFilling){
    console.log("move")
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(e.offsetX, e.offsetY);
} 
//마우스누른상태일때
function startPainting(){
  //console.log("push")
  isPainting = true;
}
//마우스 뗐을때
function cancelPainting(){
  //console.log("leave")
  isPainting = false;
  //경로 변경(이전의 그은 선의 경로와 다른경로)
  ctx.beginPath();
}
//선 굻기조정
function widthChange(e){
  ctx.lineWidth = e.target.value;
  p.innerText = 'width : ' + e.target.value;
}

function onClickStop(){
  console.log("new!!")
}

function changeColor(e){
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
}

function clickColorOption(e){
  //dataset.color의 값은 div에서 data-color 값으로 준 값을 가져옴
  const colorValue = e.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  //선탣한 색을 input의 값으로 지정
  color.value = colorValue;
}

function onModeClick(){
  if(isFilling){
    isFilling = false;
    modeBtn.innerText = "Fill"
  }else{
    isFilling = true;
    modeBtn.innerText = "Draw"
  }
}

function onCanvasClick(){
  if(isFilling){
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
  }
}

function onDestroyBtn(){
  ctx.fillStyle = "white"
  ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
}

function onEraserClick(){
  ctx.strokeStyle = "white"
  isFilling = false
  modeBtn.innerText = "Fill"
}

function onFileChange(e){
  const file = e.target.files[0];
  //이미지에 접근이 가능한 브라우저에서만 사용가능한 url작성
  const url = URL.createObjectURL(file);
  //이미지생성 (html에서 이미지 태그 선언하는거와 같은의미)
  const image = new Image(); //<image />
  image.src =  url; //<image src="" />
  //이미지가 로드되었을때 ctx에 이미지를 그림
  //그 이미지는 image(image태그), 그 후에는 위치 x,y , 사이즈
  image.onload = function(){ //<image onload="" />
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    URL.revokeObjectURL(url);
    fileInput.value = null;
  }

}

function onDoubleClick(e){
  //textInput의 값을 가져옴
  const text = textInput.value;
  //현재의 컨버스 상태, 색상, 스타일 등 모든것을 저장
  if(text !== ""){
    ctx.save();
    console.log(') : ', ctx.save())
    //굵기 변경(디폴트인 5이면 글자가 안보이기 때문에)
    ctx.lineWidth = 1;
    ctx.font = "60px serif";
    ctx.fillText(text, e.offsetX, e.offsetY);
    //save()함수에서 저장해놨던 모든 값을을 가져옴
    //위에서 굵기를 1로 변경한 내용이 반영되기 전으로 되돌리기위함
    ctx.restore();
    console.log(') : ', ctx.restore())
  }
}

function onSaveClick(){
  //canvas.toDataURL()로 컨버스안의 이미지를 base64로 인코딩된 URL을 받을수있음
  const url = canvas.toDataURL();
  const a = document.createElement("a") // a태그 생성
  a.href = url;
  a.download = "test.png";
  a.click();
  console.log("a :" , a)
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);
canvas.addEventListener('click', onCanvasClick);

colorChange.addEventListener('change', changeColor);
lineWidth.addEventListener("change", widthChange);
//배열을돌면서 하나하나에 이벤트를 추가함
colorChangeOption.forEach(color => color.addEventListener("click", clickColorOption))
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyBtn);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
