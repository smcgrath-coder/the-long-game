/* ===========================================
   THE LONG GAME - GAME LOGIC
   Core game loop and state management
   =========================================== */

const Game = {
    // Current game state
    state: null,
    
    // Initialize default state
    getDefaultState: function() {
        return {
            mode: 'junior',
            turn: 1,
            money: GameData.junior.startingMoney,
            goal: GameData.junior.goalAmount,
            goalKey: null,
            allocations: {
                shelly: 0,
                goldie: 0,
                rocket: 0,
                mystery: 0
            },
            history: [],
            stats: {
                totalInvested: { shelly: 0, goldie: 0, rocket: 0, mystery: 0 },
                totalReturns: { shelly: 0, goldie: 0, rocket: 0, mystery: 0 },
                eventsEncountered: 0,
                fomoResisted: 0,
                fomoGaveIn: 0,
                scamsAvoided: 0,
                scamsFellFor: 0
            }
        };
    },
    
    // Start Junior Mode
    startJuniorMode: function() {
        this.state = this.getDefaultState();
        UI.showGoalSelection();
    },
    
    // Start Standard Mode (placeholder)
    startStandardMode: function() {
        alert('Standard Mode coming soon! Try Junior Mode for now.');
    },
    
    // Select goal and start game
    selectGoal: function(goalKey) {
        this.state.goalKey = goalKey;
        UI.updateGoalDisplay(goalKey);
        this.startGame();
    },
    
    // Start the game proper
    startGame: function() {
        UI.showGame();
        UI.showPhase('allocate');
        this.updateUI();
    },
    
    // Update all UI elements
    updateUI: function() {
        UI.updateTurn(this.state.turn, GameData.junior.maxTurns);
        UI.updateMoney(this.state.money);
        UI.updateProgress(this.state.money, this.state.goal);
        UI.updateCashRemaining(this.getCashRemaining());
        
        // Update allocations
        Object.keys(this.state.allocations).forEach(id => {
            UI.updateAllocation(id, this.state.allocations[id]);
        });
    },
    
    // Get unallocated cash
    getCashRemaining: function() {
        const allocated = Object.values(this.state.allocations).reduce((a, b) => a + b, 0);
        return this.state.money - allocated;
    },
    
    // Adjust allocation for a character
    adjustAllocation: function(characterId, delta) {
        const currentAlloc = this.state.allocations[characterId];
        const cashRemaining = this.getCashRemaining();
        
        let newAlloc = currentAlloc + delta;
        
        // Can't go below 0
        if (newAlloc < 0) newAlloc = 0;
        
        // Can't exceed available cash
        if (delta > 0 && delta > cashRemaining) {
            newAlloc = currentAlloc + cashRemaining;
        }
        
        // Round to nearest 10
        newAlloc = Math.round(newAlloc / 10) * 10;
        
        this.state.allocations[characterId] = newAlloc;
        
        UI.updateAllocation(characterId, newAlloc);
        UI.updateCashRemaining(this.getCashRemaining());
    },
    
    // Toggle allocation (click on card)
    toggleAllocation: function(characterId) {
        // If already has allocation, show info
        // Otherwise, do nothing (use +/- buttons)
    },
    
    // Proceed to next month
    nextMonth: function() {
        // Calculate investment returns
        const results = this.calculateReturns();
        
        // Store starting money for results display
        const startMoney = this.state.money;
        
        // Apply returns
        let totalChange = 0;
        results.forEach(result => {
            totalChange += result.change;
            
            // Track stats
            this.state.stats.totalInvested[result.characterId] += result.invested;
            this.state.stats.totalReturns[result.characterId] += result.change;
        });
        
        this.state.money += totalChange;
        
        // Record in history
        this.state.history.push({
            turn: this.state.turn,
            allocations: { ...this.state.allocations },
            results: results,
            moneyBefore: startMoney,
            moneyAfter: this.state.money
        });
        
        // Random chance of event (60%)
        if (Math.random() < 0.6) {
            const event = GameData.getRandomEvent();
            this.state.stats.eventsEncountered++;
            
            UI.showEvent(event, (choice) => {
                this.handleEventChoice(event, choice, results, startMoney);
            });
        } else {
            // No event, show results directly
            this.showTurnResults(results, startMoney, 0);
        }
    },
    
    // Calculate returns for all investments
    calculateReturns: function() {
        const results = [];
        
        Object.keys(this.state.allocations).forEach(characterId => {
            const invested = this.state.allocations[characterId];
            
            if (invested > 0) {
                const returnData = GameData.calculateReturn(characterId, invested);
                results.push({
                    characterId: characterId,
                    invested: invested,
                    rate: returnData.rate,
                    change: returnData.change,
                    newAmount: returnData.newAmount
                });
            } else {
                results.push({
                    characterId: characterId,
                    invested: 0,
                    rate: 0,
                    change: 0,
                    newAmount: 0
                });
            }
        });
        
        return results;
    },
    
    // Handle event choice
    handleEventChoice: function(event, choice, investmentResults, startMoney) {
        let eventEffect = 0;
        
        if (typeof choice.effect === 'number') {
            eventEffect = choice.effect;
            
            // Track FOMO/scam stats
            if (event.type === 'fomo') {
                if (choice.effect < 0) {
                    this.state.stats.fomoGaveIn++;
                } else {
                    this.state.stats.fomoResisted++;
                }
            }
            if (event.type === 'temptation') {
                if (choice.effect !== 0) {
                    this.state.stats.scamsFellFor++;
                } else {
                    this.state.stats.scamsAvoided++;
                }
            }
        } else if (choice.effect === 'gamble') {
            // Handle gambling choices
            this.state.money -= choice.cost;
            
            if (Math.random() < choice.chance) {
                // Won!
                eventEffect = choice.reward;
            } else {
                // Lost
                eventEffect = 0;
            }
            
            // Track stats
            if (event.type === 'temptation') {
                this.state.stats.scamsFellFor++;
            }
        }
        
        // Apply event effect
        this.state.money += eventEffect;
        
        // Update history with event
        const lastHistory = this.state.history[this.state.history.length - 1];
        if (lastHistory) {
            lastHistory.event = event;
            lastHistory.eventChoice = choice;
            lastHistory.eventEffect = eventEffect;
            lastHistory.moneyAfter = this.state.money;
        }
        
        this.showTurnResults(investmentResults, startMoney, eventEffect);
    },
    
    // Show turn results
    showTurnResults: function(results, startMoney, eventEffect) {
        UI.showResults(results, startMoney, this.state.money, eventEffect);
        UI.updateMoney(this.state.money, true);
        UI.updateProgress(this.state.money, this.state.goal);
    },
    
    // Continue to next turn or end game
    continueGame: function() {
        // Check win/lose conditions
        if (this.state.money >= this.state.goal) {
            this.endGame(true);
            return;
        }
        
        if (this.state.money <= 0) {
            this.endGame(false);
            return;
        }
        
        if (this.state.turn >= GameData.junior.maxTurns) {
            this.endGame(false);
            return;
        }
        
        // Next turn
        this.state.turn++;
        
        // Reset allocations
        this.state.allocations = {
            shelly: 0,
            goldie: 0,
            rocket: 0,
            mystery: 0
        };
        
        UI.resetAllocations();
        UI.showPhase('allocate');
        this.updateUI();
        
        // Save game
        Storage.saveGame(this.state);
    },
    
    // End the game
    endGame: function(won) {
        // Calculate best investment
        let bestInvestment = null;
        let bestReturn = -Infinity;
        
        Object.keys(this.state.stats.totalReturns).forEach(id => {
            const invested = this.state.stats.totalInvested[id];
            const returns = this.state.stats.totalReturns[id];
            
            if (invested > 0) {
                const roi = returns / invested;
                if (roi > bestReturn) {
                    bestReturn = roi;
                    bestInvestment = GameData.junior.characters[id].name + ' ' + GameData.junior.characters[id].emoji;
                }
            }
        });
        
        // Generate lessons based on behavior
        const lessons = this.generateLessons();
        
        // Prepare data for game over screen
        const data = {
            won: won,
            money: this.state.money,
            goal: this.state.goal,
            turn: this.state.turn,
            bestInvestment: bestInvestment,
            lessons: lessons
        };
        
        // Add to leaderboard
        const rank = Storage.addToLeaderboard({
            won: won,
            finalMoney: this.state.money,
            goal: this.state.goalKey,
            turns: this.state.turn,
            stats: this.state.stats
        });
        
        // Clear saved game
        Storage.clearGame();
        
        // Show game over screen
        UI.showGameOver(won, data);
    },
    
    // Generate lessons based on gameplay
    generateLessons: function() {
        const lessons = [];
        const stats = this.state.stats;
        
        // Shelly lessons
        if (stats.totalInvested.shelly > 0 && stats.totalReturns.shelly > 0) {
            lessons.push(GameData.lessons.shellySuccess);
        } else if (stats.totalInvested.shelly === 0) {
            lessons.push(GameData.lessons.shellyIgnored);
        }
        
        // Rocket lessons
        if (stats.totalInvested.rocket > 0) {
            if (stats.totalReturns.rocket < 0) {
                lessons.push(GameData.lessons.rocketLoss);
            } else if (stats.totalReturns.rocket > stats.totalInvested.rocket * 0.5) {
                lessons.push(GameData.lessons.rocketWin);
            }
        }
        
        // Mystery Box lessons
        if (stats.totalInvested.mystery > 0 && stats.totalReturns.mystery < 0) {
            lessons.push(GameData.lessons.mysteryLoss);
        } else if (stats.totalInvested.mystery === 0) {
            lessons.push(GameData.lessons.mysteryIgnored);
        }
        
        // FOMO lessons
        if (stats.fomoGaveIn > 0) {
            lessons.push(GameData.lessons.fomoSpending);
        } else if (stats.fomoResisted > 0) {
            lessons.push(GameData.lessons.fomoResisted);
        }
        
        // Ensure at least one lesson
        if (lessons.length === 0) {
            lessons.push(GameData.lessons.patience);
        }
        
        // Limit to 3 lessons
        return lessons.slice(0, 3);
    },
    
    // Play again with same goal
    playAgain: function() {
        const goalKey = this.state?.goalKey || 'bike';
        this.state = this.getDefaultState();
        this.state.goalKey = goalKey;
        UI.updateGoalDisplay(goalKey);
        this.startGame();
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved game
    const savedGame = Storage.loadGame();
    
    if (savedGame && savedGame.turn > 1) {
        // Could prompt to continue, for now just start fresh
        // TODO: Add "Continue?" prompt
    }
    
    // Start at title screen
    UI.showTitle();
});
