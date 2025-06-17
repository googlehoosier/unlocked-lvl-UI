// Game Management System
class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameData = {
            'brain-teasers': new BrainTeasersGame(),
            'word-scramble': new WordScrambleGame(),
            'snake': new SnakeGame(),
            'knowledge-quiz': new KnowledgeQuizGame(),
            'math-quiz': new MathQuizGame()
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupGameControls();
        this.setupCategoryCards();
        this.setupMobileMenu();
    }

    setupNavigation() {
        // Logo and Home navigation
        const logoContainer = document.querySelector('.nav-brand .logo-container');
        const homeLinks = document.querySelectorAll('a[href="#home"]');
        
        if (logoContainer) {
            logoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                this.goHome();
            });
        }

        homeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goHome();
            });
        });

        // Game navigation links
        const gameLinks = document.querySelectorAll('[data-game]');
        gameLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = link.getAttribute('data-game');
                this.showGame(gameId);
            });
        });

        // Browse Games button
        const browseBtn = document.getElementById('browseGamesBtn');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                document.getElementById('categories').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }
    }

    setupGameControls() {
        // Home buttons in games
        const homeButtons = document.querySelectorAll('[id$="-home-btn"]');
        homeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goHome();
            });
        });

        // Quit buttons
        const quitButtons = document.querySelectorAll('[id$="-quit-btn"]');
        quitButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goHome();
            });
        });

        // Restart buttons
        const restartButtons = document.querySelectorAll('[id$="-restart-btn"]');
        restartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const gameId = btn.id.split('-')[0];
                if (this.gameData[gameId]) {
                    this.gameData[gameId].restart();
                }
            });
        });
    }

    setupCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const playBtn = card.querySelector('.card-link');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameId = playBtn.getAttribute('data-game');
                    this.showGame(gameId);
                });
            }
        });
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    showGame(gameId) {
        // Hide all game containers
        const gameContainers = document.querySelectorAll('.game-container');
        gameContainers.forEach(container => {
            container.classList.remove('active');
        });

        // Hide main content
        const main = document.querySelector('.main');
        if (main) {
            main.style.display = 'none';
        }

        // Show selected game
        const gameContainer = document.getElementById(`${gameId}-game`);
        if (gameContainer) {
            gameContainer.classList.add('active');
            this.currentGame = gameId;
            
            // Initialize the game
            if (this.gameData[gameId]) {
                this.gameData[gameId].init();
            }
        }

        // Update navigation
        this.updateNavigation(gameId);
    }

    goHome() {
        // Hide all game containers
        const gameContainers = document.querySelectorAll('.game-container');
        gameContainers.forEach(container => {
            container.classList.remove('active');
        });

        // Show main content
        const main = document.querySelector('.main');
        if (main) {
            main.style.display = 'block';
        }

        // Reset current game
        if (this.currentGame && this.gameData[this.currentGame]) {
            this.gameData[this.currentGame].cleanup();
        }
        this.currentGame = null;

        // Update navigation
        this.updateNavigation('home');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateNavigation(activeSection) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (activeSection === 'home' && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            } else if (link.getAttribute('data-game') === activeSection) {
                link.classList.add('active');
            }
        });
    }
}

// Base Game Class
class BaseGame {
    constructor(gameId) {
        this.gameId = gameId;
        this.currentLevel = 1;
        this.score = 0;
        this.isPlaying = false;
    }

    init() {
        this.setupLevelSelection();
        this.setupBackButton();
        this.showLevelSelect();
    }

    setupLevelSelection() {
        const levelButtons = document.querySelectorAll(`#${this.gameId}-level-select .level-btn`);
        levelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.getAttribute('data-level'));
                this.startLevel(level);
            });
        });
    }

    setupBackButton() {
        const backBtn = document.getElementById(`${this.gameId}-back-btn`);
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showLevelSelect();
            });
        }
    }

    showLevelSelect() {
        const levelSelect = document.getElementById(`${this.gameId}-level-select`);
        const gamePlay = document.getElementById(`${this.gameId}-game-play`);
        
        if (levelSelect) levelSelect.style.display = 'block';
        if (gamePlay) gamePlay.style.display = 'none';
        
        this.isPlaying = false;
    }

    showGamePlay() {
        const levelSelect = document.getElementById(`${this.gameId}-level-select`);
        const gamePlay = document.getElementById(`${this.gameId}-game-play`);
        
        if (levelSelect) levelSelect.style.display = 'none';
        if (gamePlay) gamePlay.style.display = 'block';
        
        this.isPlaying = true;
    }

    startLevel(level) {
        this.currentLevel = level;
        this.updateStats();
        this.showGamePlay();
    }

    updateStats() {
        const levelSpan = document.getElementById(`${this.gameId}-current-level`);
        const scoreSpan = document.getElementById(`${this.gameId}-score`);
        
        if (levelSpan) levelSpan.textContent = this.currentLevel;
        if (scoreSpan) scoreSpan.textContent = this.score;
    }

    restart() {
        this.score = 0;
        this.currentLevel = 1;
        this.showLevelSelect();
    }

    cleanup() {
        this.isPlaying = false;
    }

    showFeedback(message, type = 'correct') {
        const feedback = document.getElementById(`${this.gameId}-feedback`);
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `feedback ${type}`;
            feedback.style.display = 'block';
            
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }
    }
}

// Brain Teasers Game
class BrainTeasersGame extends BaseGame {
    constructor() {
        super('brain-teasers');
        this.questions = {
            1: [ // Riddles
                {
                    question: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?",
                    answer: "keyboard",
                    hint: "You use this to type on a computer"
                },
                {
                    question: "What has hands but cannot clap?",
                    answer: "clock",
                    hint: "It tells time"
                },
                {
                    question: "What gets wet while drying?",
                    answer: "towel",
                    hint: "You use this after a shower"
                }
            ],
            2: [ // Math Puzzles
                {
                    question: "If you have 3 apples and you take away 2, how many do you have?",
                    answer: "2",
                    hint: "Think about what 'you take away' means"
                },
                {
                    question: "What is the next number in this sequence: 2, 4, 8, 16, ?",
                    answer: "32",
                    hint: "Each number is doubled"
                }
            ],
            3: [ // Pattern Recognition
                {
                    question: "Complete the pattern: A, C, E, G, ?",
                    answer: "I",
                    hint: "Skip one letter each time"
                }
            ],
            4: [ // Rebus Puzzles
                {
                    question: "What does this represent: STAND I",
                    answer: "understand",
                    hint: "I is under STAND"
                }
            ],
            5: [ // Rapid Fire
                {
                    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
                    answer: "M",
                    hint: "Look at the letters in the words"
                }
            ]
        };
        this.currentQuestionIndex = 0;
        this.hints = 3;
    }

    init() {
        super.init();
        this.setupGameControls();
    }

    setupGameControls() {
        const submitBtn = document.getElementById('brain-submit-btn');
        const hintBtn = document.getElementById('brain-hint-btn');
        const skipBtn = document.getElementById('brain-skip-btn');
        const answerInput = document.getElementById('brain-answer-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipQuestion());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }
    }

    startLevel(level) {
        super.startLevel(level);
        this.currentQuestionIndex = 0;
        this.hints = 3;
        this.loadQuestion();
        
        // Show timer for rapid fire level
        const timer = document.getElementById('brain-timer');
        if (timer) {
            timer.style.display = level === 5 ? 'block' : 'none';
        }
    }

    loadQuestion() {
        const questions = this.questions[this.currentLevel];
        if (!questions || this.currentQuestionIndex >= questions.length) {
            this.completeLevel();
            return;
        }

        const question = questions[this.currentQuestionIndex];
        const questionText = document.getElementById('brain-question-text');
        const answerInput = document.getElementById('brain-answer-input');

        if (questionText) {
            questionText.textContent = question.question;
        }

        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }

        this.updateStats();
    }

    submitAnswer() {
        const answerInput = document.getElementById('brain-answer-input');
        if (!answerInput) return;

        const userAnswer = answerInput.value.trim().toLowerCase();
        const questions = this.questions[this.currentLevel];
        const currentQuestion = questions[this.currentQuestionIndex];

        if (userAnswer === currentQuestion.answer.toLowerCase()) {
            this.score += 10;
            this.showFeedback('Correct! Well done!', 'correct');
            setTimeout(() => this.nextQuestion(), 1500);
        } else {
            this.showFeedback('Incorrect. Try again!', 'incorrect');
        }
    }

    showHint() {
        if (this.hints <= 0) {
            this.showFeedback('No hints remaining!', 'incorrect');
            return;
        }

        this.hints--;
        const questions = this.questions[this.currentLevel];
        const currentQuestion = questions[this.currentQuestionIndex];
        
        this.showFeedback(`Hint: ${currentQuestion.hint}`, 'hint');
        this.updateStats();
    }

    skipQuestion() {
        this.showFeedback('Question skipped!', 'hint');
        setTimeout(() => this.nextQuestion(), 1000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    completeLevel() {
        this.showFeedback('Level completed! Great job!', 'correct');
        setTimeout(() => this.showLevelSelect(), 2000);
    }

    updateStats() {
        super.updateStats();
        const hintsSpan = document.getElementById('brain-hints');
        if (hintsSpan) {
            hintsSpan.textContent = this.hints;
        }
    }
}

// Word Scramble Game
class WordScrambleGame extends BaseGame {
    constructor() {
        super('word-scramble');
        this.words = {
            1: ['GAME', 'PLAY', 'WORD', 'QUIZ'],
            2: ['BRAIN', 'SMART', 'THINK', 'LEARN'],
            3: ['PUZZLE', 'ANSWER', 'RIDDLE', 'CLEVER'],
            4: ['SCIENCE', 'MYSTERY', 'PATTERN', 'PROBLEM'],
            5: ['CHALLENGE', 'KNOWLEDGE', 'EDUCATION', 'ADVENTURE']
        };
        this.currentWord = '';
        this.scrambledWord = '';
        this.wordsCompleted = 0;
        this.totalWords = 10;
    }

    init() {
        super.init();
        this.setupGameControls();
    }

    setupGameControls() {
        const submitBtn = document.getElementById('word-submit-btn');
        const hintBtn = document.getElementById('word-hint-btn');
        const speakBtn = document.getElementById('word-speak-btn');
        const shuffleBtn = document.getElementById('word-shuffle-btn');
        const wordInput = document.getElementById('word-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        if (speakBtn) {
            speakBtn.addEventListener('click', () => this.speakWord());
        }

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.shuffleLetters());
        }

        if (wordInput) {
            wordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }
    }

    startLevel(level) {
        super.startLevel(level);
        this.wordsCompleted = 0;
        this.loadNewWord();
    }

    loadNewWord() {
        if (this.wordsCompleted >= this.totalWords) {
            this.completeLevel();
            return;
        }

        const words = this.words[this.currentLevel];
        this.currentWord = words[Math.floor(Math.random() * words.length)];
        this.scrambledWord = this.scrambleWord(this.currentWord);
        
        this.displayScrambledWord();
        this.updateProgress();

        const wordInput = document.getElementById('word-input');
        if (wordInput) {
            wordInput.value = '';
            wordInput.focus();
        }
    }

    scrambleWord(word) {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
    }

    displayScrambledWord() {
        const container = document.getElementById('scrambled-word');
        if (!container) return;

        container.innerHTML = '';
        for (let letter of this.scrambledWord) {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = letter;
            container.appendChild(letterDiv);
        }
    }

    submitAnswer() {
        const wordInput = document.getElementById('word-input');
        if (!wordInput) return;

        const userAnswer = wordInput.value.trim().toUpperCase();
        
        if (userAnswer === this.currentWord) {
            this.score += 10;
            this.wordsCompleted++;
            this.showFeedback('Correct!', 'correct');
            setTimeout(() => this.loadNewWord(), 1500);
        } else {
            this.showFeedback('Try again!', 'incorrect');
        }
    }

    showHint() {
        const hint = `First letter: ${this.currentWord[0]}`;
        this.showFeedback(hint, 'hint');
    }

    speakWord() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentWord);
            speechSynthesis.speak(utterance);
        } else {
            this.showFeedback('Speech not supported', 'hint');
        }
    }

    shuffleLetters() {
        this.scrambledWord = this.scrambleWord(this.currentWord);
        this.displayScrambledWord();
    }

    updateProgress() {
        const progressSpan = document.getElementById('word-progress');
        if (progressSpan) {
            progressSpan.textContent = `${this.wordsCompleted}/${this.totalWords}`;
        }
        this.updateStats();
    }

    completeLevel() {
        this.showFeedback('Level completed!', 'correct');
        setTimeout(() => this.showLevelSelect(), 2000);
    }
}

// Snake Game
class SnakeGame extends BaseGame {
    constructor() {
        super('snake');
        this.canvas = null;
        this.ctx = null;
        this.snake = [];
        this.food = {};
        this.direction = { x: 0, y: 0 };
        this.gameLoop = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.speed = 200;
        this.highScore = parseInt(localStorage.getItem('snake-high-score') || '0');
    }

    init() {
        super.init();
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.setupControls();
        this.updateHighScore();
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.direction = { x: 0, y: -1 };
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.direction = { x: 0, y: 1 };
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.direction = { x: -1, y: 0 };
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.direction = { x: 1, y: 0 };
                    }
                    break;
            }
        });

        // Touch controls
        const touchButtons = document.querySelectorAll('.touch-btn');
        touchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isPlaying) return;
                
                const direction = btn.getAttribute('data-direction');
                switch(direction) {
                    case 'up':
                        if (this.direction.y === 0) {
                            this.direction = { x: 0, y: -1 };
                        }
                        break;
                    case 'down':
                        if (this.direction.y === 0) {
                            this.direction = { x: 0, y: 1 };
                        }
                        break;
                    case 'left':
                        if (this.direction.x === 0) {
                            this.direction = { x: -1, y: 0 };
                        }
                        break;
                    case 'right':
                        if (this.direction.x === 0) {
                            this.direction = { x: 1, y: 0 };
                        }
                        break;
                }
            });
        });
    }

    startLevel(level) {
        super.startLevel(level);
        this.initGame();
        this.startGame();
    }

    initGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.generateFood();
        this.score = 0;
        
        // Set speed based on level
        const speeds = { 1: 200, 2: 150, 3: 120, 4: 100, 5: 80 };
        this.speed = speeds[this.currentLevel] || 200;
        
        this.updateStats();
        this.draw();
    }

    startGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.speed);
    }

    update() {
        if (this.direction.x === 0 && this.direction.y === 0) return;

        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.updateStats();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#0F0F12';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#BC00FF';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00F0FF';
            } else {
                this.ctx.fillStyle = '#BC00FF';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 2, 
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(
            this.food.x * this.gridSize, 
            this.food.y * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y
        ));
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.isPlaying = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake-high-score', this.highScore.toString());
            this.updateHighScore();
            this.showFeedback('New High Score!', 'correct');
        } else {
            this.showFeedback('Game Over!', 'incorrect');
        }
        
        setTimeout(() => this.showLevelSelect(), 2000);
    }

    updateStats() {
        super.updateStats();
        const lengthSpan = document.getElementById('snake-length');
        if (lengthSpan) {
            lengthSpan.textContent = this.snake.length;
        }
    }

    updateHighScore() {
        const highScoreSpan = document.getElementById('snake-high-score');
        if (highScoreSpan) {
            highScoreSpan.textContent = this.highScore;
        }
    }

    cleanup() {
        super.cleanup();
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
}

// Knowledge Quiz Game
class KnowledgeQuizGame extends BaseGame {
    constructor() {
        super('knowledge-quiz');
        this.questions = {
            1: [ // Science
                {
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "O2", "NaCl"],
                    correct: 0
                },
                {
                    question: "How many bones are in the human body?",
                    options: ["206", "208", "210", "204"],
                    correct: 0
                }
            ],
            2: [ // Technology
                {
                    question: "What does CPU stand for?",
                    options: ["Central Processing Unit", "Computer Personal Unit", "Central Personal Unit", "Computer Processing Unit"],
                    correct: 0
                }
            ],
            3: [ // History
                {
                    question: "In which year did World War II end?",
                    options: ["1944", "1945", "1946", "1947"],
                    correct: 1
                }
            ],
            4: [ // Geography
                {
                    question: "What is the capital of Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    correct: 2
                }
            ],
            5: [ // Mixed Expert
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                    correct: 2
                }
            ]
        };
        this.currentQuestionIndex = 0;
        this.streak = 0;
        this.totalQuestions = 10;
    }

    init() {
        super.init();
        this.setupGameControls();
    }

    setupGameControls() {
        const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
        options.forEach((option, index) => {
            option.addEventListener('click', () => this.selectAnswer(index));
        });
    }

    startLevel(level) {
        super.startLevel(level);
        this.currentQuestionIndex = 0;
        this.streak = 0;
        this.loadQuestion();
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeLevel();
            return;
        }

        const questions = this.questions[this.currentLevel];
        const question = questions[Math.floor(Math.random() * questions.length)];
        
        const questionText = document.getElementById('knowledge-question-text');
        const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');

        if (questionText) {
            questionText.textContent = question.question;
        }

        options.forEach((option, index) => {
            option.textContent = question.options[index];
            option.className = 'quiz-option';
            option.disabled = false;
        });

        this.currentQuestion = question;
        this.updateProgress();
    }

    selectAnswer(selectedIndex) {
        const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
        const correct = this.currentQuestion.correct;

        options.forEach((option, index) => {
            option.disabled = true;
            if (index === correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== correct) {
                option.classList.add('incorrect');
            }
        });

        if (selectedIndex === correct) {
            this.score += 10;
            this.streak++;
            this.showFeedback('Correct!', 'correct');
        } else {
            this.streak = 0;
            this.showFeedback('Incorrect!', 'incorrect');
        }

        this.currentQuestionIndex++;
        setTimeout(() => this.loadQuestion(), 2000);
    }

    updateProgress() {
        const progressSpan = document.getElementById('knowledge-progress');
        const streakSpan = document.getElementById('knowledge-streak');
        
        if (progressSpan) {
            progressSpan.textContent = `${this.currentQuestionIndex}/${this.totalQuestions}`;
        }
        
        if (streakSpan) {
            streakSpan.textContent = this.streak;
        }
        
        this.updateStats();
    }

    completeLevel() {
        this.showFeedback('Quiz completed!', 'correct');
        setTimeout(() => this.showLevelSelect(), 2000);
    }
}

// Math Quiz Game
class MathQuizGame extends BaseGame {
    constructor() {
        super('math-quiz');
        this.currentQuestionIndex = 0;
        this.hints = 5;
        this.totalQuestions = 10;
        this.operations = {
            1: 'addition',
            2: 'subtraction', 
            3: 'multiplication',
            4: 'division',
            5: 'mixed'
        };
    }

    init() {
        super.init();
        this.setupGameControls();
    }

    setupGameControls() {
        const submitBtn = document.getElementById('math-submit-btn');
        const hintBtn = document.getElementById('math-hint-btn');
        const speakBtn = document.getElementById('math-speak-btn');
        const answerInput = document.getElementById('math-answer-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        if (speakBtn) {
            speakBtn.addEventListener('click', () => this.speakQuestion());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }
    }

    startLevel(level) {
        super.startLevel(level);
        this.currentQuestionIndex = 0;
        this.hints = 5;
        this.loadQuestion();
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeLevel();
            return;
        }

        const operation = this.operations[this.currentLevel];
        this.currentProblem = this.generateProblem(operation);
        
        const questionText = document.getElementById('math-question-text');
        const answerInput = document.getElementById('math-answer-input');

        if (questionText) {
            questionText.textContent = this.currentProblem.question;
        }

        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }

        this.updateProgress();
    }

    generateProblem(operation) {
        let a, b, question, answer;

        switch(operation) {
            case 'addition':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                question = `${a} + ${b} = ?`;
                answer = a + b;
                break;
            case 'subtraction':
                a = Math.floor(Math.random() * 50) + 20;
                b = Math.floor(Math.random() * (a - 1)) + 1;
                question = `${a} - ${b} = ?`;
                answer = a - b;
                break;
            case 'multiplication':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                question = `${a} × ${b} = ?`;
                answer = a * b;
                break;
            case 'division':
                b = Math.floor(Math.random() * 10) + 2;
                answer = Math.floor(Math.random() * 10) + 1;
                a = b * answer;
                question = `${a} ÷ ${b} = ?`;
                break;
            case 'mixed':
                const ops = ['addition', 'subtraction', 'multiplication', 'division'];
                const randomOp = ops[Math.floor(Math.random() * ops.length)];
                return this.generateProblem(randomOp);
        }

        return { question, answer, a, b, operation };
    }

    submitAnswer() {
        const answerInput = document.getElementById('math-answer-input');
        if (!answerInput) return;

        const userAnswer = parseInt(answerInput.value);
        
        if (userAnswer === this.currentProblem.answer) {
            this.score += 10;
            this.showFeedback('Correct!', 'correct');
            this.currentQuestionIndex++;
            setTimeout(() => this.loadQuestion(), 1500);
        } else {
            this.showFeedback('Try again!', 'incorrect');
        }
    }

    showHint() {
        if (this.hints <= 0) {
            this.showFeedback('No hints remaining!', 'incorrect');
            return;
        }

        this.hints--;
        const problem = this.currentProblem;
        let hint = '';

        switch(problem.operation) {
            case 'addition':
                hint = `Think: ${problem.a} + ${problem.b}. Start with ${problem.a} and count up ${problem.b} times.`;
                break;
            case 'subtraction':
                hint = `Think: ${problem.a} - ${problem.b}. Start with ${problem.a} and count down ${problem.b} times.`;
                break;
            case 'multiplication':
                hint = `Think: ${problem.a} × ${problem.b}. Add ${problem.a} to itself ${problem.b} times.`;
                break;
            case 'division':
                hint = `Think: ${problem.a} ÷ ${problem.b}. How many times does ${problem.b} go into ${problem.a}?`;
                break;
        }

        this.showFeedback(hint, 'hint');
        this.updateStats();
    }

    speakQuestion() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentProblem.question);
            speechSynthesis.speak(utterance);
        } else {
            this.showFeedback('Speech not supported', 'hint');
        }
    }

    updateProgress() {
        const progressSpan = document.getElementById('math-progress');
        if (progressSpan) {
            progressSpan.textContent = `${this.currentQuestionIndex}/${this.totalQuestions}`;
        }
        this.updateStats();
    }

    updateStats() {
        super.updateStats();
        const hintsSpan = document.getElementById('math-hints');
        if (hintsSpan) {
            hintsSpan.textContent = this.hints;
        }
    }

    completeLevel() {
        this.showFeedback('Math quiz completed!', 'correct');
        setTimeout(() => this.showLevelSelect(), 2000);
    }
}

// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});