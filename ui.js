/* ===========================================
   THE LONG GAME - UI
   DOM manipulation and screen management
   =========================================== */

const UI = {
    // Screen management
    screens: {
        title: document.getElementById('screen-title'),
        goal: document.getElementById('screen-goal'),
        game: document.getElementById('screen-game'),
        gameover: document.getElementById('screen-gameover')
    },
    
    // Show a specific screen
    showScreen: function(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    },
    
    showTitle: function() {
        this.showScreen('title');
    },
    
    showGoalSelection: function() {
        this.showScreen('goal');
    },
    
    showGame: function() {
        this.showScreen('game');
    },
    
    showGameOver: function(won, data) {
        this.showScreen('gameover');
        
        const icon = document.getElementById('gameover-icon');
        const title = document.getElementById('gameover-title');
        const message = document.getElementById('gameover-message');
        const finalMoney = document.getElementById('final-money');
        const finalTurns = document.getElementById('final-turns');
        const finalBest = document.getElementById('final-best');
        const lessonsList = document.getElementById('lessons-list');
        
        if (won) {
            icon.textContent = '🎉';
            title.textContent = 'You Did It!';
            message.textContent = `You reached your goal of $${data.goal}! Great job saving up!`;
        } else if (data.money <= 0) {
            icon.textContent = '😢';
            title.textContent = 'Out of Money!';
            message.textContent = "You ran out of money. But that's okay—this is how we learn! Try again?";
        } else {
            icon.textContent = '⏰';
            title.textContent = 'Time\'s Up!';
            message.textContent = `You reached $${data.money} out of $${data.goal}. So close! Want to try again?`;
        }
        
        finalMoney.textContent = '$' + data.money;
        finalTurns.textContent = data.turn;
        finalBest.textContent = data.bestInvestment || 'None';
        
        // Populate lessons
        lessonsList.innerHTML = '';
        data.lessons.forEach(lesson => {
            const li = document.createElement('li');
            li.textContent = lesson;
            lessonsList.appendChild(li);
        });
    },
    
    // Game phase management
    phases: {
        allocate: document.getElementById('phase-allocate'),
        event: document.getElementById('phase-event'),
        results: document.getElementById('phase-results')
    },
    
    showPhase: function(phaseName) {
        Object.values(this.phases).forEach(phase => {
            phase.classList.add('hidden');
        });
        
        if (this.phases[phaseName]) {
            this.phases[phaseName].classList.remove('hidden');
        }
    },
    
    // Update header displays
    updateTurn: function(turn, maxTurns) {
        document.getElementById('turn-number').textContent = turn;
    },
    
    updateMoney: function(money, animate = false) {
        const el = document.getElementById('current-money');
        el.textContent = '$' + money;
        
        if (animate) {
            el.classList.add('pulse');
            setTimeout(() => el.classList.remove('pulse'), 500);
        }
    },
    
    updateProgress: function(money, goal) {
        const percentage = Math.min(100, (money / goal) * 100);
        document.getElementById('progress-fill').style.width = percentage + '%';
    },
    
    updateGoalDisplay: function(goalKey) {
        const goal = GameData.junior.goals[goalKey];
        document.getElementById('goal-icon').textContent = goal.emoji;
    },
    
    // Allocation display
    updateAllocation: function(characterId, amount) {
        document.getElementById('alloc-' + characterId).textContent = '$' + amount;
        
        // Update card selection state
        const card = document.querySelector(`.character-card[data-character="${characterId}"]`);
        if (amount > 0) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    },
    
    updateCashRemaining: function(amount) {
        document.getElementById('cash-remaining').textContent = '$' + amount;
    },
    
    // Event display
    showEvent: function(event, callback) {
        this.showPhase('event');
        
        document.getElementById('event-icon').textContent = event.icon;
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-description').textContent = event.description;
        
        const choicesContainer = document.getElementById('event-choices');
        choicesContainer.innerHTML = '';
        
        if (event.choices) {
            event.choices.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.className = 'event-choice-btn';
                btn.textContent = choice.text;
                
                // Style based on effect
                if (typeof choice.effect === 'number') {
                    if (choice.effect > 0) btn.classList.add('positive');
                    else if (choice.effect < 0) btn.classList.add('negative');
                }
                
                btn.onclick = () => callback(choice);
                choicesContainer.appendChild(btn);
            });
        } else {
            // Automatic event (windfall or mandatory expense)
            const btn = document.createElement('button');
            btn.className = 'event-choice-btn';
            
            if (event.amount > 0) {
                btn.textContent = `Nice! +$${event.amount}`;
                btn.classList.add('positive');
            } else if (event.amount < 0) {
                btn.textContent = `Pay $${Math.abs(event.amount)}`;
                btn.classList.add('negative');
            } else {
                btn.textContent = 'Continue';
            }
            
            btn.onclick = () => callback({ effect: event.amount || 0 });
            choicesContainer.appendChild(btn);
        }
    },
    
    // Results display
    showResults: function(results, startMoney, endMoney, eventEffect) {
        this.showPhase('results');
        
        const container = document.getElementById('results-container');
        container.innerHTML = '';
        
        let totalGains = 0;
        
        // Show each investment result
        results.forEach((result, index) => {
            if (result.invested > 0) {
                totalGains += result.change;
                
                const card = document.createElement('div');
                card.className = 'result-card';
                card.style.animationDelay = (index * 0.1) + 's';
                
                const char = GameData.junior.characters[result.characterId];
                
                card.innerHTML = `
                    <div class="result-avatar">${char.emoji}</div>
                    <div class="result-name">${char.name}</div>
                    <div class="result-invested">Invested: $${result.invested}</div>
                    <div class="result-change ${result.change >= 0 ? 'positive' : 'negative'}">
                        ${result.change >= 0 ? '+' : ''}$${result.change}
                    </div>
                `;
                
                container.appendChild(card);
            }
        });
        
        // Update summary
        document.getElementById('result-start').textContent = '$' + startMoney;
        
        const gainsEl = document.getElementById('result-gains');
        gainsEl.textContent = (totalGains >= 0 ? '+' : '') + '$' + totalGains;
        gainsEl.className = 'summary-value ' + (totalGains >= 0 ? 'gains' : 'losses');
        
        const eventsEl = document.getElementById('result-events');
        if (eventEffect !== 0) {
            eventsEl.textContent = (eventEffect >= 0 ? '+' : '') + '$' + eventEffect;
            eventsEl.className = 'summary-value ' + (eventEffect >= 0 ? 'gains' : 'losses');
        } else {
            eventsEl.textContent = '$0';
            eventsEl.className = 'summary-value';
        }
        
        document.getElementById('result-total').textContent = '$' + endMoney;
    },
    
    // Leaderboard modal
    showLeaderboard: function() {
        document.getElementById('modal-leaderboard').classList.remove('hidden');
        this.showLeaderboardTab('best');
    },
    
    hideLeaderboard: function() {
        document.getElementById('modal-leaderboard').classList.add('hidden');
    },
    
    showLeaderboardTab: function(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const content = document.getElementById('leaderboard-content');
        let entries;
        
        if (tab === 'best') {
            entries = Storage.getLeaderboard();
        } else {
            entries = Storage.getRecentRuns(10);
        }
        
        if (entries.length === 0) {
            content.innerHTML = '<div class="empty-leaderboard">No games played yet!<br>Play a game to get on the board!</div>';
            return;
        }
        
        content.innerHTML = '';
        entries.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            
            let rankClass = '';
            if (tab === 'best') {
                if (index === 0) rankClass = 'gold';
                else if (index === 1) rankClass = 'silver';
                else if (index === 2) rankClass = 'bronze';
            }
            
            const goalEmoji = GameData.junior.goals[entry.goal]?.emoji || '🎯';
            
            div.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${tab === 'best' ? '#' + (index + 1) : goalEmoji}</div>
                <div class="leaderboard-details">
                    <div class="leaderboard-name">${entry.won ? '🏆 ' : ''}${entry.goal ? GameData.junior.goals[entry.goal]?.name : 'Game'}</div>
                    <div class="leaderboard-meta">${entry.date} • ${entry.turns} months</div>
                </div>
                <div class="leaderboard-score">$${entry.finalMoney}</div>
            `;
            
            content.appendChild(div);
        });
    },
    
    // Info modal
    showInfo: function(characterId) {
        const char = GameData.junior.characters[characterId];
        
        document.getElementById('info-title').textContent = char.name;
        document.getElementById('info-content').innerHTML = `
            <div style="text-align: center; font-size: 4rem; margin-bottom: 20px;">${char.emoji}</div>
            <h3>Why does ${char.name.split(' ')[0]} have value?</h3>
            <p style="margin-bottom: 20px;">${char.whyValue}</p>
            <h3>The Lesson</h3>
            <p>${char.lesson}</p>
        `;
        
        document.getElementById('modal-info').classList.remove('hidden');
    },
    
    hideInfo: function() {
        document.getElementById('modal-info').classList.add('hidden');
    },
    
    // Floating money animation
    showMoneyChange: function(amount, x, y) {
        const el = document.createElement('div');
        el.className = 'money-change ' + (amount >= 0 ? 'positive' : 'negative');
        el.textContent = (amount >= 0 ? '+' : '') + '$' + amount;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        document.body.appendChild(el);
        
        setTimeout(() => el.remove(), 1000);
    },
    
    // Reset allocation display
    resetAllocations: function() {
        ['shelly', 'goldie', 'rocket', 'mystery'].forEach(id => {
            this.updateAllocation(id, 0);
        });
    }
};
