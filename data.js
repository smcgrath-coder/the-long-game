/* ===========================================
   THE LONG GAME - DATA
   Characters, events, and game configuration
   =========================================== */

const GameData = {
    // Junior Mode Configuration
    junior: {
        startingMoney: 100,
        goalAmount: 500,
        maxTurns: 10,
        
        // Investment characters
        characters: {
            shelly: {
                name: "Shelly the Turtle",
                emoji: "🐢",
                description: "Slow and steady wins the race!",
                riskLevel: "safe",
                riskLabel: "Safe",
                // Returns are weighted - most outcomes cluster around the middle
                returns: {
                    min: 0.02,      // +2%
                    max: 0.03,      // +3%
                    // Shelly NEVER loses money
                    weights: [0.3, 0.4, 0.3]  // low, mid, high
                },
                // Educational info
                whyValue: "Shelly is like a savings account at a bank. The bank uses your money to help other people (like giving loans), and pays you a little bit extra as a thank you. It's not exciting, but it ALWAYS grows!",
                lesson: "Slow and steady growth is boring, but it's reliable. Shelly never loses your money!"
            },
            
            goldie: {
                name: "Goldie the Goose",
                emoji: "🪿",
                description: "Lays golden eggs... usually!",
                riskLevel: "moderate",
                riskLabel: "Moderate",
                returns: {
                    min: -0.10,     // -10%
                    max: 0.15,      // +15%
                    // Most of the time positive, but sometimes negative
                    weights: [0.15, 0.55, 0.30]  // lose, small gain, good gain
                },
                whyValue: "Goldie is like owning a tiny piece of real companies (called 'stocks'). When companies do well and make money, you get some too! But sometimes companies have bad months, and you might lose a little.",
                lesson: "Goldie usually does well over time, but you have to be patient through the bad months."
            },
            
            rocket: {
                name: "Rocket Rabbit",
                emoji: "🐰",
                description: "To the moon! ...or the ground.",
                riskLevel: "risky",
                riskLabel: "Risky!",
                returns: {
                    min: -0.80,     // -80%
                    max: 2.00,      // +200%
                    // Usually loses, occasionally big win
                    weights: [0.60, 0.25, 0.15]  // big lose, small change, big win
                },
                whyValue: "Rocket Rabbit is like 'hot tips' or meme coins people talk about online. Someone says 'trust me, this will go up!' Sometimes they're right and you win big. But MOST of the time, they're wrong and you lose almost everything.",
                lesson: "When something sounds too good to be true, it usually is. The big wins you hear about are rare—you don't hear about all the people who lost."
            },
            
            mystery: {
                name: "Mystery Box",
                emoji: "📦",
                description: "Exciting! Sparkly! Usually empty!",
                riskLevel: "dangerous",
                riskLabel: "Dangerous!",
                returns: {
                    min: -0.90,     // -90%
                    max: 0.50,      // +50%
                    // Almost always loses, very rare small win
                    weights: [0.75, 0.20, 0.05]  // lose big, lose small, small win
                },
                whyValue: "Mystery Box is like loot boxes in video games or lottery tickets. They're DESIGNED to be exciting—the sparkles, the suspense, the 'maybe THIS time!' feeling. But the company that makes them sets the odds so THEY always win in the long run.",
                lesson: "Mystery Box is designed to FEEL exciting, even when you lose. That's the trick! The excitement is the product, not the prize."
            }
        },
        
        // Events that can happen each turn
        events: [
            // Positive events (windfalls)
            {
                id: "found_money",
                icon: "🍀",
                title: "Lucky Find!",
                description: "You found $5 on the sidewalk!",
                type: "windfall",
                amount: 5,
                choices: null  // Automatic, no choice
            },
            {
                id: "gift_grandma",
                icon: "👵",
                title: "Grandma's Gift",
                description: "Grandma sent you $20 for being awesome!",
                type: "windfall",
                amount: 20,
                choices: null
            },
            {
                id: "dog_walking",
                icon: "🐕",
                title: "Job Opportunity!",
                description: "Your neighbor offers $15 to walk their dog.",
                type: "opportunity",
                choices: [
                    { text: "Walk the dog! (+$15)", effect: 15 },
                    { text: "No thanks, I'm busy", effect: 0 }
                ]
            },
            {
                id: "lemonade_stand",
                icon: "🍋",
                title: "Business Idea!",
                description: "You could set up a lemonade stand. Costs $10 in supplies, might make $25!",
                type: "opportunity",
                choices: [
                    { text: "Try it! (-$10, 60% chance of +$25)", effect: "gamble", cost: 10, reward: 25, chance: 0.6 },
                    { text: "Too risky for me", effect: 0 }
                ]
            },
            {
                id: "birthday_money",
                icon: "🎂",
                title: "Birthday Money!",
                description: "It's your birthday! You got $30 in cards!",
                type: "windfall",
                amount: 30,
                choices: null
            },
            {
                id: "recycling",
                icon: "♻️",
                title: "Recycling Reward",
                description: "You collected cans and bottles worth $8!",
                type: "windfall",
                amount: 8,
                choices: null
            },
            
            // Negative events (expenses)
            {
                id: "phone_crack",
                icon: "📱",
                title: "Cracked Screen!",
                description: "Your phone screen cracked. Repair costs $30.",
                type: "expense",
                choices: [
                    { text: "Pay for repair (-$30)", effect: -30 },
                    { text: "Live with the crack (free)", effect: 0 }
                ]
            },
            {
                id: "friend_birthday",
                icon: "🎁",
                title: "Friend's Birthday",
                description: "Your best friend's birthday is coming up. A good gift would be $15.",
                type: "social",
                choices: [
                    { text: "Buy a nice gift (-$15)", effect: -15 },
                    { text: "Make a homemade card (free)", effect: 0 }
                ]
            },
            {
                id: "new_game",
                icon: "🎮",
                title: "New Game Alert!",
                description: "Everyone's playing the new game! It costs $25.",
                type: "fomo",
                choices: [
                    { text: "Buy it! I don't want to miss out! (-$25)", effect: -25 },
                    { text: "Wait for it to go on sale", effect: 0 }
                ]
            },
            {
                id: "school_supplies",
                icon: "📚",
                title: "School Project",
                description: "You need supplies for a school project. Cost: $12.",
                type: "expense",
                amount: -12,
                choices: null  // Mandatory expense
            },
            {
                id: "bike_repair",
                icon: "🔧",
                title: "Flat Tire!",
                description: "Your bike has a flat tire. Repair kit costs $8.",
                type: "expense",
                choices: [
                    { text: "Fix it (-$8)", effect: -8 },
                    { text: "Walk everywhere for now (free)", effect: 0 }
                ]
            },
            {
                id: "trendy_clothes",
                icon: "👕",
                title: "Fashion FOMO",
                description: "Everyone at school has the new trendy hoodie. It costs $35.",
                type: "fomo",
                choices: [
                    { text: "I NEED it! (-$35)", effect: -35 },
                    { text: "My clothes are fine", effect: 0 }
                ]
            },
            {
                id: "pet_food",
                icon: "🐱",
                title: "Pet Emergency",
                description: "Your pet is out of food! Emergency trip to the store: $18.",
                type: "expense",
                amount: -18,
                choices: null  // Mandatory
            },
            
            // Educational/Neutral events
            {
                id: "savings_tip",
                icon: "💡",
                title: "Money Tip!",
                description: "You read that people who write down their goals are more likely to reach them!",
                type: "tip",
                choices: [
                    { text: "Good to know!", effect: 0 }
                ]
            },
            {
                id: "compound_interest",
                icon: "📈",
                title: "Did You Know?",
                description: "If you save $100 at 7% per year, you'll have $200 in about 10 years—without adding anything! That's called 'compound growth.'",
                type: "tip",
                choices: [
                    { text: "Whoa, math is cool!", effect: 0 }
                ]
            },
            
            // Temptation events
            {
                id: "crypto_bro",
                icon: "🚀",
                title: "Hot Tip from a 'Friend'",
                description: "Someone online says 'MoonCoin is going to 10x! Get in NOW before it's too late!'",
                type: "temptation",
                choices: [
                    { text: "YOLO! Put in $20!", effect: "gamble", cost: 20, reward: 60, chance: 0.1 },
                    { text: "That sounds like a scam...", effect: 0 }
                ]
            },
            {
                id: "mystery_box_deal",
                icon: "✨",
                title: "AMAZING DEAL!!!",
                description: "LIMITED TIME: Mystery Box Bundle! Only $15! Could contain up to $100 worth of prizes!",
                type: "temptation",
                choices: [
                    { text: "Ooh, sparkly! (-$15)", effect: "gamble", cost: 15, reward: 30, chance: 0.15 },
                    { text: "I know this trick...", effect: 0 }
                ]
            }
        ],
        
        // Goals for flavor
        goals: {
            bike: { name: "New Bike", emoji: "🚲" },
            gaming: { name: "Gaming Setup", emoji: "🎮" },
            pet: { name: "Pet Supplies", emoji: "🐕" },
            trip: { name: "Theme Park Trip", emoji: "🎢" }
        }
    },
    
    // Lessons generated based on player behavior
    lessons: {
        shellySuccess: "Shelly the Turtle helped you grow your money slowly but surely. Boring can be beautiful!",
        shellyIgnored: "You didn't use Shelly much. Safe investments might seem boring, but they add up!",
        rocketLoss: "Rocket Rabbit was exciting, but you lost money. Big risks often mean big losses.",
        rocketWin: "You got lucky with Rocket Rabbit! Remember: this doesn't happen often. Don't expect it next time!",
        mysteryLoss: "The Mystery Box took your money. Those flashy animations are designed to hide bad odds.",
        mysteryIgnored: "Smart move avoiding Mystery Box! The excitement is a trick to hide the bad odds.",
        emergencyFund: "Having cash on hand saved you when unexpected expenses came up!",
        noEmergencyFund: "You ran low on cash when emergencies hit. Keeping some money 'boring' and available is smart!",
        fomoSpending: "You spent money on things because 'everyone else had them.' That's called FOMO—it's a powerful trick!",
        fomoResisted: "You resisted buying things just because everyone else had them. That takes real strength!",
        patience: "You waited patiently and let your investments grow. Time is the secret ingredient!",
        overtrading: "You moved your money around a lot. Sometimes the best move is to do nothing and wait."
    }
};

// Helper function to get a random event
GameData.getRandomEvent = function() {
    const events = this.junior.events;
    return events[Math.floor(Math.random() * events.length)];
};

// Helper function to calculate return for a character
GameData.calculateReturn = function(characterId, amount) {
    const char = this.junior.characters[characterId];
    const returns = char.returns;
    
    // Determine which tier we're in based on weights
    const roll = Math.random();
    let tier;
    if (roll < returns.weights[0]) {
        tier = 'low';
    } else if (roll < returns.weights[0] + returns.weights[1]) {
        tier = 'mid';
    } else {
        tier = 'high';
    }
    
    // Calculate return based on tier
    let returnRate;
    const range = returns.max - returns.min;
    
    switch(tier) {
        case 'low':
            // Bottom third of range
            returnRate = returns.min + (Math.random() * range * 0.33);
            break;
        case 'mid':
            // Middle third of range
            returnRate = returns.min + (range * 0.33) + (Math.random() * range * 0.34);
            break;
        case 'high':
            // Top third of range
            returnRate = returns.min + (range * 0.67) + (Math.random() * range * 0.33);
            break;
    }
    
    const change = Math.round(amount * returnRate);
    return {
        rate: returnRate,
        change: change,
        newAmount: amount + change
    };
};
