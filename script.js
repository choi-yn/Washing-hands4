// 단계별 상태 관리
let step = 0;
const videoList = [
  'movie/1.mp4', // 0
  'movie/2.mp4', // 1
  'movie/3.mp4', // 2
  'movie/4.mp4', // 3
  'movie/5.mp4', // 4
  'movie/6.mp4', // 5
  'movie/7.mp4'  // 6
];
const audioList = [
  'sound/audio_0.mp3', // 0
  'sound/audio_1.mp3', // 1
  'sound/audio_2.mp3', // 2
  'sound/audio_3.mp3', // 3
  'sound/audio_4.mp3', // 4
  'sound/audio_5.mp3', // 5
  'sound/audio_6.mp3', // 6
  'sound/audio_7.mp3'  // 7
];
const effectList = {
  water: 'sound/Faucet Water 1.mp3'
};

const mainVideo = document.getElementById('main-video');
const mainAudio = document.getElementById('main-audio');
const effectAudio = document.getElementById('effect-audio');
const buttonContainer = document.getElementById('button-container');
const startBtn = document.getElementById('start-btn');

function clearButtons() {
  buttonContainer.innerHTML = '';
}

function createButton(id, text, imgSrc) {
  const btn = document.createElement('button');
  btn.id = id;
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = text;
    btn.appendChild(img);
  }
  btn.appendChild(document.createTextNode(text));
  return btn;
}

function playVideo(src, onEnded) {
  mainVideo.src = src;
  mainVideo.load();
  let played = false;
  function tryPlay() {
    if (!played) {
      mainVideo.play();
      played = true;
    }
  }
  mainVideo.oncanplay = () => {
    tryPlay();
    mainVideo.oncanplay = null;
  };
  setTimeout(tryPlay, 100); // 이미 준비된 경우 바로 재생
  if (onEnded) {
    mainVideo.onended = onEnded;
  } else {
    mainVideo.onended = null;
  }
}

function playAudio(src, onEnded) {
  mainAudio.src = src;
  mainAudio.load();
  mainAudio.oncanplay = () => {
    mainAudio.play();
    mainAudio.oncanplay = null;
  };
  if (onEnded) {
    mainAudio.onended = onEnded;
  } else {
    mainAudio.onended = null;
  }
}

function playEffect(src, onEnded) {
  effectAudio.src = src;
  effectAudio.load();
  effectAudio.oncanplay = () => {
    effectAudio.play();
    effectAudio.oncanplay = null;
  };
  if (onEnded) {
    effectAudio.onended = onEnded;
  } else {
    effectAudio.onended = null;
  }
}

function goStep1() {
  // 1.mp4 재생, 시작하기 버튼 표시
  playVideo(videoList[0]);
  clearButtons();
  buttonContainer.appendChild(startBtn);
}

function goStep2() {
  // 시작하기 버튼 누르면 1.mp4를 계속 보여주며 audio_0, audio_1, audio_2 차례로 재생
  playVideo(videoList[0]);
  clearButtons();
  playAudio(audioList[0], () => {
    playAudio(audioList[1], () => {
      playAudio(audioList[2], () => {
        // audio_2 끝나면 수도꼭지 버튼 1초 빠르게 생성
        setTimeout(() => {
          const waterBtn = createButton('bt_water', '수도꼭지', 'image/bt_water.png');
          buttonContainer.appendChild(waterBtn);
          waterBtn.onclick = goStep3;
        }, 0); // 기존보다 1초 빠르게(즉시)
      });
    });
  });
}

function goStep3() {
  // 수도꼭지 버튼 클릭 시 2.mp4, 물소리 재생
  clearButtons();
  playVideo(videoList[1], () => {
    // 2.mp4 끝나면 3.mp4, audio_3, 비누버튼 생성
    playVideo(videoList[2]);
    playAudio(audioList[3]);
    const soapBtn = createButton('bt_soap', '비누', 'image/bt_soap.png');
    buttonContainer.appendChild(soapBtn);
    soapBtn.onclick = goStep4;
  });
  playEffect(effectList.water);
}

function goStep4() {
  // 비누버튼 클릭 시 4.mp4 재생 후 1초 뒤 audio_4 재생
  clearButtons();
  playVideo(videoList[3], () => {
    // 4.mp4 끝나면 화면 멈추고 audio_5 재생, 수도꼭지 버튼 생성
    mainVideo.pause();
    const waterBtn = createButton('bt_water', '수도꼭지', 'image/bt_water.png');
    buttonContainer.appendChild(waterBtn);
    waterBtn.onclick = goStep5;
    playAudio(audioList[5]);
  });
  setTimeout(() => {
    playAudio(audioList[4]);
  }, 1000);
}

function goStep5() {
  // 수도꼭지 버튼 클릭 시 5.mp4, 물소리 재생
  clearButtons();
  playVideo(videoList[4], () => {
    // 5.mp4 끝나면 6.mp4로 바뀌자마자 일시정지, audio_6 재생, 수건버튼 생성
    mainVideo.src = videoList[5];
    mainVideo.load();
    mainVideo.pause();
    playAudio(audioList[6]);
    setTimeout(() => {
      const towelBtn = createButton('bt_towel', '수건', 'image/bt_towel.png');
      buttonContainer.appendChild(towelBtn);
      towelBtn.onclick = goStep6;
    }, 0); // 0.5초 빠르게(즉시)
  });
  playEffect(effectList.water);
}

function goStep6() {
  // 수건버튼 클릭 시 6.mp4 재생
  clearButtons();
  playVideo(videoList[5], () => {
    // 6.mp4 끝나면 7.mp4 재생
    playVideo(videoList[6], () => {
      // 7.mp4 끝나면 '다시 시작하기' 버튼 생성
      const restartBtn = createButton('restart-btn', '다시 시작하기', null);
      buttonContainer.appendChild(restartBtn);
      restartBtn.onclick = () => {
        goStep1();
      };
    });
    setTimeout(() => {
      playAudio(audioList[7]);
    }, 500); // 0.5초 후에 audio_7 재생
  });
}

// 시작하기 버튼 이벤트
startBtn.onclick = () => {
  goStep2();
};

// 첫 화면 진입 시 1단계
window.onload = () => {
  goStep1();
};
