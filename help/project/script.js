// Global game state
let currentGame = null;
let gameStates = {
    brainTeasers: {
        currentLevel: 1,
        score: 0,
        hints: 3,
        questions: [],
        currentQuestionIndex: 0,
        unlockedLevels: [1, 2, 3, 4, 5] // All levels unlocked by default
    },
    wordScramble: {
        currentLevel: 1,
        score: 0,
        wordsCompleted: 0,
        currentWord: '',
        scrambledWord: '',
        unlockedLevels: [1, 2, 3, 4, 5] // All levels unlocked by default
    },
    snake: {
        currentLevel: 1,
        score: 0,
        highScore: 0,
        length: 1,
        unlockedLevels: [1, 2, 3, 4, 5] // All levels unlocked by default
    },
    knowledgeQuiz: {
        currentLevel: 1,
        score: 0,
        questionsAnswered: 0,
        streak: 0,
        unlockedLevels: [1, 2, 3, 4, 5] // All levels unlocked by default
    },
    mathQuiz: {
        currentLevel: 1,
        score: 0,
        questionsAnswered: 0,
        hints: 5,
        unlockedLevels: [1, 2, 3, 4, 5] // All levels unlocked by default
    }
};

// Brain Teasers Questions Database
const brainTeasersQuestions = {
    1: [ // Riddles
        {
            question: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?",
            answer: "keyboard",
            hint: "You use this to type on a computer",
            type: "riddle"
        },
        {
            question: "What has hands but cannot clap?",
            answer: "clock",
            hint: "It tells time",
            type: "riddle"
        },
        {
            question: "I'm tall when I'm young, and short when I'm old. What am I?",
            answer: "candle",
            hint: "I provide light and melt as I burn",
            type: "riddle"
        },
        {
            question: "What gets wet while drying?",
            answer: "towel",
            hint: "You use this after a shower",
            type: "riddle"
        },
        {
            question: "I have a head and a tail, but no body. What am I?",
            answer: "coin",
            hint: "You use me to buy things",
            type: "riddle"
        }
    ],
    2: [ // Math Puzzles
        {
            question: "If you have 3 apples and you take away 2, how many do you have?",
            answer: "2",
            hint: "Think about what 'you take away' means",
            type: "math"
        },
        {
            question: "What is the next number in this sequence: 2, 4, 8, 16, ?",
            answer: "32",
            hint: "Each number is doubled",
            type: "math"
        },
        {
            question: "A farmer has 17 sheep. All but 9 die. How many are left?",
            answer: "9",
            hint: "Read carefully - 'all but 9' means 9 remain",
            type: "math"
        },
        {
            question: "What is 15 + 15 ÷ 3?",
            answer: "20",
            hint: "Remember order of operations (PEMDAS)",
            type: "math"
        },
        {
            question: "I am an odd number. Take away one letter and I become even. What number am I?",
            answer: "seven",
            hint: "Remove the 's' from this number",
            type: "math"
        }
    ],
    3: [ // Pattern Recognition
        {
            question: "What comes next: ○ ● ○ ● ○ ?",
            answer: "●",
            hint: "Look at the alternating pattern",
            type: "pattern"
        },
        {
            question: "Complete the pattern: A1, B2, C3, D4, ?",
            answer: "E5",
            hint: "Letters and numbers both increase by 1",
            type: "pattern"
        },
        {
            question: "What's missing: 🔴 🔵 🔴 🔵 🔴 ?",
            answer: "🔵",
            hint: "Colors alternate",
            type: "pattern"
        },
        {
            question: "Find the pattern: 1, 4, 9, 16, ?",
            answer: "25",
            hint: "These are perfect squares: 1², 2², 3², 4², ?",
            type: "pattern"
        },
        {
            question: "What comes next: Monday, Wednesday, Friday, ?",
            answer: "Sunday",
            hint: "Skip one day each time",
            type: "pattern"
        }
    ],
    4: [ // Rebus Puzzles
        {
            question: "What does this mean: STAND I",
            answer: "I understand",
            hint: "I is under STAND",
            type: "rebus"
        },
        {
            question: "What phrase is this: ROADS ROADS",
            answer: "crossroads",
            hint: "Two roads crossing each other",
            type: "rebus"
        },
        {
            question: "Decode: TIMING TIM ING",
            answer: "split second timing",
            hint: "TIM ING is split, and there's a second TIMING",
            type: "rebus"
        },
        {
            question: "What does this represent: KNEE LIGHT",
            answer: "neon light",
            hint: "KNEE sounds like 'neon'",
            type: "rebus"
        },
        {
            question: "Figure out: DICE DICE",
            answer: "paradise",
            hint: "Pair of dice = paradise",
            type: "rebus"
        }
    ],
    5: [ // Rapid Fire (Mixed)
        {
            question: "What has 88 keys but can't open a door?",
            answer: "piano",
            hint: "Musical instrument",
            type: "riddle"
        },
        {
            question: "If 5 cats catch 5 mice in 5 minutes, how many cats catch 100 mice in 100 minutes?",
            answer: "5",
            hint: "The rate stays the same",
            type: "math"
        },
        {
            question: "What's next: Z, Y, X, W, ?",
            answer: "V",
            hint: "Alphabet backwards",
            type: "pattern"
        },
        {
            question: "Decode: ONCE UPON A TIME",
            answer: "once upon a time",
            hint: "This one is literal!",
            type: "rebus"
        },
        {
            question: "I'm not alive, but I grow. I don't have lungs, but I need air. What am I?",
            answer: "fire",
            hint: "I consume oxygen and spread",
            type: "riddle"
        }
    ]
};

// Word Scramble Words Database
const wordScrambleWords = {
    1: [ // 4 Letters
        { word: "GAME", scrambled: "MEGA", hint: "Something you play" },
        { word: "CODE", scrambled: "DECO", hint: "Programming instructions" },
        { word: "TECH", scrambled: "HECT", hint: "Short for technology" },
        { word: "PLAY", scrambled: "YALP", hint: "Have fun" },
        { word: "MIND", scrambled: "DINM", hint: "Your brain" },
        { word: "QUIZ", scrambled: "ZIUQ", hint: "A test of knowledge" },
        { word: "WORD", scrambled: "DROW", hint: "A unit of language" },
        { word: "BOOK", scrambled: "KOOB", hint: "You read this" },
        { word: "STAR", scrambled: "RATS", hint: "Shines in the sky" },
        { word: "MOON", scrambled: "NOOM", hint: "Earth's satellite" }
    ],
    2: [ // 5 Letters
        { word: "BRAIN", scrambled: "NIARB", hint: "Organ that thinks" },
        { word: "SMART", scrambled: "TRAMS", hint: "Intelligent" },
        { word: "LEARN", scrambled: "NRAEL", hint: "Acquire knowledge" },
        { word: "THINK", scrambled: "KNIHT", hint: "Use your mind" },
        { word: "SOLVE", scrambled: "EVLOS", hint: "Find the answer" },
        { word: "LOGIC", scrambled: "CIGOL", hint: "Reasoning" },
        { word: "STUDY", scrambled: "YDUTS", hint: "Learn by reading" },
        { word: "FOCUS", scrambled: "SUCOF", hint: "Concentrate" },
        { word: "SKILL", scrambled: "LLIKS", hint: "Ability or talent" },
        { word: "POWER", scrambled: "REWOP", hint: "Strength or energy" }
    ],
    3: [ // 6 Letters
        { word: "PUZZLE", scrambled: "ZZULEP", hint: "A brain teaser" },
        { word: "MEMORY", scrambled: "YROMEM", hint: "Ability to remember" },
        { word: "WISDOM", scrambled: "MODSIWI", hint: "Deep knowledge" },
        { word: "GENIUS", scrambled: "SUINEG", hint: "Very smart person" },
        { word: "RIDDLE", scrambled: "ELDDIR", hint: "A puzzling question" },
        { word: "ANSWER", scrambled: "REWSNA", hint: "Solution to a question" },
        { word: "SCHOOL", scrambled: "LOOHCS", hint: "Place of learning" },
        { word: "TEACHER", scrambled: "REHCAET", hint: "Person who educates" },
        { word: "STUDENT", scrambled: "TNEDUTS", hint: "Person who learns" },
        { word: "SCIENCE", scrambled: "ECNEICS", hint: "Study of nature" }
    ],
    4: [ // 7 Letters
        { word: "MYSTERY", scrambled: "YRETYSM", hint: "Something unknown" },
        { word: "PROBLEM", scrambled: "MELBORP", hint: "Something to solve" },
        { word: "PATTERN", scrambled: "NRETTAP", hint: "Repeated design" },
        { word: "MACHINE", scrambled: "ENIHCAM", hint: "Mechanical device" },
        { word: "NETWORK", scrambled: "KROWTEN", hint: "Connected system" },
        { word: "DIGITAL", scrambled: "LATIGID", hint: "Computer-based" },
        { word: "VIRTUAL", scrambled: "LAUTRIV", hint: "Not physical" },
        { word: "PROGRAM", scrambled: "MARGORP", hint: "Computer software" },
        { word: "SYSTEMS", scrambled: "SMETSYS", hint: "Organized methods" },
        { word: "COMPLEX", scrambled: "XELPMOC", hint: "Complicated" }
    ],
    5: [ // Expert Mix (Various lengths)
        { word: "ALGORITHM", scrambled: "MHTIROGLA", hint: "Step-by-step procedure" },
        { word: "INNOVATION", scrambled: "NOITAVONNI", hint: "New idea or method" },
        { word: "TECHNOLOGY", scrambled: "YGOLONHCET", hint: "Applied science" },
        { word: "ARTIFICIAL", scrambled: "LAICIFITRA", hint: "Made by humans" },
        { word: "INTELLIGENCE", scrambled: "ECNEGILLETNI", hint: "Ability to learn" },
        { word: "CREATIVITY", scrambled: "YTIVITAERC", hint: "Imaginative ability" },
        { word: "DISCOVERY", scrambled: "YREVOCSID", hint: "Finding something new" },
        { word: "EXPLORATION", scrambled: "NOITAROLPXE", hint: "Investigating unknown" },
        { word: "BREAKTHROUGH", scrambled: "HGUORHTKAERB", hint: "Major advancement" },
        { word: "REVOLUTION", scrambled: "NOITULOVER", hint: "Complete change" }
    ]
};

// Knowledge Quiz Questions Database
const knowledgeQuizQuestions = {
    1: [ // Science
        {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "NaCl"],
            correct: 0,
            explanation: "Water is made of 2 hydrogen atoms and 1 oxygen atom"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: 1,
            explanation: "Mars appears red due to iron oxide on its surface"
        },
        {
            question: "What gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correct: 2,
            explanation: "Plants use carbon dioxide for photosynthesis"
        },
        {
            question: "How many bones are in an adult human body?",
            options: ["106", "206", "306", "406"],
            correct: 1,
            explanation: "An adult human has 206 bones"
        },
        {
            question: "What is the speed of light?",
            options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
            correct: 0,
            explanation: "Light travels at approximately 300,000 kilometers per second"
        }
    ],
    2: [ // Technology
        {
            question: "What does 'AI' stand for?",
            options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Algorithmic Intelligence"],
            correct: 1,
            explanation: "AI stands for Artificial Intelligence"
        },
        {
            question: "Who founded Microsoft?",
            options: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Larry Page"],
            correct: 2,
            explanation: "Bill Gates co-founded Microsoft with Paul Allen"
        },
        {
            question: "What does 'WWW' stand for?",
            options: ["World Wide Web", "World Wide Website", "World Web Wide", "Wide World Web"],
            correct: 0,
            explanation: "WWW stands for World Wide Web"
        },
        {
            question: "Which programming language is known for web development?",
            options: ["Python", "JavaScript", "C++", "Java"],
            correct: 1,
            explanation: "JavaScript is primarily used for web development"
        },
        {
            question: "What year was the first iPhone released?",
            options: ["2005", "2006", "2007", "2008"],
            correct: 2,
            explanation: "The first iPhone was released in 2007"
        }
    ],
    3: [ // History
        {
            question: "In which year did World War II end?",
            options: ["1944", "1945", "1946", "1947"],
            correct: 1,
            explanation: "World War II ended in 1945"
        },
        {
            question: "Who was the first person to walk on the moon?",
            options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
            correct: 1,
            explanation: "Neil Armstrong was the first person to walk on the moon"
        },
        {
            question: "Which ancient wonder of the world still exists today?",
            options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid of Giza", "Lighthouse of Alexandria"],
            correct: 2,
            explanation: "The Great Pyramid of Giza is the only ancient wonder still standing"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correct: 2,
            explanation: "Leonardo da Vinci painted the Mona Lisa"
        },
        {
            question: "In which year did the Berlin Wall fall?",
            options: ["1987", "1988", "1989", "1990"],
            correct: 2,
            explanation: "The Berlin Wall fell in 1989"
        }
    ],
    4: [ // Geography
        {
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correct: 2,
            explanation: "Canberra is the capital of Australia"
        },
        {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
            correct: 1,
            explanation: "The Nile River is the longest river in the world"
        },
        {
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correct: 2,
            explanation: "There are 7 continents"
        },
        {
            question: "Which country has the most time zones?",
            options: ["Russia", "USA", "China", "Canada"],
            correct: 0,
            explanation: "Russia has 11 time zones, the most of any country"
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
            correct: 1,
            explanation: "Vatican City is the smallest country in the world"
        }
    ],
    5: [ // Mixed Expert
        {
            question: "What is the most abundant gas in Earth's atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
            correct: 2,
            explanation: "Nitrogen makes up about 78% of Earth's atmosphere"
        },
        {
            question: "Who developed the theory of relativity?",
            options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
            correct: 1,
            explanation: "Albert Einstein developed the theory of relativity"
        },
        {
            question: "Which empire was ruled by Julius Caesar?",
            options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
            correct: 1,
            explanation: "Julius Caesar was a leader of the Roman Empire"
        },
        {
            question: "What is the deepest ocean trench?",
            options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Peru-Chile Trench"],
            correct: 2,
            explanation: "The Mariana Trench is the deepest part of the ocean"
        },
        {
            question: "Which programming language was created by Guido van Rossum?",
            options: ["Java", "Python", "C++", "Ruby"],
            correct: 1,
            explanation: "Python was created by Guido van Rossum"
        }
    ]
};

// Math Quiz Questions Database
const mathQuizQuestions = {
    1: [ // Addition
        {
            question: "What is 15 + 27?",
            answer: 42,
            hint: "Break it down: 15 + 20 + 7",
            explanation: "15 + 27 = 42"
        },
        {
            question: "What is 38 + 45?",
            answer: 83,
            hint: "Add the tens first, then the ones",
            explanation: "38 + 45 = 83"
        },
        {
            question: "What is 156 + 234?",
            answer: 390,
            hint: "Add column by column from right to left",
            explanation: "156 + 234 = 390"
        },
        {
            question: "What is 89 + 76?",
            answer: 165,
            hint: "Remember to carry over when needed",
            explanation: "89 + 76 = 165"
        },
        {
            question: "What is 247 + 358?",
            answer: 605,
            hint: "Add carefully, carrying over when the sum is 10 or more",
            explanation: "247 + 358 = 605"
        }
    ],
    2: [ // Subtraction
        {
            question: "What is 85 - 37?",
            answer: 48,
            hint: "You may need to borrow from the tens place",
            explanation: "85 - 37 = 48"
        },
        {
            question: "What is 142 - 67?",
            answer: 75,
            hint: "Subtract column by column, borrowing when needed",
            explanation: "142 - 67 = 75"
        },
        {
            question: "What is 200 - 123?",
            answer: 77,
            hint: "Be careful with borrowing from zeros",
            explanation: "200 - 123 = 77"
        },
        {
            question: "What is 456 - 189?",
            answer: 267,
            hint: "Work from right to left, borrowing as needed",
            explanation: "456 - 189 = 267"
        },
        {
            question: "What is 1000 - 347?",
            answer: 653,
            hint: "Multiple borrowing needed here",
            explanation: "1000 - 347 = 653"
        }
    ],
    3: [ // Multiplication
        {
            question: "What is 7 × 8?",
            answer: 56,
            hint: "This is a basic times table fact",
            explanation: "7 × 8 = 56"
        },
        {
            question: "What is 12 × 15?",
            answer: 180,
            hint: "Break it down: 12 × 10 + 12 × 5",
            explanation: "12 × 15 = 180"
        },
        {
            question: "What is 25 × 24?",
            answer: 600,
            hint: "25 × 24 = 25 × 4 × 6",
            explanation: "25 × 24 = 600"
        },
        {
            question: "What is 13 × 17?",
            answer: 221,
            hint: "Use the standard multiplication algorithm",
            explanation: "13 × 17 = 221"
        },
        {
            question: "What is 45 × 32?",
            answer: 1440,
            hint: "Multiply 45 × 2, then 45 × 30, then add",
            explanation: "45 × 32 = 1440"
        }
    ],
    4: [ // Division
        {
            question: "What is 144 ÷ 12?",
            answer: 12,
            hint: "Think: 12 times what equals 144?",
            explanation: "144 ÷ 12 = 12"
        },
        {
            question: "What is 156 ÷ 13?",
            answer: 12,
            hint: "Use long division",
            explanation: "156 ÷ 13 = 12"
        },
        {
            question: "What is 225 ÷ 15?",
            answer: 15,
            hint: "15 × 15 = 225",
            explanation: "225 ÷ 15 = 15"
        },
        {
            question: "What is 384 ÷ 16?",
            answer: 24,
            hint: "Break down: 384 = 320 + 64",
            explanation: "384 ÷ 16 = 24"
        },
        {
            question: "What is 567 ÷ 21?",
            answer: 27,
            hint: "Use long division step by step",
            explanation: "567 ÷ 21 = 27"
        }
    ],
    5: [ // Mixed Operations
        {
            question: "What is 8 + 4 × 3?",
            answer: 20,
            hint: "Remember order of operations (PEMDAS)",
            explanation: "8 + 4 × 3 = 8 + 12 = 20"
        },
        {
            question: "What is (15 + 5) ÷ 4?",
            answer: 5,
            hint: "Solve parentheses first",
            explanation: "(15 + 5) ÷ 4 = 20 ÷ 4 = 5"
        },
        {
            question: "What is 6² - 2 × 3?",
            answer: 30,
            hint: "Exponents first, then multiplication, then subtraction",
            explanation: "6² - 2 × 3 = 36 - 6 = 30"
        },
        {
            question: "What is 100 - 8 × 7 + 12?",
            answer: 56,
            hint: "Multiplication first, then left to right",
            explanation: "100 - 8 × 7 + 12 = 100 - 56 + 12 = 56"
        },
        {
            question: "What is (24 ÷ 6) × (5 + 3)?",
            answer: 32,
            hint: "Solve both parentheses first",
            explanation: "(24 ÷ 6) × (5 + 3) = 4 × 8 = 32"
        }
    ]
};

// Snake Game Variables
let snake = {
    canvas: null,
    ctx: null,
    snake: [],
    food: {},
    powerUps: [],
    obstacles: [],
    direction: 'right',
    gameRunning: false,
    gameSpeed: 150,
    score: 0,
    level: 1
};

// Text-to-Speech function
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('medforceGameState');
    if (saved) {
        try {
            const parsedState = JSON.parse(saved);
            // Merge saved state but ensure all levels remain unlocked
            Object.keys(gameStates).forEach(game => {
                if (parsedState[game]) {
                    gameStates[game] = { ...gameStates[game], ...parsedState[game] };
                    // Force all levels to be unlocked regardless of saved state
                    gameStates[game].unlockedLevels = [1, 2, 3, 4, 5];
                }
            });
        } catch (e) {
            console.log('Error loading game state:', e);
        }
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('medforceGameState', JSON.stringify(gameStates));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    initializeNavigation();
    initializeHero();
    initializeGames();
    updateAllLevelButtons(); // Ensure all levels are shown as unlocked
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link[data-game]');
    const categoryCards = document.querySelectorAll('.category-card');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const gameType = this.getAttribute('data-game');
            openGame(gameType);
            
            // Close mobile menu
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Category cards
    categoryCards.forEach(card => {
        const button = card.querySelector('.card-link');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const gameType = this.getAttribute('data-game');
                openGame(gameType);
            });
        }
    });
}

// Hero section functionality
function initializeHero() {
    const browseGamesBtn = document.getElementById('browseGamesBtn');
    const categoriesSection = document.getElementById('categories');

    if (browseGamesBtn && categoriesSection) {
        browseGamesBtn.addEventListener('click', function() {
            categoriesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Game initialization
function initializeGames() {
    initializeBrainTeasers();
    initializeWordScramble();
    initializeSnake();
    initializeKnowledgeQuiz();
    initializeMathQuiz();
}

// Open game function
function openGame(gameType) {
    // Hide all game containers
    const gameContainers = document.querySelectorAll('.game-container');
    gameContainers.forEach(container => {
        container.classList.remove('active');
    });

    // Show the selected game
    const gameContainer = document.getElementById(`${gameType}-game`);
    if (gameContainer) {
        gameContainer.classList.add('active');
        currentGame = gameType;
        
        // Reset to level selection
        showLevelSelection(gameType);
        
        // Update level buttons to show all as unlocked
        updateLevelButtons(gameType);
    }
}

// Show level selection
function showLevelSelection(gameType) {
    const levelSelect = document.getElementById(`${gameType}-level-select`);
    const gamePlay = document.getElementById(`${gameType}-game-play`);
    
    if (levelSelect && gamePlay) {
        levelSelect.style.display = 'block';
        gamePlay.style.display = 'none';
    }
}

// Update level buttons to show all as unlocked
function updateLevelButtons(gameType) {
    const levelButtons = document.querySelectorAll(`#${gameType}-level-select .level-btn`);
    
    levelButtons.forEach((button, index) => {
        const level = index + 1;
        // Remove locked class and add unlocked class for all levels
        button.classList.remove('locked');
        button.classList.add('unlocked');
        button.disabled = false;
        
        // Remove any lock icons
        const lockIcon = button.querySelector('::after');
        if (lockIcon) {
            button.style.position = 'relative';
        }
    });
}

// Update all level buttons across all games
function updateAllLevelButtons() {
    const gameTypes = ['brain-teasers', 'word-scramble', 'snake', 'knowledge-quiz', 'math-quiz'];
    gameTypes.forEach(gameType => {
        updateLevelButtons(gameType);
    });
}

// Start game level
function startGameLevel(gameType, level) {
    const levelSelect = document.getElementById(`${gameType}-level-select`);
    const gamePlay = document.getElementById(`${gameType}-game-play`);
    
    if (levelSelect && gamePlay) {
        levelSelect.style.display = 'none';
        gamePlay.style.display = 'block';
        
        // Update current level
        const gameKey = gameType.replace('-', '');
        if (gameKey === 'brainteasers') {
            gameStates.brainTeasers.currentLevel = level;
            startBrainTeasersLevel(level);
        } else if (gameKey === 'wordscramble') {
            gameStates.wordScramble.currentLevel = level;
            startWordScrambleLevel(level);
        } else if (gameKey === 'snake') {
            gameStates.snake.currentLevel = level;
            startSnakeLevel(level);
        } else if (gameKey === 'knowledgequiz') {
            gameStates.knowledgeQuiz.currentLevel = level;
            startKnowledgeQuizLevel(level);
        } else if (gameKey === 'mathquiz') {
            gameStates.mathQuiz.currentLevel = level;
            startMathQuizLevel(level);
        }
        
        saveGameState();
    }
}

// Brain Teasers Game
function initializeBrainTeasers() {
    // Level selection
    const levelButtons = document.querySelectorAll('#brain-teasers-level-select .level-btn');
    levelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const level = index + 1;
            // Allow access to any level regardless of unlock status
            startGameLevel('brain-teasers', level);
        });
    });

    // Game controls
    document.getElementById('brain-restart-btn').addEventListener('click', () => {
        startBrainTeasersLevel(gameStates.brainTeasers.currentLevel);
    });

    document.getElementById('brain-quit-btn').addEventListener('click', () => {
        showLevelSelection('brain-teasers');
    });

    document.getElementById('brain-home-btn').addEventListener('click', () => {
        closeGame();
    });

    document.getElementById('brain-back-btn').addEventListener('click', () => {
        showLevelSelection('brain-teasers');
    });

    // Answer submission
    document.getElementById('brain-submit-btn').addEventListener('click', submitBrainTeasersAnswer);
    document.getElementById('brain-answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBrainTeasersAnswer();
        }
    });

    // Hint button
    document.getElementById('brain-hint-btn').addEventListener('click', showBrainTeasersHint);

    // Skip button
    document.getElementById('brain-skip-btn').addEventListener('click', skipBrainTeasersQuestion);
}

function startBrainTeasersLevel(level) {
    const state = gameStates.brainTeasers;
    state.currentLevel = level;
    state.score = 0;
    state.hints = 3;
    state.questions = [...brainTeasersQuestions[level]];
    state.currentQuestionIndex = 0;

    // Shuffle questions
    for (let i = state.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.questions[i], state.questions[j]] = [state.questions[j], state.questions[i]];
    }

    updateBrainTeasersUI();
    showBrainTeasersQuestion();

    // Start timer for rapid fire level
    if (level === 5) {
        startBrainTeasersTimer();
    }
}

function updateBrainTeasersUI() {
    const state = gameStates.brainTeasers;
    document.getElementById('brain-current-level').textContent = state.currentLevel;
    document.getElementById('brain-score').textContent = state.score;
    document.getElementById('brain-hints').textContent = state.hints;

    // Show/hide timer for rapid fire
    const timer = document.getElementById('brain-timer');
    if (state.currentLevel === 5) {
        timer.style.display = 'block';
        document.getElementById('brain-time').textContent = '60';
    } else {
        timer.style.display = 'none';
    }
}

function showBrainTeasersQuestion() {
    const state = gameStates.brainTeasers;
    if (state.currentQuestionIndex >= state.questions.length) {
        completeBrainTeasersLevel();
        return;
    }

    const question = state.questions[state.currentQuestionIndex];
    document.getElementById('brain-question-text').textContent = question.question;
    document.getElementById('brain-answer-input').value = '';
    document.getElementById('brain-feedback').textContent = '';

    // Add question type indicator
    const questionCard = document.getElementById('brain-question-card');
    questionCard.className = `question-card ${question.type}`;

    // Speak the question
    speak(question.question);
}

function submitBrainTeasersAnswer() {
    const state = gameStates.brainTeasers;
    const question = state.questions[state.currentQuestionIndex];
    const userAnswer = document.getElementById('brain-answer-input').value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();

    const feedback = document.getElementById('brain-feedback');

    if (userAnswer === correctAnswer) {
        feedback.textContent = '🎉 Correct! Well done!';
        feedback.className = 'feedback correct';
        state.score += 10;
        speak('Correct! Well done!');
        
        setTimeout(() => {
            state.currentQuestionIndex++;
            showBrainTeasersQuestion();
            updateBrainTeasersUI();
        }, 2000);
    } else {
        feedback.textContent = '❌ Incorrect. Try again!';
        feedback.className = 'feedback incorrect';
        speak('Incorrect. Try again!');
    }
}

function showBrainTeasersHint() {
    const state = gameStates.brainTeasers;
    if (state.hints <= 0) {
        document.getElementById('brain-feedback').textContent = 'No hints remaining!';
        document.getElementById('brain-feedback').className = 'feedback incorrect';
        return;
    }

    const question = state.questions[state.currentQuestionIndex];
    const feedback = document.getElementById('brain-feedback');
    feedback.textContent = `💡 Hint: ${question.hint}`;
    feedback.className = 'feedback hint';
    
    state.hints--;
    updateBrainTeasersUI();
    speak(`Hint: ${question.hint}`);
}

function skipBrainTeasersQuestion() {
    const state = gameStates.brainTeasers;
    const question = state.questions[state.currentQuestionIndex];
    
    const feedback = document.getElementById('brain-feedback');
    feedback.textContent = `⏭️ Skipped. The answer was: ${question.answer}`;
    feedback.className = 'feedback hint';
    
    setTimeout(() => {
        state.currentQuestionIndex++;
        showBrainTeasersQuestion();
        updateBrainTeasersUI();
    }, 3000);
}

function startBrainTeasersTimer() {
    let timeLeft = 60;
    const timerElement = document.getElementById('brain-time');
    
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            completeBrainTeasersLevel();
        }
    }, 1000);
}

function completeBrainTeasersLevel() {
    const state = gameStates.brainTeasers;
    const feedback = document.getElementById('brain-feedback');
    
    feedback.textContent = `🎊 Level ${state.currentLevel} Complete! Final Score: ${state.score}`;
    feedback.className = 'feedback correct';
    
    speak(`Level ${state.currentLevel} complete! Your final score is ${state.score}`);
    
    // All levels remain unlocked, no need to unlock next level
    saveGameState();
    
    setTimeout(() => {
        showLevelSelection('brain-teasers');
    }, 3000);
}

// Word Scramble Game
function initializeWordScramble() {
    // Level selection
    const levelButtons = document.querySelectorAll('#word-scramble-level-select .level-btn');
    levelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const level = index + 1;
            // Allow access to any level regardless of unlock status
            startGameLevel('word-scramble', level);
        });
    });

    // Game controls
    document.getElementById('word-restart-btn').addEventListener('click', () => {
        startWordScrambleLevel(gameStates.wordScramble.currentLevel);
    });

    document.getElementById('word-quit-btn').addEventListener('click', () => {
        showLevelSelection('word-scramble');
    });

    document.getElementById('word-home-btn').addEventListener('click', () => {
        closeGame();
    });

    document.getElementById('word-back-btn').addEventListener('click', () => {
        showLevelSelection('word-scramble');
    });

    // Word submission
    document.getElementById('word-submit-btn').addEventListener('click', submitWordScrambleAnswer);
    document.getElementById('word-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitWordScrambleAnswer();
        }
    });

    // Action buttons
    document.getElementById('word-hint-btn').addEventListener('click', showWordScrambleHint);
    document.getElementById('word-speak-btn').addEventListener('click', speakCurrentWord);
    document.getElementById('word-shuffle-btn').addEventListener('click', shuffleCurrentWord);
}

function startWordScrambleLevel(level) {
    const state = gameStates.wordScramble;
    state.currentLevel = level;
    state.score = 0;
    state.wordsCompleted = 0;
    
    // Get words for this level
    const levelWords = [...wordScrambleWords[level]];
    
    // Shuffle words
    for (let i = levelWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [levelWords[i], levelWords[j]] = [levelWords[j], levelWords[i]];
    }
    
    state.words = levelWords.slice(0, 10); // Take first 10 words
    state.currentWordIndex = 0;

    updateWordScrambleUI();
    showWordScrambleWord();
}

function updateWordScrambleUI() {
    const state = gameStates.wordScramble;
    document.getElementById('word-current-level').textContent = state.currentLevel;
    document.getElementById('word-score').textContent = state.score;
    document.getElementById('word-progress').textContent = `${state.wordsCompleted}/10`;
}

function showWordScrambleWord() {
    const state = gameStates.wordScramble;
    if (state.currentWordIndex >= state.words.length) {
        completeWordScrambleLevel();
        return;
    }

    const wordData = state.words[state.currentWordIndex];
    state.currentWord = wordData.word;
    state.scrambledWord = wordData.scrambled;

    displayScrambledLetters(state.scrambledWord);
    document.getElementById('word-input').value = '';
    document.getElementById('word-feedback').textContent = '';
}

function displayScrambledLetters(scrambledWord) {
    const container = document.getElementById('scrambled-word');
    container.innerHTML = '';

    for (let letter of scrambledWord) {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = letter;
        container.appendChild(letterDiv);
    }
}

function submitWordScrambleAnswer() {
    const state = gameStates.wordScramble;
    const userAnswer = document.getElementById('word-input').value.trim().toLowerCase();
    const correctAnswer = state.currentWord.toLowerCase();

    const feedback = document.getElementById('word-feedback');

    if (userAnswer === correctAnswer) {
        feedback.textContent = '🎉 Correct! Well done!';
        feedback.className = 'feedback correct';
        state.score += 10;
        state.wordsCompleted++;
        
        speak(`Correct! The word was ${state.currentWord}`);
        
        setTimeout(() => {
            state.currentWordIndex++;
            showWordScrambleWord();
            updateWordScrambleUI();
        }, 2000);
    } else {
        feedback.textContent = '❌ Incorrect. Try again!';
        feedback.className = 'feedback incorrect';
        speak('Incorrect. Try again!');
    }
}

function showWordScrambleHint() {
    const state = gameStates.wordScramble;
    const wordData = state.words[state.currentWordIndex];
    
    const feedback = document.getElementById('word-feedback');
    feedback.textContent = `💡 Hint: ${wordData.hint}`;
    feedback.className = 'feedback hint';
    
    speak(`Hint: ${wordData.hint}`);
}

function speakCurrentWord() {
    const state = gameStates.wordScramble;
    speak(`The scrambled letters are: ${state.scrambledWord.split('').join(', ')}`);
}

function shuffleCurrentWord() {
    const state = gameStates.wordScramble;
    const letters = state.scrambledWord.split('');
    
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    state.scrambledWord = letters.join('');
    displayScrambledLetters(state.scrambledWord);
}

function completeWordScrambleLevel() {
    const state = gameStates.wordScramble;
    const feedback = document.getElementById('word-feedback');
    
    feedback.textContent = `🎊 Level ${state.currentLevel} Complete! Words: ${state.wordsCompleted}/10, Score: ${state.score}`;
    feedback.className = 'feedback correct';
    
    speak(`Level ${state.currentLevel} complete! You completed ${state.wordsCompleted} words with a score of ${state.score}`);
    
    // All levels remain unlocked, no need to unlock next level
    saveGameState();
    
    setTimeout(() => {
        showLevelSelection('word-scramble');
    }, 3000);
}

// Snake Game
function initializeSnake() {
    // Level selection
    const levelButtons = document.querySelectorAll('#snake-level-select .level-btn');
    levelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const level = index + 1;
            // Allow access to any level regardless of unlock status
            startGameLevel('snake', level);
        });
    });

    // Game controls
    document.getElementById('snake-restart-btn').addEventListener('click', () => {
        startSnakeLevel(gameStates.snake.currentLevel);
    });

    document.getElementById('snake-quit-btn').addEventListener('click', () => {
        showLevelSelection('snake');
    });

    document.getElementById('snake-home-btn').addEventListener('click', () => {
        closeGame();
    });

    document.getElementById('snake-back-btn').addEventListener('click', () => {
        showLevelSelection('snake');
    });

    // Touch controls for mobile
    const touchButtons = document.querySelectorAll('.touch-btn');
    touchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            changeSnakeDirection(direction);
        });
    });
}

function startSnakeLevel(level) {
    const state = gameStates.snake;
    state.currentLevel = level;
    state.score = 0;
    state.length = 1;

    // Get canvas
    snake.canvas = document.getElementById('snake-canvas');
    snake.ctx = snake.canvas.getContext('2d');

    // Set game speed based on level
    const speeds = { 1: 150, 2: 120, 3: 100, 4: 80, 5: 60 };
    snake.gameSpeed = speeds[level] || 150;

    // Initialize snake
    snake.snake = [{ x: 200, y: 200 }];
    snake.direction = 'right';
    snake.food = generateFood();
    snake.powerUps = [];
    snake.obstacles = [];

    // Add obstacles for advanced levels
    if (level >= 2) {
        generateObstacles(level);
    }

    updateSnakeUI();
    
    // Add keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    // Start game loop
    snake.gameRunning = true;
    gameLoop();
}

function updateSnakeUI() {
    const state = gameStates.snake;
    document.getElementById('snake-current-level').textContent = state.currentLevel;
    document.getElementById('snake-score').textContent = state.score;
    document.getElementById('snake-high-score').textContent = state.highScore;
    document.getElementById('snake-length').textContent = snake.snake.length;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
        type: Math.random() < 0.8 ? 'normal' : 'golden'
    };
}

function generateObstacles(level) {
    snake.obstacles = [];
    const obstacleCount = Math.min(level * 2, 10);
    
    for (let i = 0; i < obstacleCount; i++) {
        snake.obstacles.push({
            x: Math.floor(Math.random() * 20) * 20,
            y: Math.floor(Math.random() * 20) * 20
        });
    }
}

function handleSnakeKeyPress(e) {
    if (!snake.gameRunning) return;

    const key = e.key.toLowerCase();
    
    switch (key) {
        case 'arrowup':
        case 'w':
            if (snake.direction !== 'down') snake.direction = 'up';
            break;
        case 'arrowdown':
        case 's':
            if (snake.direction !== 'up') snake.direction = 'down';
            break;
        case 'arrowleft':
        case 'a':
            if (snake.direction !== 'right') snake.direction = 'left';
            break;
        case 'arrowright':
        case 'd':
            if (snake.direction !== 'left') snake.direction = 'right';
            break;
    }
}

function changeSnakeDirection(direction) {
    if (!snake.gameRunning) return;

    switch (direction) {
        case 'up':
            if (snake.direction !== 'down') snake.direction = 'up';
            break;
        case 'down':
            if (snake.direction !== 'up') snake.direction = 'down';
            break;
        case 'left':
            if (snake.direction !== 'right') snake.direction = 'left';
            break;
        case 'right':
            if (snake.direction !== 'left') snake.direction = 'right';
            break;
    }
}

function gameLoop() {
    if (!snake.gameRunning) return;

    // Move snake
    const head = { ...snake.snake[0] };
    
    switch (snake.direction) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check obstacle collision
    if (snake.obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
        gameOver();
        return;
    }

    snake.snake.unshift(head);

    // Check food collision
    if (head.x === snake.food.x && head.y === snake.food.y) {
        const points = snake.food.type === 'golden' ? 5 : 1;
        gameStates.snake.score += points;
        
        // Generate power-ups for expert levels
        if (gameStates.snake.currentLevel >= 3 && Math.random() < 0.3) {
            generatePowerUp();
        }
        
        snake.food = generateFood();
    } else {
        snake.snake.pop();
    }

    // Update UI and draw
    updateSnakeUI();
    draw();

    // Continue game loop
    setTimeout(gameLoop, snake.gameSpeed);
}

function generatePowerUp() {
    const types = ['timewarp', 'bomb'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    snake.powerUps.push({
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
        type: type,
        duration: 100 // frames
    });
}

function draw() {
    const ctx = snake.ctx;
    
    // Clear canvas
    ctx.fillStyle = '#0F0F12';
    ctx.fillRect(0, 0, 400, 400);

    // Draw grid
    ctx.strokeStyle = '#BC00FF';
    ctx.globalAlpha = 0.1;
    for (let i = 0; i <= 400; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 400);
        ctx.moveTo(0, i);
        ctx.lineTo(400, i);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw snake
    snake.snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#00F0FF';
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 10;
        } else {
            // Body
            ctx.fillStyle = '#BC00FF';
            ctx.shadowColor = '#BC00FF';
            ctx.shadowBlur = 5;
        }
        ctx.fillRect(segment.x, segment.y, 18, 18);
    });

    // Draw food
    ctx.shadowBlur = 15;
    if (snake.food.type === 'golden') {
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
    } else {
        ctx.fillStyle = '#00FF00';
        ctx.shadowColor = '#00FF00';
    }
    ctx.fillRect(snake.food.x, snake.food.y, 18, 18);

    // Draw obstacles
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 8;
    snake.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 18, 18);
    });

    // Draw power-ups
    snake.powerUps.forEach(powerUp => {
        if (powerUp.type === 'timewarp') {
            ctx.fillStyle = '#FFFF00';
            ctx.shadowColor = '#FFFF00';
        } else if (powerUp.type === 'bomb') {
            ctx.fillStyle = '#FF4500';
            ctx.shadowColor = '#FF4500';
        }
        ctx.shadowBlur = 12;
        ctx.fillRect(powerUp.x, powerUp.y, 18, 18);
    });

    ctx.shadowBlur = 0;
}

function gameOver() {
    snake.gameRunning = false;
    document.removeEventListener('keydown', handleSnakeKeyPress);

    const state = gameStates.snake;
    if (state.score > state.highScore) {
        state.highScore = state.score;
    }

    // All levels remain unlocked, no need to unlock next level
    saveGameState();

    alert(`Game Over! Score: ${state.score}`);
    showLevelSelection('snake');
}

// Knowledge Quiz Game
function initializeKnowledgeQuiz() {
    // Level selection
    const levelButtons = document.querySelectorAll('#knowledge-quiz-level-select .level-btn');
    levelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const level = index + 1;
            // Allow access to any level regardless of unlock status
            startGameLevel('knowledge-quiz', level);
        });
    });

    // Game controls
    document.getElementById('knowledge-restart-btn').addEventListener('click', () => {
        startKnowledgeQuizLevel(gameStates.knowledgeQuiz.currentLevel);
    });

    document.getElementById('knowledge-quit-btn').addEventListener('click', () => {
        showLevelSelection('knowledge-quiz');
    });

    document.getElementById('knowledge-home-btn').addEventListener('click', () => {
        closeGame();
    });

    document.getElementById('knowledge-back-btn').addEventListener('click', () => {
        showLevelSelection('knowledge-quiz');
    });

    // Quiz options
    const quizOptions = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
    quizOptions.forEach((option, index) => {
        option.addEventListener('click', function() {
            selectKnowledgeQuizOption(index);
        });
    });
}

function startKnowledgeQuizLevel(level) {
    const state = gameStates.knowledgeQuiz;
    state.currentLevel = level;
    state.score = 0;
    state.questionsAnswered = 0;
    state.streak = 0;
    
    // Get questions for this level
    state.questions = [...knowledgeQuizQuestions[level]];
    
    // Shuffle questions
    for (let i = state.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.questions[i], state.questions[j]] = [state.questions[j], state.questions[i]];
    }
    
    state.currentQuestionIndex = 0;

    updateKnowledgeQuizUI();
    showKnowledgeQuizQuestion();
}

function updateKnowledgeQuizUI() {
    const state = gameStates.knowledgeQuiz;
    document.getElementById('knowledge-current-level').textContent = state.currentLevel;
    document.getElementById('knowledge-score').textContent = state.score;
    document.getElementById('knowledge-progress').textContent = `${state.questionsAnswered}/10`;
    document.getElementById('knowledge-streak').textContent = state.streak;
}

function showKnowledgeQuizQuestion() {
    const state = gameStates.knowledgeQuiz;
    if (state.currentQuestionIndex >= state.questions.length || state.questionsAnswered >= 10) {
        completeKnowledgeQuizLevel();
        return;
    }

    const question = state.questions[state.currentQuestionIndex];
    document.getElementById('knowledge-question-text').textContent = question.question;
    
    // Update options
    const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.className = 'quiz-option';
        option.disabled = false;
    });

    document.getElementById('knowledge-feedback').textContent = '';
    
    // Speak the question
    speak(question.question);
}

function selectKnowledgeQuizOption(selectedIndex) {
    const state = gameStates.knowledgeQuiz;
    const question = state.questions[state.currentQuestionIndex];
    const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
    
    // Disable all options
    options.forEach(option => option.disabled = true);
    
    // Mark selected option
    options[selectedIndex].classList.add('selected');
    
    const feedback = document.getElementById('knowledge-feedback');
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        feedback.textContent = `🎉 Correct! ${question.explanation}`;
        feedback.className = 'feedback correct';
        
        state.score += 10;
        state.streak++;
        speak('Correct!');
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        feedback.textContent = `❌ Incorrect. ${question.explanation}`;
        feedback.className = 'feedback incorrect';
        
        state.streak = 0;
        speak('Incorrect.');
    }
    
    state.questionsAnswered++;
    updateKnowledgeQuizUI();
    
    setTimeout(() => {
        state.currentQuestionIndex++;
        showKnowledgeQuizQuestion();
    }, 3000);
}

function completeKnowledgeQuizLevel() {
    const state = gameStates.knowledgeQuiz;
    const feedback = document.getElementById('knowledge-feedback');
    
    feedback.textContent = `🎊 Level ${state.currentLevel} Complete! Score: ${state.score}/100`;
    feedback.className = 'feedback correct';
    
    speak(`Level ${state.currentLevel} complete! Your score is ${state.score} out of 100`);
    
    // All levels remain unlocked, no need to unlock next level
    saveGameState();
    
    setTimeout(() => {
        showLevelSelection('knowledge-quiz');
    }, 3000);
}

// Math Quiz Game
function initializeMathQuiz() {
    // Level selection
    const levelButtons = document.querySelectorAll('#math-quiz-level-select .level-btn');
    levelButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const level = index + 1;
            // Allow access to any level regardless of unlock status
            startGameLevel('math-quiz', level);
        });
    });

    // Game controls
    document.getElementById('math-restart-btn').addEventListener('click', () => {
        startMathQuizLevel(gameStates.mathQuiz.currentLevel);
    });

    document.getElementById('math-quit-btn').addEventListener('click', () => {
        showLevelSelection('math-quiz');
    });

    document.getElementById('math-home-btn').addEventListener('click', () => {
        closeGame();
    });

    document.getElementById('math-back-btn').addEventListener('click', () => {
        showLevelSelection('math-quiz');
    });

    // Answer submission
    document.getElementById('math-submit-btn').addEventListener('click', submitMathQuizAnswer);
    document.getElementById('math-answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitMathQuizAnswer();
        }
    });

    // Hint and speak buttons
    document.getElementById('math-hint-btn').addEventListener('click', showMathQuizHint);
    document.getElementById('math-speak-btn').addEventListener('click', speakMathQuestion);
}

function startMathQuizLevel(level) {
    const state = gameStates.mathQuiz;
    state.currentLevel = level;
    state.score = 0;
    state.questionsAnswered = 0;
    state.hints = 5;
    
    // Get questions for this level
    state.questions = [...mathQuizQuestions[level]];
    
    // Shuffle questions
    for (let i = state.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.questions[i], state.questions[j]] = [state.questions[j], state.questions[i]];
    }
    
    state.currentQuestionIndex = 0;

    updateMathQuizUI();
    showMathQuizQuestion();
}

function updateMathQuizUI() {
    const state = gameStates.mathQuiz;
    document.getElementById('math-current-level').textContent = state.currentLevel;
    document.getElementById('math-score').textContent = state.score;
    document.getElementById('math-progress').textContent = `${state.questionsAnswered}/10`;
    document.getElementById('math-hints').textContent = state.hints;
}

function showMathQuizQuestion() {
    const state = gameStates.mathQuiz;
    if (state.currentQuestionIndex >= state.questions.length || state.questionsAnswered >= 10) {
        completeMathQuizLevel();
        return;
    }

    const question = state.questions[state.currentQuestionIndex];
    document.getElementById('math-question-text').textContent = question.question;
    document.getElementById('math-answer-input').value = '';
    document.getElementById('math-feedback').textContent = '';
    
    // Speak the question
    speak(question.question);
}

function submitMathQuizAnswer() {
    const state = gameStates.mathQuiz;
    const question = state.questions[state.currentQuestionIndex];
    const userAnswer = parseInt(document.getElementById('math-answer-input').value);

    const feedback = document.getElementById('math-feedback');

    if (userAnswer === question.answer) {
        feedback.textContent = `🎉 Correct! ${question.explanation}`;
        feedback.className = 'feedback correct';
        state.score += 10;
        speak('Correct!');
        
        setTimeout(() => {
            state.questionsAnswered++;
            state.currentQuestionIndex++;
            showMathQuizQuestion();
            updateMathQuizUI();
        }, 2000);
    } else {
        feedback.textContent = `❌ Incorrect. Try again!`;
        feedback.className = 'feedback incorrect';
        speak('Incorrect. Try again!');
    }
}

function showMathQuizHint() {
    const state = gameStates.mathQuiz;
    if (state.hints <= 0) {
        document.getElementById('math-feedback').textContent = 'No hints remaining!';
        document.getElementById('math-feedback').className = 'feedback incorrect';
        return;
    }

    const question = state.questions[state.currentQuestionIndex];
    const feedback = document.getElementById('math-feedback');
    feedback.textContent = `💡 Hint: ${question.hint}`;
    feedback.className = 'feedback hint';
    
    state.hints--;
    updateMathQuizUI();
    speak(`Hint: ${question.hint}`);
}

function speakMathQuestion() {
    const state = gameStates.mathQuiz;
    const question = state.questions[state.currentQuestionIndex];
    speak(question.question);
}

function completeMathQuizLevel() {
    const state = gameStates.mathQuiz;
    const feedback = document.getElementById('math-feedback');
    
    feedback.textContent = `🎊 Level ${state.currentLevel} Complete! Score: ${state.score}/100`;
    feedback.className = 'feedback correct';
    
    speak(`Level ${state.currentLevel} complete! Your score is ${state.score} out of 100`);
    
    // All levels remain unlocked, no need to unlock next level
    saveGameState();
    
    setTimeout(() => {
        showLevelSelection('math-quiz');
    }, 3000);
}

// Close game function
function closeGame() {
    // Hide all game containers
    const gameContainers = document.querySelectorAll('.game-container');
    gameContainers.forEach(container => {
        container.classList.remove('active');
    });
    
    // Stop any running games
    if (snake.gameRunning) {
        snake.gameRunning = false;
        document.removeEventListener('keydown', handleSnakeKeyPress);
    }
    
    currentGame = null;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility function to check if level is unlocked (always returns true now)
function isLevelUnlocked(gameType, level) {
    // All levels are always unlocked
    return true;
}

// Update level button appearance (all unlocked)
function updateLevelButtonAppearance(button, isUnlocked) {
    if (isUnlocked) {
        button.classList.remove('locked');
        button.classList.add('unlocked');
        button.disabled = false;
    } else {
        // This branch should never execute now, but keeping for safety
        button.classList.add('locked');
        button.classList.remove('unlocked');
        button.disabled = true;
    }
}

// Initialize level buttons on page load
function initializeLevelButtons() {
    const gameTypes = ['brain-teasers', 'word-scramble', 'snake', 'knowledge-quiz', 'math-quiz'];
    
    gameTypes.forEach(gameType => {
        const levelButtons = document.querySelectorAll(`#${gameType}-level-select .level-btn`);
        levelButtons.forEach((button, index) => {
            const level = index + 1;
            // All levels are unlocked by default
            updateLevelButtonAppearance(button, true);
        });
    });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    initializeLevelButtons();
});