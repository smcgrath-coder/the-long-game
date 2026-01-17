/* ===========================================
   THE LONG GAME - STORAGE
   Save/Load game state and leaderboards
   =========================================== */

const Storage = {
    KEYS: {
        CURRENT_GAME: 'longGame_currentGame',
        LEADERBOARD: 'longGame_leaderboard',
        SETTINGS: 'longGame_settings'
    },
    
    // Save current game state
    saveGame: function(state) {
        try {
            localStorage.setItem(this.KEYS.CURRENT_GAME, JSON.stringify(state));
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            return false;
        }
    },
    
    // Load current game state
    loadGame: function() {
        try {
            const saved = localStorage.getItem(this.KEYS.CURRENT_GAME);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Failed to load game:', e);
            return null;
        }
    },
    
    // Clear current game
    clearGame: function() {
        localStorage.removeItem(this.KEYS.CURRENT_GAME);
    },
    
    // Get leaderboard
    getLeaderboard: function() {
        try {
            const saved = localStorage.getItem(this.KEYS.LEADERBOARD);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load leaderboard:', e);
            return [];
        }
    },
    
    // Add entry to leaderboard
    addToLeaderboard: function(entry) {
        try {
            const leaderboard = this.getLeaderboard();
            
            // Add timestamp and unique ID
            entry.id = Date.now();
            entry.date = new Date().toLocaleDateString();
            entry.timestamp = Date.now();
            
            // Add to list
            leaderboard.push(entry);
            
            // Sort by final money (descending)
            leaderboard.sort((a, b) => b.finalMoney - a.finalMoney);
            
            // Keep only top 20
            const trimmed = leaderboard.slice(0, 20);
            
            localStorage.setItem(this.KEYS.LEADERBOARD, JSON.stringify(trimmed));
            
            // Return the rank (1-indexed)
            return trimmed.findIndex(e => e.id === entry.id) + 1;
        } catch (e) {
            console.error('Failed to add to leaderboard:', e);
            return -1;
        }
    },
    
    // Clear leaderboard
    clearLeaderboard: function() {
        if (confirm('Are you sure you want to clear the leaderboard? This cannot be undone!')) {
            localStorage.removeItem(this.KEYS.LEADERBOARD);
            UI.showLeaderboard(); // Refresh the display
        }
    },
    
    // Get best run
    getBestRun: function() {
        const leaderboard = this.getLeaderboard();
        return leaderboard.length > 0 ? leaderboard[0] : null;
    },
    
    // Get recent runs
    getRecentRuns: function(count = 5) {
        const leaderboard = this.getLeaderboard();
        // Sort by timestamp descending
        const byRecent = [...leaderboard].sort((a, b) => b.timestamp - a.timestamp);
        return byRecent.slice(0, count);
    },
    
    // Settings
    getSettings: function() {
        try {
            const saved = localStorage.getItem(this.KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : {
                soundEnabled: true,
                animationsEnabled: true,
                playerName: 'Player'
            };
        } catch (e) {
            return {
                soundEnabled: true,
                animationsEnabled: true,
                playerName: 'Player'
            };
        }
    },
    
    saveSettings: function(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }
};
