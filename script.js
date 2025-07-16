// 현재 시간 업데이트
function updateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('current-time').textContent = now.toLocaleString('ko-KR', options).replace(/\./g, '/').replace(/ /g, ' ');
}
setInterval(updateTime, 1000);
updateTime();

// GSAP 로드 확인
if (typeof gsap !== 'undefined') {
    console.log("GSAP이 성공적으로 로드되었습니다.");
    // GSAP 초기 애니메이션 (페이지 로드 시)
    gsap.from(".gui-header", { duration: 1, y: -100, opacity: 0, ease: "power2.out" });
    gsap.from(".gui-footer", { duration: 1, y: 100, opacity: 0, ease: "power2.out" });
    gsap.from(".left-panel", { duration: 1, x: -100, opacity: 0, ease: "power2.out", delay: 0.5 });
    gsap.from(".right-panel", { duration: 1, x: 100, opacity: 0, ease: "power2.out", delay: 0.5 });
    gsap.from(".main-title", { duration: 1.5, opacity: 0, y: 50, ease: "power3.out", delay: 1 });
    gsap.from(".subtitle", { duration: 1.5, opacity: 0, y: 50, ease: "power3.out", delay: 1.2 });
    gsap.from(".action-button", { duration: 1.5, opacity: 1, y: 0, ease: "power3.out", delay: 1.4 });
} else {
    console.error("GSAP이 로드되지 않았습니다.");
}

// Explore Data 버튼 클릭 이벤트 (예시)
document.getElementById('explore-button').addEventListener('click', () => {
    if (typeof gsap !== 'undefined') {
        gsap.to(".container", { duration: 1, opacity: 0, onComplete: () => {
            // alert 대신 메시지 박스 사용을 권장합니다. 여기서는 간단히 console.log로 대체합니다.
            window.location.href = 'data_explorer.html';
        }});
    } else {
        console.error("GSAP 라이브러리가 로드되지 않아 애니메이션을 실행할 수 없습니다.");
    }
});
