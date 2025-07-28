// Dados dos países  
const countries \= \[  
    { name: 'Brasil', flag: 'brasil.png' },  
    { name: 'Estados Unidos', flag: 'eua.jpg' },  
    { name: 'França', flag: 'franca.jpg' },  
    { name: 'Alemanha', flag: 'alemanha.png' },  
    { name: 'Japão', flag: 'japao.jpg' },  
    { name: 'China', flag: 'china.png' },  
    { name: 'Reino Unido', flag: 'reino\_unido.png' },  
    { name: 'Itália', flag: 'italia.gif' },  
    { name: 'Espanha', flag: 'espanha.png' },  
    { name: 'Canadá', flag: 'canada.jpg' },  
    { name: 'Austrália', flag: 'australia.png' },  
    { name: 'México', flag: 'mexico.png' }  
\];

// Variáveis do jogo  
let gameBoard \= \[\];  
let flippedCards \= \[\];  
let matchedPairs \= 0;  
let attempts \= 0;  
let gameTime \= 0;  
let gameTimer \= null;  
let gameStarted \= false;

// Elementos DOM  
const gameBoardElement \= document.getElementById('game-board');  
const attemptsElement \= document.getElementById('attempts');  
const timerElement \= document.getElementById('timer');  
const pairsElement \= document.getElementById('pairs');  
const restartBtn \= document.getElementById('restart-btn');  
const victoryModal \= document.getElementById('victory-modal');  
const finalAttemptsElement \= document.getElementById('final-attempts');  
const finalTimeElement \= document.getElementById('final-time');  
const playAgainBtn \= document.getElementById('play-again-btn');

// Inicializar o jogo  
function initGame() {  
    gameBoard \= \[\];  
    flippedCards \= \[\];  
    matchedPairs \= 0;  
    attempts \= 0;  
    gameTime \= 0;  
    gameStarted \= false;  
      
    if (gameTimer) {  
        clearInterval(gameTimer);  
        gameTimer \= null;  
    }  
      
    updateStats();  
    hideVictoryModal();  
    createGameBoard();  
}

// Criar o tabuleiro do jogo  
function createGameBoard() {  
    // Criar pares de cartas (bandeira \+ nome)  
    const cards \= \[\];  
      
    countries.forEach(country \=\> {  
        // Carta com bandeira  
        cards.push({  
            type: 'flag',  
            country: country.name,  
            content: country.flag,  
            id: \`flag-${country.name}\`  
        });  
          
        // Carta com nome  
        cards.push({  
            type: 'name',  
            country: country.name,  
            content: country.name,  
            id: \`name-${country.name}\`  
        });  
    });  
      
    // Embaralhar as cartas  
    gameBoard \= shuffleArray(cards);  
      
    // Limpar o tabuleiro  
    gameBoardElement.innerHTML \= '';  
      
    // Criar elementos das cartas  
    gameBoard.forEach((card, index) \=\> {  
        const cardElement \= createCardElement(card, index);  
        gameBoardElement.appendChild(cardElement);  
    });  
}

// Criar elemento de carta  
function createCardElement(card, index) {  
    const cardDiv \= document.createElement('div');  
    cardDiv.className \= 'card';  
    cardDiv.dataset.index \= index;  
    cardDiv.dataset.country \= card.country;  
    cardDiv.dataset.type \= card.type;  
      
    const cardFront \= document.createElement('div');  
    cardFront.className \= 'card-face card-front';  
    cardFront.textContent \= '🌍';  
      
    const cardBack \= document.createElement('div');  
    cardBack.className \= 'card-face card-back';  
      
    if (card.type \=== 'flag') {  
        const img \= document.createElement('img');  
        img.src \= card.content;  
        img.alt \= \`Bandeira ${card.country}\`;  
        cardBack.appendChild(img);  
          
        const countryName \= document.createElement('div');  
        countryName.className \= 'country-name';  
        countryName.textContent \= 'Bandeira';  
        cardBack.appendChild(countryName);  
    } else {  
        const countryName \= document.createElement('div');  
        countryName.className \= 'country-name';  
        countryName.textContent \= card.content;  
        countryName.style.fontSize \= '1rem';  
        countryName.style.marginTop \= '20px';  
        cardBack.appendChild(countryName);  
    }  
      
    cardDiv.appendChild(cardFront);  
    cardDiv.appendChild(cardBack);  
      
    cardDiv.addEventListener('click', () \=\> handleCardClick(cardDiv, index));  
      
    return cardDiv;  
}

// Embaralhar array  
function shuffleArray(array) {  
    const shuffled \= \[...array\];  
    for (let i \= shuffled.length \- 1; i \> 0; i--) {  
        const j \= Math.floor(Math.random() \* (i \+ 1));  
        \[shuffled\[i\], shuffled\[j\]\] \= \[shuffled\[j\], shuffled\[i\]\];  
    }  
    return shuffled;  
}

// Lidar com clique na carta  
function handleCardClick(cardElement, index) {  
    // Verificar se a carta já está virada ou se já há 2 cartas viradas  
    if (cardElement.classList.contains('flipped') ||   
        cardElement.classList.contains('matched') ||   
        flippedCards.length \>= 2\) {  
        return;  
    }  
      
    // Iniciar o timer na primeira jogada  
    if (\!gameStarted) {  
        startTimer();  
        gameStarted \= true;  
    }  
      
    // Virar a carta  
    cardElement.classList.add('flipped');  
    flippedCards.push({ element: cardElement, index: index });  
      
    // Verificar se duas cartas foram viradas  
    if (flippedCards.length \=== 2\) {  
        attempts++;  
        updateStats();  
          
        setTimeout(() \=\> {  
            checkMatch();  
        }, 1000);  
    }  
}

// Verificar se as cartas formam um par  
function checkMatch() {  
    const \[card1, card2\] \= flippedCards;  
    const country1 \= card1.element.dataset.country;  
    const country2 \= card2.element.dataset.country;  
      
    if (country1 \=== country2) {  
        // Par encontrado  
        card1.element.classList.add('matched');  
        card2.element.classList.add('matched');  
        matchedPairs++;  
        updateStats();  
          
        // Verificar se o jogo terminou  
        if (matchedPairs \=== countries.length) {  
            endGame();  
        }  
    } else {  
        // Não é um par, virar as cartas de volta  
        card1.element.classList.remove('flipped');  
        card2.element.classList.remove('flipped');  
    }  
      
    flippedCards \= \[\];  
}

// Iniciar cronômetro  
function startTimer() {  
    gameTimer \= setInterval(() \=\> {  
        gameTime++;  
        updateStats();  
    }, 1000);  
}

// Atualizar estatísticas  
function updateStats() {  
    attemptsElement.textContent \= attempts;  
    pairsElement.textContent \= \`${matchedPairs}/${countries.length}\`;  
      
    const minutes \= Math.floor(gameTime / 60);  
    const seconds \= gameTime % 60;  
    timerElement.textContent \= \`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\`;  
}

// Finalizar o jogo  
function endGame() {  
    if (gameTimer) {  
        clearInterval(gameTimer);  
        gameTimer \= null;  
    }  
      
    finalAttemptsElement.textContent \= attempts;  
    finalTimeElement.textContent \= timerElement.textContent;  
      
    setTimeout(() \=\> {  
        showVictoryModal();  
    }, 500);  
}

// Mostrar modal de vitória  
function showVictoryModal() {  
    victoryModal.classList.remove('hidden');  
}

// Esconder modal de vitória  
function hideVictoryModal() {  
    victoryModal.classList.add('hidden');  
}

// Event listeners  
restartBtn.addEventListener('click', initGame);  
playAgainBtn.addEventListener('click', initGame);

// Fechar modal clicando fora dele  
victoryModal.addEventListener('click', (e) \=\> {  
    if (e.target \=== victoryModal) {  
        hideVictoryModal();  
    }  
});

// Inicializar o jogo quando a página carregar  
document.addEventListener('DOMContentLoaded', initGame);

