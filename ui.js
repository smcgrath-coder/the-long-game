/* ============================================
   THE LONG GAME - UI
   Display management and visual effects
   ============================================ */

const UI = {
    // Initialize UI
    init() {
        this.createFloatingCoins();
        this.updateLeaderboard();
    },
    
    // Screen management
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    
    showTitle() {
        this.showScreen('screen-title');
    },
    
    showGoals() {
        this.showScreen('screen-goals');
    },
    
    showGame() {
        this.showScreen('screen-game');
    },
    
    showGameOver(won, data) {
        this.showScreen('screen-gameover');
        
        const icon = document.getElementById('gameover-icon');
        const title = document.getElementById('gameover-title');
        const message = document.getElementById('gameover-message');
        
        if (won) {
            icon.textContent = '🎉';
            title.textContent = 'AMAZING!';
            message.textContent = `You reached $${data.goal}! You're a savings superstar!`;
            this.triggerConfetti();
        } else if (data.money <= 0) {
            icon.textContent = '💸';
            title.textContent = 'BROKE!';
            message.textContent = "You ran out of money! But that's how we learn. Try again?";
        } else {
            icon.textContent = '⏰';
            title.textContent = 'TIME UP!';
            message.textContent = `You reached $${data.money} of $${data.goal}. So close!`;
        }
        
        document.getElementById('stat-money').textContent = '$' + data.money;
        document.getElementById('stat-months').textContent = data.months;
        document.getElementById('stat-best').textContent = data.bestPick || '—';
        
        const list = document.getElementById('lessons-list');
        list.innerHTML = '';
        data.lessons.forEach(lesson => {
            const li = document.createElement('li');
            li.textContent = lesson;
            list.appendChild(li);
        });
    },
    
    // Phase management
    showPhase(id) {
        document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    
    // Update displays
    updateHUD(state) {
        document.getElementById('month-num').textContent = state.month;
        document.getElementById('money-display').textContent = '$' + state.money;
        document.getElementById('cash-remaining').textContent = '$' + this.getCashRemaining(state);
        
        const progress = Math.min(100, (state.money / GameData.config.goalAmount) * 100);
        document.getElementById('progress-fill').style.width = progress + '%';
    },
    
    getCashRemaining(state) {
        const allocated = Object.values(state.allocations).reduce((a, b) => a + b, 0);
        return state.money - allocated;
    },
    
    updateAllocation(char, amount, state) {
        document.getElementById('invest-' + char).textContent = '$' + amount;
        document.getElementById('cash-remaining').textContent = '$' + this.getCashRemaining(state);
        
        // Update card selected state
        const card = document.querySelector(`[data-char="${char}"]`);
        if (amount > 0) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    },
    
    setGoalEmoji(goalKey) {
        const goal = GameData.goals[goalKey];
        document.getElementById('goal-emoji').textContent = goal.emoji;
    },
    
    resetAllocations() {
        ['shelly', 'goldie', 'rocket', 'mystery'].forEach(char => {
            document.getElementById('invest-' + char).textContent = '$0';
            document.querySelector(`[data-char="${char}"]`).classList.remove('selected');
        });
    },
    
    // Event display
    showEvent(event, callback) {
        this.showPhase('phase-event');
        
        document.getElementById('event-icon').textContent = event.icon;
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-desc').textContent = event.description;
        
        const container = document.getElementById('event-choices');
        container.innerHTML = '';
        
        event.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'event-btn';
            if (choice.type === 'good') btn.classList.add('good');
            if (choice.type === 'bad') btn.classList.add('bad');
            btn.textContent = choice.text;
            btn.onclick = () => callback(choice);
            container.appendChild(btn);
        });
    },
    
    // Results display
    showResults(results, startMoney, endMoney, eventEffect, month) {
        this.showPhase('phase-results');
        
        document.getElementById('result-month').textContent = month;
        
        const grid = document.getElementById('results-grid');
        grid.innerHTML = '';
        
        let investmentTotal = 0;
        
        results.forEach((r, i) => {
            if (r.invested > 0) {
                investmentTotal += r.change;
                
                const card = document.createElement('div');
                card.className = 'result-card ' + (r.change >= 0 ? 'positive' : 'negative');
                card.style.animationDelay = (i * 0.1) + 's';
                
                const char = GameData.characters[r.char];
                card.innerHTML = `
                    <div class="result-emoji">${char.emoji}</div>
                    <div class="result-name">${char.name}</div>
                    <div class="result-invested">Invested: $${r.invested}</div>
                    <div class="result-change ${r.change >= 0 ? 'positive' : 'negative'}">
                        ${r.change >= 0 ? '+' : ''}$${r.change}
                    </div>
                `;
                grid.appendChild(card);
            }
        });
        
        // If nothing invested
        if (grid.children.length === 0) {
            grid.innerHTML = `
                <div class="result-card">
                    <div class="result-emoji">🏦</div>
                    <div class="result-name">Cash</div>
                    <div class="result-invested">Kept safe</div>
                    <div class="result-change">$0</div>
                </div>
            `;
        }
        
        // Summary
        document.getElementById('summary-start').textContent = '$' + startMoney;
        
        const investEl = document.getElementById('summary-invest');
        investEl.textContent = (investmentTotal >= 0 ? '+' : '') + '$' + investmentTotal;
        investEl.className = investmentTotal >= 0 ? 'positive' : 'negative';
        
        const eventRow = document.getElementById('summary-event-row');
        const eventEl = document.getElementById('summary-event');
        if (eventEffect !== 0) {
            eventRow.style.display = 'flex';
            eventEl.textContent = (eventEffect >= 0 ? '+' : '') + '$' + eventEffect;
            eventEl.className = eventEffect >= 0 ? 'positive' : 'negative';
        } else {
            eventRow.style.display = 'none';
        }
        
        document.getElementById('summary-total').textContent = '$' + endMoney;
        
        // Update HUD
        document.getElementById('money-display').textContent = '$' + endMoney;
        const progress = Math.min(100, (endMoney / GameData.config.goalAmount) * 100);
        document.getElementById('progress-fill').style.width = progress + '%';
    },
    
    // Modal management
    showLeaderboard() {
        this.updateLeaderboard();
        document.getElementById('modal-leaderboard').classList.add('active');
    },
    
    showHowToPlay() {
        document.getElementById('modal-howto').classList.add('active');
    },
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    },
    
    updateLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const entries = Storage.getLeaderboard();
        
        if (entries.length === 0) {
            list.innerHTML = '<div class="empty-state">No games yet! Play to get on the board.</div>';
            return;
        }
        
        list.innerHTML = '';
        entries.slice(0, 10).forEach((entry, i) => {
            const goal = GameData.goals[entry.goal] || { name: 'Game', emoji: '🎯' };
            let rankClass = '';
            if (i === 0) rankClass = 'gold';
            if (i === 1) rankClass = 'silver';
            if (i === 2) rankClass = 'bronze';
            
            const div = document.createElement('div');
            div.className = 'lb-entry';
            div.innerHTML = `
                <div class="lb-rank ${rankClass}">${i < 3 ? ['🥇','🥈','🥉'][i] : '#' + (i + 1)}</div>
                <div class="lb-info">
                    <div class="lb-goal">${entry.won ? '🏆 ' : ''}${goal.name}</div>
                    <div class="lb-meta">${entry.date} • ${entry.months} months</div>
                </div>
                <div class="lb-score">$${entry.money}</div>
            `;
            list.appendChild(div);
        });
    },
    
    // Visual effects
    createFloatingCoins() {
        const container = document.getElementById('floating-coins');
        const coins = ['🪙', '💰', '💵', '✨'];
        
        for (let i = 0; i < 15; i++) {
            const coin = document.createElement('div');
            coin.className = 'floating-coin';
            coin.textContent = coins[Math.floor(Math.random() * coins.length)];
            coin.style.left = Math.random() * 100 + '%';
            coin.style.animationDelay = Math.random() * 20 + 's';
            coin.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(coin);
        }
    },
    
    triggerConfetti() {
        const container = document.getElementById('confetti');
        const colors = ['#00d4ff', '#00ff88', '#ffd700', '#ff6b35', '#a855f7', '#ff4757'];
        
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + '%';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.animationDuration = (2 + Math.random() * 2) + 's';
                if (Math.random() > 0.5) piece.style.borderRadius = '50%';
                container.appendChild(piece);
                
                setTimeout(() => piece.remove(), 4000);
            }, i * 30);
        }
    },
    
    // Screen shake for losses
    shake() {
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Reflow
        document.body.style.animation = 'shake 0.4s ease';
    }
};

// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => UI.init());
