/* ============================================
   THE LONG GAME - DATA
   Characters, events, and game configuration
   ============================================ */

const GameData = {
    config: {
        startingMoney: 100,
        goalAmount: 500,
        maxTurns: 10,
        eventChance: 0.65
    },
    
    goals: {
        bike: { name: 'New Bike', emoji: '🚲' },
        gaming: { name: 'Gaming Setup', emoji: '🎮' },
        pet: { name: 'Pet Supplies', emoji: '🐕' },
        trip: { name: 'Theme Park', emoji: '🎢' }
    },
    
    characters: {
        shelly: {
            name: 'Shelly',
            fullName: 'Shelly the Turtle',
            emoji: '🐢',
            description: 'Slow and steady wins the race!',
            riskLabel: 'SAFE',
            returnRange: '+2% to +3%',
            // Returns: always positive, small gains
            calcReturn: (amount) => {
                const rate = 0.02 + Math.random() * 0.01;
                return Math.round(amount * rate);
            },
            whyValue: "Shelly is like a savings account. The bank pays you a small thank-you for letting them use your money. It's boring, but it NEVER loses!",
            lesson: "Safe investments grow slowly, but they always grow."
        },
        
        goldie: {
            name: 'Goldie',
            fullName: 'Goldie the Goose',
            emoji: '🪿',
            description: 'Golden eggs... usually!',
            riskLabel: 'MODERATE',
            returnRange: '-10% to +15%',
            // Returns: usually positive, sometimes negative
            calcReturn: (amount) => {
                const roll = Math.random();
                let rate;
                if (roll < 0.2) {
                    rate = -0.05 - Math.random() * 0.05; // -5% to -10%
                } else if (roll < 0.5) {
                    rate = Math.random() * 0.05; // 0% to 5%
                } else {
                    rate = 0.05 + Math.random() * 0.10; // 5% to 15%
                }
                return Math.round(amount * rate);
            },
            whyValue: "Goldie is like owning tiny pieces of real companies (stocks). When they do well, you earn money. Sometimes they have bad months.",
            lesson: "Moderate risk usually pays off, but you need patience through the bad times."
        },
        
        rocket: {
            name: 'Rocket',
            fullName: 'Rocket Rabbit',
            emoji: '🐰',
            description: 'To the moon! ...or not',
            riskLabel: 'RISKY',
            returnRange: '-80% to +200%',
            // Returns: usually loses, occasionally huge win
            calcReturn: (amount) => {
                const roll = Math.random();
                let rate;
                if (roll < 0.55) {
                    rate = -0.3 - Math.random() * 0.5; // -30% to -80%
                } else if (roll < 0.85) {
                    rate = -0.1 + Math.random() * 0.4; // -10% to +30%
                } else {
                    rate = 0.5 + Math.random() * 1.5; // +50% to +200%
                }
                return Math.round(amount * rate);
            },
            whyValue: "Rocket is like crypto or hot stock tips. People promise huge gains! But most of the time, you lose big. The winners you hear about are rare.",
            lesson: "Big risks usually mean big losses. The winners are loud; the losers stay quiet."
        },
        
        mystery: {
            name: 'Mystery',
            fullName: 'Mystery Box',
            emoji: '📦',
            description: 'Sparkly! Exciting! Empty!',
            riskLabel: 'TRAP',
            returnRange: '-90% to +50%',
            // Returns: almost always loses
            calcReturn: (amount) => {
                const roll = Math.random();
                let rate;
                if (roll < 0.75) {
                    rate = -0.5 - Math.random() * 0.4; // -50% to -90%
                } else if (roll < 0.95) {
                    rate = -0.1 - Math.random() * 0.2; // -10% to -30%
                } else {
                    rate = Math.random() * 0.5; // 0% to +50%
                }
                return Math.round(amount * rate);
            },
            whyValue: "Mystery Box is like loot boxes or lottery tickets. They're DESIGNED to feel exciting—the sparkles, the suspense! But the odds are rigged against you.",
            lesson: "If something is designed to feel exciting, ask: who's really winning? Usually not you."
        }
    },
    
    events: [
        // POSITIVE EVENTS
        {
            id: 'found_money',
            icon: '🍀',
            title: 'Lucky Find!',
            description: 'You found a $5 bill on the sidewalk!',
            choices: [{ text: 'Sweet! +$5', effect: 5, type: 'good' }]
        },
        {
            id: 'grandma',
            icon: '👵',
            title: "Grandma's Gift",
            description: 'Grandma sent you $20 for being awesome!',
            choices: [{ text: 'Thanks Grandma! +$20', effect: 20, type: 'good' }]
        },
        {
            id: 'dog_walking',
            icon: '🐕',
            title: 'Opportunity!',
            description: 'Neighbor offers $15 to walk their dog this month.',
            choices: [
                { text: 'Walk the dog (+$15)', effect: 15, type: 'good' },
                { text: "I'm busy", effect: 0 }
            ]
        },
        {
            id: 'birthday',
            icon: '🎂',
            title: 'Happy Birthday!',
            description: 'Birthday money from relatives! $30!',
            choices: [{ text: 'Best day ever! +$30', effect: 30, type: 'good' }]
        },
        {
            id: 'recycling',
            icon: '♻️',
            title: 'Recycling Pays',
            description: 'You collected cans and bottles worth $8.',
            choices: [{ text: 'Cha-ching! +$8', effect: 8, type: 'good' }]
        },
        
        // NEGATIVE EVENTS
        {
            id: 'phone_crack',
            icon: '📱',
            title: 'Cracked Screen!',
            description: 'You dropped your phone! Repair costs $30.',
            choices: [
                { text: 'Fix it (-$30)', effect: -30, type: 'bad' },
                { text: 'Live with the crack', effect: 0 }
            ]
        },
        {
            id: 'friend_bday',
            icon: '🎁',
            title: "Friend's Birthday",
            description: "Your best friend's birthday is coming. A nice gift costs $15.",
            choices: [
                { text: 'Buy a gift (-$15)', effect: -15, type: 'bad' },
                { text: 'Make a card (free)', effect: 0 }
            ]
        },
        {
            id: 'new_game',
            icon: '🎮',
            title: 'FOMO Alert!',
            description: "Everyone's playing the hot new game. It costs $25.",
            choices: [
                { text: "I NEED it! (-$25)", effect: -25, type: 'bad' },
                { text: "I'll wait for a sale", effect: 0 }
            ],
            isFomo: true
        },
        {
            id: 'school_supplies',
            icon: '📚',
            title: 'School Project',
            description: 'You need supplies for a project. $12 required.',
            choices: [{ text: 'Pay up (-$12)', effect: -12, type: 'bad' }]
        },
        {
            id: 'trendy_clothes',
            icon: '👕',
            title: 'Fashion FOMO',
            description: "Everyone has the new trendy hoodie. It's $35.",
            choices: [
                { text: 'Gotta have it! (-$35)', effect: -35, type: 'bad' },
                { text: 'My clothes are fine', effect: 0 }
            ],
            isFomo: true
        },
        {
            id: 'bike_repair',
            icon: '🔧',
            title: 'Flat Tire!',
            description: 'Your bike has a flat. Repair kit costs $8.',
            choices: [
                { text: 'Fix it (-$8)', effect: -8, type: 'bad' },
                { text: 'Walk for now', effect: 0 }
            ]
        },
        
        // TEMPTATION EVENTS (teach about scams)
        {
            id: 'hot_tip',
            icon: '🚀',
            title: 'Hot Tip!',
            description: 'Someone online says "MoonCoin will 10x! Get in NOW before it\'s too late!"',
            choices: [
                { text: 'YOLO! Invest $20', effect: 'gamble', cost: 20, reward: 60, chance: 0.1, type: 'bad' },
                { text: "Sounds like a scam...", effect: 0, type: 'good' }
            ],
            isScam: true
        },
        {
            id: 'loot_box',
            icon: '✨',
            title: 'AMAZING DEAL!!!',
            description: 'LIMITED TIME: Mystery Bundle! Only $15! Could be worth $100!',
            choices: [
                { text: "Ooh sparkly! (-$15)", effect: 'gamble', cost: 15, reward: 25, chance: 0.15, type: 'bad' },
                { text: "I know this trick...", effect: 0, type: 'good' }
            ],
            isScam: true
        },
        
        // EDUCATIONAL
        {
            id: 'tip_compound',
            icon: '💡',
            title: 'Did You Know?',
            description: 'If you save $100 at 7% per year, it becomes $200 in about 10 years—without adding anything!',
            choices: [{ text: 'Whoa, math is cool!', effect: 0 }]
        }
    ],
    
    lessons: {
        shellyWin: "🐢 Shelly helped you grow money safely. Boring can be beautiful!",
        shellyIgnored: "🐢 You didn't use Shelly much. Safe investments might seem boring, but they add up!",
        rocketLoss: "🐰 Rocket was exciting, but risky investments usually lose. The big wins are rare!",
        rocketWin: "🐰 You got lucky with Rocket! Remember: this is rare. Don't expect it every time!",
        mysteryLoss: "📦 Mystery Box took your money. Those flashy animations hide terrible odds!",
        mysteryAvoided: "📦 Smart move avoiding Mystery Box! The excitement is the trick!",
        fomoSpent: "🛒 You spent on things because 'everyone had them.' That's FOMO—a powerful trick!",
        fomoResisted: "💪 You resisted buying things just because others had them. That takes strength!",
        scamAvoided: "🛡️ You spotted the scams! If it sounds too good to be true, it usually is.",
        patience: "⏰ Time is your friend when saving. The longer you wait, the more money grows!",
        won: "🏆 You reached your goal through patience and smart choices!"
    },
    
    getRandomEvent() {
        return this.events[Math.floor(Math.random() * this.events.length)];
    }
};
