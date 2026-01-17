# The Long Game - Design Specification

## Overview

A financial literacy game that teaches kids about money, investing, risk, and life choices through experiential learning. Players build a character from childhood through adulthood, making decisions about skills, careers, and investments while being tempted by get-rich-quick schemes.

**Core Philosophy**: Kids learn by *experiencing* the mechanics of manipulation and compounding—not by being lectured. The game makes risky options genuinely tempting while the math quietly works against them.

---

## Two Modes

### Jr. Mode: "Piggy Bank Adventures"
- **Target Age**: 8-10
- **Aesthetic**: Bright, cartoony, friendly animal mascots
- **Duration**: 10 turns (~10-15 minutes)
- **Starting Money**: $100
- **Goal**: Save $500 for a specific reward

### Standard Mode: "The Long Game"
- **Target Age**: 11-15
- **Aesthetic**: Clean, modern fintech look
- **Duration**: 5 chapters, 10-15 turns each (~15 min per chapter)
- **Starting Money**: Scales by life stage
- **Goal**: Life milestones (car → apartment → house → financial independence)

---

## Jr. Mode - Detailed Design

### Investment Characters

| Character | Type | Behavior | Return Range |
|-----------|------|----------|--------------|
| **Shelly the Turtle** | Savings | Always gains small amount | +2-3%/turn |
| **Goldie the Goose** | Stocks | Usually grows, occasional dips | -10% to +15%/turn |
| **Rocket Rabbit** | Hot Tips | Wild swings, negative expected value | -80% to +200%/turn |
| **Mystery Box** | Loot Box | Exciting animation, usually disappointing | -90% to +50%/turn |

### Turn Structure
1. **Allocate**: Drag coins to characters
2. **Event**: Random life event (optional spending/earning)
3. **Results**: Animated outcomes
4. **Summary**: Progress toward goal

### Events (Examples)
- "Friend's birthday! Spend $15 on a gift?" (social pressure)
- "Found $5 on the ground!" (windfall)
- "Your phone screen cracked. Fix for $30?" (emergency)
- "Neighbor offers $20 to walk their dog" (opportunity)
- "Cool new game everyone's playing: $25" (FOMO)

### Win/Lose Conditions
- **Win**: Reach $500 goal
- **Lose**: Run out of money OR 10 turns pass without goal
- **Partial**: Show progress made, lessons learned

---

## Standard Mode - Detailed Design

### Life Stages (Chapters)

| Chapter | Age | Focus | Key Decisions |
|---------|-----|-------|---------------|
| 1: Middle School | 11-14 | Skill foundations | Time allocation, allowance management |
| 2: High School | 14-18 | Specialization | Jobs, skills, post-HS path |
| 3: Launch | 18-25 | Career start | Education, early career, first real money |
| 4: Building | 25-40 | Wealth building | Major purchases, family, career growth |
| 5: Compounding | 40-60 | Peak earning | Wealth accumulation, legacy |

### Skill System

| Skill | Unlocks | How Built |
|-------|---------|-----------|
| **Academics** | College, professional careers | Study, tutoring |
| **Technical** | Tech jobs, trades | Coding clubs, shop class |
| **Social** | Networking, sales, leadership | Clubs, teams, jobs |
| **Creative** | Arts careers, entrepreneurship | Projects, practice |
| **Hustle** | Side gigs, business | Small ventures |
| **Financial IQ** | Better returns, scam resistance | Research, this game |

### Investment Options (Standard Mode)

**Safe Tier**
- Savings Account: 2-3% guaranteed
- Bonds: 4-5% stable
- Index Fund: 8% average, -20% to +30% variance

**Growth Tier**
- Individual Stocks: Research-dependent
- Real Estate: Illiquid, steady growth
- Side Business: Skill-based

**Danger Tier**
- Crypto: Wild swings, no underlying value
- Sports Betting: Skill illusion
- Hot Tips: Social proof trap
- MLM: Costs money to join

### Career Paths

**College Required**
- Professional (Business, Law, Medicine)
- Technical (Engineering, CS)
- Creative (Design, Media)

**Trade School**
- Skilled Trades (Electrician, Plumber)
- Healthcare (Nursing, Technician)

**Entrepreneurship**
- Requires Hustle 3+ and another skill at 3+
- Highest variance path

**Direct Workforce**
- Immediate income, limited ceiling
- Can pivot to education later

---

## Core Mechanics

### The "Why Does This Have Value?" System
Every investment shows an explanation:
- Stocks: "You own part of a company that makes profit"
- Crypto: "Value exists only because others might pay more"

### FOMO Feed (Standard Mode)
Social posts showing cherry-picked wins:
- "Made $5000 on CoolCoin! 🚀"
- End-game reveal: "3 winners shown. 97 losers hidden."

### Life Events
Random events requiring cash:
- Tests emergency fund discipline
- Creates liquidity pressure
- Teaches opportunity cost

### Research Action
Spend time to reveal hidden info:
- Scam indicators
- True odds
- Company fundamentals

---

## Scoring & Leaderboards

### Dimensions Tracked
- **Wealth**: Net worth achieved
- **Security**: Emergency fund maintained
- **Wisdom**: Scams avoided
- **Efficiency**: Time to milestones

### Leaderboard Features
- Personal best tracking
- Family comparison mode
- Same-seed challenge runs

---

## Technical Architecture

### Stack
- Vanilla HTML/CSS/JavaScript
- No build step (GitHub Pages compatible)
- localStorage for save data

### File Structure
```
the-long-game/
├── index.html          # Main entry point
├── DESIGN.md           # This document
├── README.md           # Setup instructions
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── game.js         # Core game loop
│   ├── data.js         # Characters, events, configs
│   ├── ui.js           # DOM manipulation
│   ├── storage.js      # Save/load/leaderboard
│   └── animations.js   # Visual effects
└── assets/
    └── (images, sounds if added later)
```

### State Shape
```javascript
{
  mode: 'junior' | 'standard',
  turn: 1,
  money: 100,
  goal: 500,
  allocations: { shelly: 0, goldie: 0, rocket: 0, mystery: 0 },
  history: [],
  skills: { academics: 0, technical: 0, social: 0, creative: 0, hustle: 0, financialIQ: 0 },
  career: null,
  milestones: []
}
```

---

## Future Enhancements

### Phase 2
- Standard Mode full implementation
- Skill tree visualization
- Career branching narratives

### Phase 3
- Sound effects and music
- Achievement system
- Challenge scenarios ("Start in debt")

### Phase 4
- Multiplayer comparison mode
- Custom character creation
- Community leaderboards

---

## Design Principles

1. **Temptation must be real**: Risky options should look appealing
2. **Failure is teaching**: Losses trigger reflection, not punishment
3. **Math over morality**: Show why things fail, don't preach
4. **Autonomy-supportive**: Frame as "outsmarting the system"
5. **Compounding is felt**: Long-term choices visibly snowball
