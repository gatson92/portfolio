/* ------------------------- 전역 상수/변수 ------------------------- */
const body = document.getElementById("app");
/* 
  ①문서의 body 요소에 접근하는 전역 변수
  ②body 대신 다른 요소 접근 시 전역적으로 영향 있음
  ③`document.documentElement`(html 요소) 등으로 변경 가능
*/

const darkBtn = document.getElementById("darkToggle"); 
/* 
  ①다크모드 토글 버튼 노드 참조 (id 기준)
  ②id가 바뀌면 이 코드도 반드시 수정 필요
  ③querySelector("#darkToggle") 등 선택자 변경 가능
*/

const sections = document.querySelectorAll(".section");
/* 
  ①페이드인 애니메이션 적용 대상 섹션들 NodeList
  ②클래스명이 변경되면 애니메이션 동작 안됨
  ③다른 선택자(ex. tag, data-attr)도 가능하나 관리 어려움
*/

const keySeq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown",
                "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; 
/* 
  ①이스터에그 실행용 키 입력 순서 배열 (콘트라 코드)
  ②배열 수정 시 다른 숨겨진 기능으로 변경 가능
  ③다른 코드 예: ['d','a','r','k'] 등
*/

/* 이스터에그 입력 기록용 */
let seqPos = 0;                           
/* 
  ①현재 입력 일치 단계(배열 인덱스)
  ②입력 실패 시 0으로 초기화
  ③배열 길이 초과 시 이스터에그 실행
*/

/* ------------------------- 다크모드 ------------------------- */
function initTheme() {                    
  /* 
    ①페이지 새로고침 시 localStorage에 저장된 테마 상태 읽어 적용
    ②localStorage 키 변경 시 수정 필요
  */
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
  }
}
initTheme();

darkBtn.addEventListener("click", () => { 
  /* 
    ①다크모드 버튼 클릭 시 다크모드 클래스 토글
    ②이벤트 리스너 제거 시 토글 불가
    ③다른 이벤트(예: change)도 사용 가능
  */
  body.classList.toggle("dark");

  /* 현재 테마 상태를 로컬 스토리지에 저장 */
  const theme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);   
  /* 
    ①브라우저 내 저장, 새로고침 후 유지
    ②삭제 시 매번 기본 테마 적용됨
  */
});

/* ------------------------- 스크롤 애니메이션 ------------------------- */
const observer = new IntersectionObserver( 
  /* 
    ①뷰포트 내 섹션 진입 감지용 옵저버 생성
    ②threshold 값으로 화면 내 노출 정도 설정
  */
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");  
        /* 
          ①.hidden 상태에서 .show 클래스로 변경해 애니메이션 시작
          ②클래스명 변경 시 CSS에서도 동일하게 수정 필요
        */
        observer.unobserve(entry.target);    
        /* 
          ①한 번만 실행되도록 옵저버 해제
          ②제거하지 않으면 스크롤할 때마다 반복 실행됨
        */
      }
    });
  },
  { threshold: 0.15 }                       
  /* 
    ①뷰포트 내 15% 보일 때 트리거
    ②0~1 사이 값 조절해 민감도 조정 가능
  */
);

sections.forEach(sec => observer.observe(sec)); 
/* 
  ①각 섹션에 옵저버 등록해 감시 시작
  ②동적 추가 시 재등록 필요
*/

/* ------------------------- 마우스 커서 효과 ------------------------- */
const cursor = document.createElement("div"); 
/* 
  ①커스텀 커서용 div 엘리먼트 생성
  ②다른 태그(ex. span)나 SVG로 변경 가능
*/
cursor.id = "cursor";
body.appendChild(cursor);
/* 
  ①body에 커서 요소 추가해 화면에 표시
  ②css #cursor 스타일과 연동 필요
*/

window.addEventListener("mousemove", e => { 
  /* 
    ①마우스 움직임 감지해 커서 위치 갱신
    ②`pointermove` 이벤트로 대체 가능 (터치/펜 지원)
  */
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  /* 
    ①CSS transform으로 위치 이동해 부드러운 성능 유지
    ②직접 left/top 설정 대비 GPU 가속 효과 있음
  */
});

/* ------------------------- QR 코드 생성 ------------------------- */
function generateQR(text, size = 120) {     
  /* 
    ①문자열 텍스트를 QR 코드로 변환해 캔버스에 그림
    ②크기(size) 조절 가능 (픽셀 단위)
    ③너무 크면 렌더링 속도 저하
  */
  const canvas = document.getElementById("qrcode");
  if (!canvas) return;

  /* 외부 라이브러리 동적 임포트 예시 */
  import("https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js")
    .then(({ default: QRious }) => {
      new QRious({
        element: canvas,
        value: text,
        size
      });
    })
    .catch(console.error);  
    /* 
      ①네트워크 실패 시 에러 콘솔 출력
      ②오프라인 배포 시 내부 번들 포함 필요
    */
}
generateQR(location.href);  
/* 
  ①현재 페이지 URL로 QR 코드 생성
  ②원하는 링크로 변경 가능
*/

/* ------------------------- 카카오톡 공유 ------------------------- */
function shareKakao() {                      
  /* 
    ①카카오톡 공유 함수, HTML onclick에 연결
    ②함수명 변경 시 HTML도 함께 변경해야 함
  */

  if (!window.Kakao) {                       
    /* 
      ①카카오 SDK 없을 때만 로드 (중복 방지)
      ②SDK 주소는 공식 배포처 사용 권장
    */
    const s = document.createElement("script");
    s.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    document.head.appendChild(s);
    s.onload = setupShare;                   
    /* 
      ①SDK 로드 완료 후 공유 기능 초기화
      ②구 IE 대응은 onreadystatechange 사용 가능
    */
  } else setupShare();

  function setupShare() {
    if (!Kakao.isInitialized()) {
      Kakao.init("a77d2e3fab56abe58e2c2da962475674");            
      /* 
        ①카카오 앱 키 입력 필수 (본인 키 사용)
        ②키 없으면 공유 기능 작동 안함
      */
    }
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "나의 포트폴리오",
        description: "모던/미니멀 웹 포트폴리오를 구경해보세요!",
        imageUrl: location.origin + "/assets/images/sample1.png",
        link: { mobileWebUrl: location.href, webUrl: location.href }
      }
    });
  }
}

/* ------------------------- 이스터에그 (키 시퀀스) ------------------------- */
window.addEventListener("keydown", e => {    
  /* 
    ①키 입력 이벤트 감지 (keydown 권장)
    ②keypress는 일부 키 미지원
  */
  if (e.key === keySeq[seqPos]) {
    seqPos++;                                
    /* 
      ①입력한 키가 배열 순서와 일치하면 다음 단계로
      ②다른 시퀀스 로직으로 변경 가능
    */
    if (seqPos === keySeq.length) {
      triggerEasterEgg();                    
      seqPos = 0;                            
      /* 
        ①시퀀스 완성 시 이스터에그 실행 후 초기화
      */
    }
  } else {
    seqPos = 0;                              
    /* 
      ①틀린 키 입력 시 순서 초기화
    */
  }
});

function triggerEasterEgg() {                
  /* 
    ①숨겨진 기능 실행 (예: 다크모드 토글 + 효과음)
    ②원하는 다른 애니메이션/효과로 교체 가능
  */
  body.classList.toggle("dark");             

  /* 간단한 화면 깜빡임 애니메이션 */
  body.animate([{opacity:0.2},{opacity:1}], {duration:600,iterations:2});

  /* 효과음 재생 (브라우저 자동재생 정책 영향 받음) */
  const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.wav");
  audio.play().catch(()=>{});                
  /* 
    ①자동재생 차단 시 오류 무시
    ②로컬 파일로 대체 가능
  */
}

/* ----------------- ② 페이지 전환 마이크로 애니 ----------------- */
document.querySelectorAll('.nav a').forEach(a=>{
  a.addEventListener('click',e=>{
    /* 
      ①네비게이션 클릭 시 부드러운 페이드 아웃 효과
      ②클래스명, 시간 조절 가능
    */
    document.documentElement.classList.add('is-animating');          
    setTimeout(()=>document.documentElement.classList.remove('is-animating'),600);
  });
});

/* 스크롤 시 현재 섹션 하이라이트 */
window.addEventListener('scroll',()=>{
  const pos=scrollY+200; 
  /* 
    ①현재 스크롤 위치 + 200px (기준점 조정 가능)
  */
  document.querySelectorAll('section').forEach(sec=>{
    const link=document.querySelector(`.nav a[href="#${sec.id}"]`);
    if(link){
      const inView=pos>sec.offsetTop && pos<sec.offsetTop+sec.offsetHeight;
      link.classList.toggle('active',inView);
      /* 
        ①현재 보고 있는 섹션의 네비게이션 링크에 active 클래스 토글
        ②스타일 적용 시 시각적 강조 가능
      */
    }
  });
});

/* ----------------- ③ 프로젝트 필터 & 정렬 ----------------- */
const projects = document.querySelectorAll('#projects .project');

document.querySelectorAll('.filter button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelector('.filter .active')?.classList.remove('active');
    btn.classList.add('active');
    filterProjects(btn.dataset.cat);
  });
});
document.getElementById('sortSel').addEventListener('change',e=>{
  sortProjects(e.target.value);
});

function filterProjects(cat){                       
  projects.forEach(p=>{
    const match = cat==="all"||p.dataset.cat===cat; 
    p.style.display = match? "block":"none";
    /* 
      ①카테고리 일치하면 보임, 아니면 숨김
      ②data-cat 속성 관리 필수
    */
  });
}

function sortProjects(type){                        
  const wrap = document.getElementById('projects');
  const arr = Array.from(projects).filter(p=>p.style.display!=="none");
  arr.sort((a,b)=>{
    if(type==="alpha"){ 
      return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
    }
    return b.dataset.date.localeCompare(a.dataset.date); 
    /* 
      ①알파벳순 또는 날짜순 정렬
      ②data-date 속성 YYYY-MM-DD 형식 권장
    */
  }).forEach(p=>wrap.appendChild(p));               
  /* 
    ①정렬 후 DOM 재배치해 순서 변경 적용
  */
}

/* ----------------- ⑧ 접근성 토글 ----------------- */
const accBtn=document.getElementById('accToggle');
let accState=0;                                     
/* 
  0=off, 1=고대비, 2=큰 글씨 상태 순환
*/
accBtn.addEventListener('click',()=>{
  body.classList.remove('high-contrast','big-font');
  accState=(accState+1)%3;
  if(accState===1)body.classList.add('high-contrast');
  if(accState===2)body.classList.add('big-font');
  /* 
    ①각 상태마다 클래스 추가/제거
    ②CSS에서 해당 클래스 스타일 정의 필요
  */
});

/* ----------------- ⑨ PDF 저장 ----------------- */
import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js")
  .then(()=>import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"))
  .then(()=>{document.getElementById('pdfBtn').addEventListener('click',makePDF);});

async function makePDF(){
  const { jsPDF } = window.jspdf;                   
  const canvas = await html2canvas(document.body,{scale:2});
  const pdf = new jsPDF({orientation:'portrait',unit:'px',format:[canvas.width,canvas.height]});
  pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,canvas.width,canvas.height);
  pdf.save('portfolio.pdf');
  /* 
    ①html2canvas로 화면 캡쳐 → jsPDF로 PDF 생성 및 저장
    ②scale 값 조절로 해상도/용량 조절 가능
    ③pdf.save() 함수명 및 옵션 변경 가능
  */
}

/* ----------------- ⑩ Firebase Realtime Chat ----------------- */
/* Firebase 설정 (본인 프로젝트 키 교체 필요) */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_ID.firebaseapp.com",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_ID.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef",
  databaseURL: "https://YOUR_ID-default-rtdb.asia-southeast1.firebasedatabase.app"
};
/* SDK 동적 로드 및 초기화 */
import("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js")
  .then(()=>import("https://www.gstatic.com/firebasejs/10.11.0/firebase-database-compat.js"))
  .then(()=>{
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database().ref("chat");
    const box = document.getElementById('chatBox');

    /* 채팅 입력 폼 제출 이벤트 */
    document.getElementById('chatForm').addEventListener('submit',e=>{
      e.preventDefault();
      const txt=document.getElementById('chatInput').value.trim();
      if(!txt)return;
      db.push({msg:txt,ts:Date.now()});
      e.target.reset();
    });

    /* 실시간 신규 메시지 수신 및 출력 */
    db.limitToLast(50).on('child_added',snap=>{
      const {msg}=snap.val();
      const div=document.createElement('div');
      div.className='msg';
      div.textContent=msg;
      box.appendChild(div);
      box.scrollTop=box.scrollHeight;
    });
  }).catch(console.error);
/* 
  ①Firebase 실시간 DB 연동
  ②본인 DB 주소 및 키 반드시 교체
  ③채팅 메시지 50개만 유지, 초과 시 자동 삭제(설정 변경 가능)
*/

/* ------------------------- 콘솔 안내 ------------------------- */
console.info("%c🚀 포트폴리오 스크립트 로드 완료", "color:#4f46e5;font-size:14px;");
/* 
  ①스크립트 정상 로드 알림
  ②삭제 가능
*/


