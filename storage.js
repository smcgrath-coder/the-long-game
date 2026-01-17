/* ============================================
   THE LONG GAME - STORAGE
   Save/Load and Leaderboard management
   ============================================ */

const Storage = {
    KEYS: {
        GAME: 'thelonggame_save',
        LEADERBOARD: 'thelonggame_leaderboard'
    },
    
    // Save current game
    saveGame(state) {
        try {
            localStorage.setItem(this.KEYS.GAME, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save game:', e);
        }
    },
    
    // Load saved game
    loadGame() {
        try {
            const data = localStorage.getItem(this.KEYS.GAME);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },
    
    // Clear saved game
    clearGame() {
        localStorage.removeItem(this.KEYS.GAME);
    },
    
    // Get leaderboard
    getLeaderboard() {
        try {
            const data = localStorage.getItem(this.KEYS.LEADERBOARD);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },
    
    // Add to leaderboard
    addScore(entry) {
        const board = this.getLeaderboard();
        
        entry.id = Date.now();
        entry.date = new Date().toLocaleDateString();
        
        board.push(entry);
        board.sort((a, b) => b.money - a.money);
        
        // Keep top 20
        const trimmed = board.slice(0, 20);
        
        try {
            localStorage.setItem(this.KEYS.LEADERBOARD, JSON.stringify(trimmed));
        } catch (e) {
            console.warn('Could not save leaderboard:', e);
        }
        
        return trimmed.findIndex(e => e.id === entry.id) + 1;
    },
    
    // Clear all data
    clearAll() {
        if (confirm('Clear all saved data and leaderboard?')) {
            localStorage.removeItem(this.KEYS.GAME);
            localStorage.removeItem(this.KEYS.LEADERBOARD);
            UI.updateLeaderboard();
        }
    }
};
