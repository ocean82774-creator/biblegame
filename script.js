class BibleGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.timer = null;
        this.timeLeft = 15;
        this.isGameActive = false;
        
        this.initializeQuestions();
        this.bindEvents();
    }

    // 성경 문제 데이터 초기화
    initializeQuestions() {
        this.questions = [
            {
                verse: "여호와는 나의 목자이시니 내게 부족함이 없으리로다",
                blank: "목자이시니",
                hint: "ㅁㅈㅇㅅㄴ",
                fullVerse: "여호와는 나의 목자이시니 내게 부족함이 없으리로다 (시편 23:1)"
            },
            {
                verse: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니",
                blank: "사랑하사",
                hint: "ㅅㄹㅎㅅ",
                fullVerse: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 (요한복음 3:16)"
            },
            {
                verse: "모든 일에 감사하라 이것이 그리스도 예수 안에서 너희를 향한 하나님의 뜻이니라",
                blank: "감사하라",
                hint: "ㄱㅅㅎㄹ",
                fullVerse: "모든 일에 감사하라 이것이 그리스도 예수 안에서 너희를 향한 하나님의 뜻이니라 (데살로니가전서 5:18)"
            }
        ];
    }

    // 이벤트 바인딩
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('submit-btn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
        document.getElementById('save-btn').addEventListener('click', () => this.saveCertificate());
    }

    // 게임 시작
    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.showScreen('game-screen');
        this.displayQuestion();
        this.startTimer();
    }

    // 화면 전환
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // 문제 표시
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = question.verse.replace(question.blank, `(${question.hint})`);
        
        document.getElementById('question-text').textContent = questionText;
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
        
        // 결과 메시지 숨기기
        document.getElementById('result-message').classList.add('hidden');
        document.getElementById('flying-image').classList.add('hidden');
    }

    // 타이머 시작
    startTimer() {
        this.timeLeft = 15;
        this.isGameActive = true;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    // 타이머 업데이트
    updateTimer() {
        const timerFill = document.getElementById('timer-fill');
        const timerText = document.getElementById('timer-text');
        
        const percentage = (this.timeLeft / 15) * 100;
        timerFill.style.width = percentage + '%';
        timerText.textContent = this.timeLeft;
        
        // 타이머 색상 변경
        if (this.timeLeft <= 5) {
            timerFill.style.background = 'linear-gradient(90deg, #f56565, #e53e3e)';
        } else if (this.timeLeft <= 10) {
            timerFill.style.background = 'linear-gradient(90deg, #ed8936, #dd6b20)';
        }
    }

    // 시간 초과
    timeUp() {
        this.isGameActive = false;
        clearInterval(this.timer);
        this.showResult(false, "시간 초과!");
    }

    // 답안 확인
    checkAnswer() {
        if (!this.isGameActive) return;
        
        const userAnswer = document.getElementById('answer-input').value.trim();
        const correctAnswer = this.questions[this.currentQuestion].blank;
        
        if (userAnswer === correctAnswer) {
            this.score++;
            this.playSound('assets/Ascending 3.mp3');
            this.showResult(true, "🎯 정답입니다!");
        } else {
            this.playSound('assets/fail_02.mp3');
            this.showFlyingImage();
            this.showResult(false, "아쉽습니다!");
        }
    }

    // 결과 표시
    showResult(isCorrect, message) {
        this.isGameActive = false;
        clearInterval(this.timer);
        
        const resultText = document.getElementById('result-text');
        const fullVerse = document.getElementById('full-verse');
        const resultMessage = document.getElementById('result-message');
        
        resultText.textContent = message;
        fullVerse.textContent = this.questions[this.currentQuestion].fullVerse;
        
        if (isCorrect) {
            resultText.style.color = '#38a169';
        } else {
            resultText.style.color = '#e53e3e';
        }
        
        resultMessage.classList.remove('hidden');
        
        // 0.3초 후 다음 문제로 진행
        setTimeout(() => {
            this.nextQuestion();
        }, 300);
    }

    // 날아가는 이미지 표시
    showFlyingImage() {
        const flyingImage = document.getElementById('flying-image');
        flyingImage.classList.remove('hidden');
        flyingImage.classList.add('fly');
        
        // 애니메이션 완료 후 숨기기
        setTimeout(() => {
            flyingImage.classList.remove('fly');
            flyingImage.classList.add('hidden');
        }, 4000);
    }

    // 다음 문제로 진행
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.displayQuestion();
            this.startTimer();
        } else {
            this.showFinalResult();
        }
    }

    // 최종 결과 표시
    showFinalResult() {
        this.showScreen('result-screen');
        
        const finalMessage = document.getElementById('final-message');
        const certificate = document.getElementById('certificate');
        
        if (this.score === 3) {
            finalMessage.textContent = "🎉 축하합니다! 당신은 성경을 열심히 읽는 분이시군요!!";
            certificate.textContent = "🥤 성경 마스터";
            this.playSound('assets/suc_01.wav');
        } else if (this.score === 2) {
            finalMessage.textContent = "🎉 축하합니다! 당신은 성경을 쫌 읽으시는 분이시군요!";
            certificate.textContent = "🥤 성경 마스터 예정자";
            this.playSound('assets/suc_01.wav');
        } else if (this.score === 1) {
            finalMessage.textContent = "🎉 축하합니다! 당신은 성경을 종종 읽는 분이시군요!";
            certificate.textContent = "🥤 성경 마스터 잠재 예정자";
            this.playSound('assets/suc_01.wav');
            this.createConfetti();
        } else {
            finalMessage.textContent = "아쉽습니다. 다음엔 더 잘하실 수 있을 거에요!";
            certificate.textContent = "🥤 성경 마스터 희망자";
            this.playSound('assets/fail_02.mp3');
        }
    }

    // 축포 애니메이션 생성
    createConfetti() {
        const container = document.getElementById('game-container');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(confetti);
            
            // 애니메이션 완료 후 제거
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
    }

    // 홈으로 돌아가기
    goHome() {
        this.showScreen('start-screen');
        this.resetGame();
    }

    // 게임 리셋
    resetGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 15;
        this.isGameActive = false;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        document.getElementById('result-message').classList.add('hidden');
        document.getElementById('flying-image').classList.add('hidden');
    }

    // 상장 저장하기
    saveCertificate() {
        const container = document.getElementById('game-container');
        
        // Canvas 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 600;
        
        // 배경
        ctx.fillStyle = '#f7fafc';
        ctx.fillRect(0, 0, 800, 600);
        
        // 테두리
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, 760, 560);
        
        // 제목
        ctx.fillStyle = '#4a5568';
        ctx.font = 'bold 48px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText('성경마스터 인증서', 400, 120);
        
        // 메시지
        ctx.fillStyle = '#2d3748';
        ctx.font = '24px Noto Sans KR';
        ctx.fillText('당신은 성경을 열심히 공부하여', 400, 200);
        ctx.fillText('이 인증서를 받았습니다.', 400, 240);
        
        // 상장
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 36px Noto Sans KR';
        ctx.fillText(document.getElementById('certificate').textContent, 400, 320);
        
        // 점수
        ctx.fillStyle = '#4a5568';
        ctx.font = '20px Noto Sans KR';
        ctx.fillText(`정답률: ${this.score}/3`, 400, 400);
        
        // 날짜
        const today = new Date();
        ctx.fillText(`발급일: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`, 400, 450);
        
        // 이미지 다운로드
        const link = document.createElement('a');
        link.download = '성경마스터_인증서.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // 사운드 재생
    playSound(src) {
        try {
            const audio = new Audio(src);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('사운드 재생 실패:', e));
        } catch (e) {
            console.log('사운드 재생 실패:', e);
        }
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new BibleGame();
});
