let items = ['밴드공연', '퍼스널컬러', '탄생컬러', '세미나 이용권', '카페 이용권', '향수제작 원데이 클래스']; // 룰렛 항목 생성

const canvas = document.getElementById('rouletteCanvas');//canvas 변수를 만드는 부분, id가 rouletteCanvas인 캔버스(html파일 안에 있음)에 canvas 변수를 사용해 접근할 수 있음

const ctx = canvas.getContext('2d');//ctx 변수를 만드는 부분, 위에서 만든 canvas 변수와 연계함, ctx 변수를 사용하여 캔버스에 그래픽 작업을 수행할 수 있음

size = window.innerWidth
canvas.width = size;
canvas.height = size;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let currentRotation = 0;

let dpi = window.devicePixelRatio;
canvas.style.width = "90vw";//룰렛판 넓이 조절
canvas.style.height = "90vw";//룰렛판 높이 조절

// 룰렛을 그리는 함수
function drawRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//룰렛 캔버스 초기화
    const sliceAngle = 2 * Math.PI / items.length;//룰렛 항목 갯수에 따라 슬라이스의 각도를 계산후 sliceAngle 변수에 저장
    ctx.font = size/18 + "px Gamja Flower"; // 룰렛의 폰트 크기 조절

    const value = canvas.dataset.value;//룰렛판 data-value 가져와서 저장

    //반복문을 사용해 룰렛 항목의 수 만큼 룰렛의 슬라이스 생성
    for (let i = 0; i < items.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);//룰렛의 중심 좌표로 이동
        ctx.arc(centerX, centerY, size/2.2, sliceAngle * i, sliceAngle * (i + 1));//주어진 중심 좌표와 반지름으로 원호를 그림
        switch (value) {//색상 선택
            case 'seomyeon':
                ctx.fillStyle = 'green';
              break;
            case 'donglae':
                ctx.fillStyle = 'cyan';
              break;
            default:
                ctx.fillStyle = 'yellow';
              break;
          }
        ctx.fill();//채색
        ctx.stroke();//경로를 따라 선을 그리고 선의 스타일 적용

        // 룰렛의 텍스트 추가
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sliceAngle * i + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';//룰렛의 폰트 색상 조절

        ctx.translate(size/3,0);
        ctx.rotate(Math.PI / 2);
        wrapText(ctx, items[i], 0, 0, size/19, size/4);
        ctx.restore();
    }
}

// 텍스트 줄바꿈 함수
function wrapText(context, text, x, y, lineHeight, maxWidth) {
    let words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// 삼각형 마커를 그리는 함수
function drawMarker() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX, size/8); // 마커의 위치를 캔버스 상단 중앙으로 설정
    ctx.lineTo(centerX - size/48, size/24); // 삼각형의 너비와 높이 조정
    ctx.lineTo(centerX + size/48, size/24);
    ctx.closePath();
    ctx.fill();
}

window.onload = function() {
    drawRoulette();
    drawMarker();
};

// "돌리기" 버튼 클릭 이벤트
document.getElementById('spinButton').addEventListener('click', function() {
    let randomDegree = Math.floor(Math.random() * 360) + 720;
    let rotation = currentRotation + randomDegree;
    currentRotation = rotation % 360;
    
    let start = Date.now();
    let duration = 5000;

    (function rotateRoulette() {
        let timePassed = Date.now() - start;
        if (timePassed >= duration) {
            timePassed = duration;
        }

        let newAngle = easeOut(timePassed, currentRotation, randomDegree, duration);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(newAngle * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
        drawRoulette();
        ctx.restore();
        drawMarker();

        if (timePassed < duration) {
            requestAnimationFrame(rotateRoulette);
            drawMarker();
        }
    })();
});

// 감속 애니메이션 함수
function easeOut(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

// 초기 룰렛 그리기
drawRoulette();
drawMarker();