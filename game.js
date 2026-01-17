/* ============================================
   THE LONG GAME - GAME LOGIC
   Core game loop and state management
   ============================================ */

const Game = {
    state: null,
    
    // Initialize new game state
    createState() {
        return {
            month: 1,
            money: GameData.config.startingMoney,
            goal: GameData.config.goalAmount,
            goalKey: null,
            allocations: {
                shelly: 0,
                goldie: 0,
                rocket: 0,
                mystery: 0
            },
            stats: {
                invested: { shelly: 0, goldie: 0, rocket: 0, mystery: 0 },
                returns: { shelly: 0, goldie: 0, rocket: 0, mystery: 0 },
                fomoResisted: 0,
                fomoGaveIn: 0,
                scamsAvoided: 0,
                scamsFellFor: 0
            }
        };
    },
    
    // Start game
    start() {
        this.state = this.createState();
        UI.showGoals();
    },
    
    // Select goal and begin
    selectGoal(key) {
        this.state.goalKey = key;
        UI.setGoalEmoji(key);
        UI.showGame();
        UI.showPhase('phase-allocate');
        UI.updateHUD(this.state);
        UI.resetAllocations();
    },
    
    // Adjust allocation
    adjust(char, delta) {
        const current = this.state.allocations[char];
        const remaining = UI.getCashRemaining(this.state);
        
        let newAmount = current + delta;
        
        // Clamp
        if (newAmount < 0) newAmount = 0;
        if (delta > 0 && delta > remaining) newAmount = current + remaining;
        if (newAmount > this.state.money) newAmount = this.state.money;
        
        // Round to 10
        newAmount = Math.round(newAmount / 10) * 10;
        
        this.state.allocations[char] = newAmount;
        UI.updateAllocation(char, newAmount, this.state);
    },
    
    // End month - calculate returns
    endMonth() {
        const startMoney = this.state.money;
        const results = [];
        
        // Calculate returns for each character
        Object.keys(this.state.allocations).forEach(char => {
            const invested = this.state.allocations[char];
            let change = 0;
            
            if (invested > 0) {
                change = GameData.characters[char].calcReturn(invested);
                
                // Track stats
                this.state.stats.invested[char] += invested;
                this.state.stats.returns[char] += change;
            }
            
            results.push({ char, invested, change });
        });
        
        // Apply returns
        const totalChange = results.reduce((sum, r) => sum + r.change, 0);
        this.state.money += totalChange;
        if (this.state.money < 0) this.state.money = 0;
        
        // Store results for later
        this.lastResults = results;
        this.lastStartMoney = startMoney;
        
        // Check for event
        if (Math.random() < GameData.config.eventChance) {
            const event = GameData.getRandomEvent();
            UI.showEvent(event, (choice) => this.handleEvent(event, choice));
        } else {
            this.showMonthResults(0);
        }
    },
    
    // Handle event choice
    handleEvent(event, choice) {
        let effect = 0;
        
        if (choice.effect === 'gamble') {
            // Gambling choice (scams, etc.)
            if (Math.random() < choice.chance) {
                effect = choice.reward - choice.cost;
            } else {
                effect = -choice.cost;
            }
            
            if (event.isScam) {
                this.state.stats.scamsFellFor++;
            }
        } else if (typeof choice.effect === 'number') {
            effect = choice.effect;
            
            // Track FOMO/scam stats
            if (event.isFomo) {
                if (choice.effect < 0) {
                    this.state.stats.fomoGaveIn++;
                } else if (choice.effect === 0) {
                    this.state.stats.fomoResisted++;
                }
            }
            if (event.isScam && choice.effect === 0) {
                this.state.stats.scamsAvoided++;
            }
        }
        
        this.state.money += effect;
        if (this.state.money < 0) this.state.money = 0;
        
        this.showMonthResults(effect);
    },
    
    // Show month results
    showMonthResults(eventEffect) {
        UI.showResults(
            this.lastResults,
            this.lastStartMoney,
            this.state.money,
            eventEffect,
            this.state.month
        );
        
        // Effects based on outcome
        const totalChange = this.lastResults.reduce((sum, r) => sum + r.change, 0) + eventEffect;
        if (totalChange < -20) {
            UI.shake();
        }
    },
    
    // Continue to next turn
    nextTurn() {
        // Check win
        if (this.state.money >= this.state.goal) {
            this.endGame(true);
            return;
        }
        
        // Check lose
        if (this.state.money <= 0) {
            this.endGame(false);
            return;
        }
        
        // Check time
        if (this.state.month >= GameData.config.maxTurns) {
            this.endGame(false);
            return;
        }
        
        // Next month
        this.state.month++;
        this.state.allocations = { shelly: 0, goldie: 0, rocket: 0, mystery: 0 };
        
        UI.resetAllocations();
        UI.showPhase('phase-allocate');
        UI.updateHUD(this.state);
        
        Storage.saveGame(this.state);
    },
    
    // End game
    endGame(won) {
        // Find best investment
        let bestPick = null;
        let bestROI = -Infinity;
        
        Object.keys(this.state.stats.returns).forEach(char => {
            const invested = this.state.stats.invested[char];
            const returns = this.state.stats.returns[char];
            
            if (invested > 0) {
                const roi = returns / invested;
                if (roi > bestROI) {
                    bestROI = roi;
                    bestPick = GameData.characters[char].emoji;
                }
            }
        });
        
        // Generate lessons
        const lessons = this.generateLessons(won);
        
        // Save to leaderboard
        Storage.addScore({
            won,
            money: this.state.money,
            goal: this.state.goalKey,
            months: this.state.month
        });
        
        Storage.clearGame();
        
        UI.showGameOver(won, {
            money: this.state.money,
            goal: this.state.goal,
            months: this.state.month,
            bestPick,
            lessons
        });
    },
    
    // Generate lessons based on play
    generateLessons(won) {
        const lessons = [];
        const s = this.state.stats;
        
        // Win lesson
        if (won) {
            lessons.push(GameData.lessons.won);
        }
        
        // Shelly
        if (s.invested.shelly > 50 && s.returns.shelly > 0) {
            lessons.push(GameData.lessons.shellyWin);
        } else if (s.invested.shelly === 0 && this.state.month > 3) {
            lessons.push(GameData.lessons.shellyIgnored);
        }
        
        // Rocket
        if (s.invested.rocket > 30) {
            if (s.returns.rocket < -10) {
                lessons.push(GameData.lessons.rocketLoss);
            } else if (s.returns.rocket > s.invested.rocket * 0.3) {
                lessons.push(GameData.lessons.rocketWin);
            }
        }
        
        // Mystery
        if (s.invested.mystery > 20 && s.returns.mystery < 0) {
            lessons.push(GameData.lessons.mysteryLoss);
        } else if (s.invested.mystery === 0 && this.state.month > 3) {
            lessons.push(GameData.lessons.mysteryAvoided);
        }
        
        // FOMO
        if (s.fomoGaveIn > 1) {
            lessons.push(GameData.lessons.fomoSpent);
        } else if (s.fomoResisted > 1) {
            lessons.push(GameData.lessons.fomoResisted);
        }
        
        // Scams
        if (s.scamsAvoided > 0 && s.scamsFellFor === 0) {
            lessons.push(GameData.lessons.scamAvoided);
        }
        
        // Default
        if (lessons.length === 0) {
            lessons.push(GameData.lessons.patience);
        }
        
        return lessons.slice(0, 3);
    },
    
    // Play again
    playAgain() {
        const goalKey = this.state?.goalKey || 'bike';
        this.state = this.createState();
        this.state.goalKey = goalKey;
        UI.setGoalEmoji(goalKey);
        UI.showGame();
        UI.showPhase('phase-allocate');
        UI.updateHUD(this.state);
        UI.resetAllocations();
    }
};

// Start on title screen
document.addEventListener('DOMContentLoaded', () => {
    UI.showTitle();
});
