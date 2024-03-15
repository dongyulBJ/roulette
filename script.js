let items = ['밴드공연', '퍼스널컬러', '탄생컬러', '세미나 이용권', '카페 이용권', '향수제작 원데이 클래스']; // 초기 항목 목록
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
size = window.innerWidth
canvas.width = size;
canvas.height = size;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let currentRotation = 0;

let dpi = window.devicePixelRatio;
canvas.style.width = "90vw";
canvas.style.height = "90vw";

// 룰렛을 그리는 함수
function drawRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sliceAngle = 2 * Math.PI / items.length;
    ctx.font = size/18 + "px Gamja Flower"; // 폰트 크기 조정
    
    for (let i = 0; i < items.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size/2.2, sliceAngle * i, sliceAngle * (i + 1));
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        // 텍스트 추가
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sliceAngle * i + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';

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