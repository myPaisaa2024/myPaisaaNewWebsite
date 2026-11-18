# Sharper "Why myPaisaa" for each profile (/v5 and /v6)

Rewrites how /v5 and /v6 answer "why myPaisaa?" for each visitor. Each profile (Save, Borrow, Invest, Just exploring) gets a clear, number-backed answer to why myPaisaa beats the alternatives for them.
The answer comes up at five planned moments in the story, so it is impossible to miss.

## Who it's for
- **Savers** weighing a bank RD, an informal chit or a traditional chit company.
- **Borrowers** weighing a bank loan, an app or personal loan, or a traditional chit company.
- **Investors** weighing FDs, equity or mutual funds, or another chit company.
- **Explorers** who only know informal or traditional chits.
- **On /v6, each profession as well**: salaried, business owner, self-employed, other.

## Core features and experience

**1. One clear promise per profile**
Each profile gets one sentence that answers "why us", followed by three supporting reasons. Every reason carries a number or a fact from the brief. A fourth reason, the dividend record, is the same in every profile (see below).

| Profile | Promise | Three reasons |
|---|---|---|
| Save | "A savings habit that earns, with a registered safety net." | Dividends of up to 12% p.a. and the option to lift the pot early (vs an RD) · Full chit value deposited with the Registrar and listed on T-Chits (vs an informal chit) · 5% commission, below the 7% legal cap, and 2-minute app onboarding (vs a traditional chit company) |
| Borrow | "Funds without collateral, faster than a bank, cheaper than app loans." | No collateral, eKYC only (vs a bank loan) · Typical cost around 14–22% p.a. against 14–30% (vs an app or personal loan) · Up to 4 e-auctions a month and payout within 24 hours of completed documentation (vs a traditional chit company) |
| Invest | "Fixed-income style returns, no market exposure, better dividends." | Up to 12% p.a. from dividends (vs an FD) · Zero market exposure (vs equity or mutual funds) · 5% commission and a senior advisor for every ₹10 Lakh+ plan (vs another chit company) |
| Explore | "The chit your family trusted, now with a regulator and a receipt." | Registered under the Chit Funds Act, 1982, with the chit value deposited with the Registrar (vs an informal chit) · Every auction, bid and receipt visible in the app (vs a notebook) · One product to save or to borrow, with 3,00,000+ users and ₹1,200 Cr+ in auction turnover |

**Signature proof point in every profile: dividends**
- All four profiles get one more reason: the dividend record. It appears as a large number, **"150–170%"**, with the line: **"Our members' dividends: 150–170% of what comparable chit companies paid, on completed groups."** The footnote reads: "Completed groups vs comparable chit companies; data on file; past dividends don't guarantee future returns."
- The line under the number changes by profile:
  - **Save:** "More dividend each month means a lower instalment while you save."
  - **Borrow:** "After you win, dividends keep reducing the instalments you still pay."
  - **Invest:** "The core of your return, ahead of comparable chits."
  - **Explore:** "What you'd earn in the months you don't bid."
- Where it appears:
  - the Chapter 1 strip, as a fourth chip;
  - its own scorecard row ("Dividends on completed groups") in every profile;
  - the closing recap;
  - on /v6, beside the visitor's plan in the planner result.
- Each mention links to "Request group history".

**2. Where it shows up (5 moments per story)**
1. **Hook, Chapter 1:** a "Why myPaisaa" strip right under the headline. It shows the three reasons as short chips with their numbers, e.g. "5% vs 7% cap · 24-hr payout* · Registrar-deposited".
2. **New chapter, "Why myPaisaa, not ___":** placed right after the problem chapter. It leads with the promise in large type, then gives a scorecard: myPaisaa vs the two or three alternatives for that profile. There are 4–5 rows of ticks and short facts, and the myPaisaa column is highlighted. The stories grow from 9 to 10 chapters.
3. **Inside the planner result:** an "Only at myPaisaa" line worked out for the plan the visitor picked:
   - **Save:** "5% commission: ₹15,000 on your ₹3 Lakh chit — ₹6,000 below the 7% legal maximum."
   - **Borrow:** "This plan has 4 auctions a month: up to 4 chances to lift the pot."
   - **Invest:** "Across this ladder: dividends on completed groups ran at 150–170% of comparable chit companies'."
   - **Explore:** in the auction game: "Every bid you just saw is visible to all members in the app."
4. **Costs chapter:** the "5% vs 7% legal cap" figure is turned into rupees for the visitor's plan.
5. **Close:** a three-line recap, "Why myPaisaa for you", placed just above the callback form.

**3. /v6 adds a profession-specific reason**
The strip and the scorecard each gain one reason that matches the visitor's profession:
- **Business owner:** up to 4 auctions a month fit stock cycles, and chit losses can be claimed as business losses.
- **Salaried:** the instalment goes out by UPI every month with reminders, and nothing is collected in cash.
- **Self-employed:** surety requirements scale down, often to nothing, as you build a clean payment history.
- **Other:** no extra reason; the three standard ones apply.
- On /v6 the promise also addresses the visitor by name in the new chapter, e.g. "Priya, here's why myPaisaa."

**4. Proof that can be checked**
- Every reason links to its evidence: the T-Chits portal, the charges table, or a request for group history.
- Every qualified claim keeps the brief's wording and footnote: "up to", "within 24 hours of completed documentation", "on completed groups, data on file".

## User flow
1. The visitor picks a profile on /v5, or completes the welcome on /v6.
2. Chapter 1 shows the headline and, directly beneath it, the three reasons with numbers.
3. After the problem chapter, the "Why myPaisaa, not ___" chapter shows the promise and the scorecard.
4. The planner adds an "Only at myPaisaa" line for the chosen plan.
5. The costs chapter shows the commission saving in rupees.
6. The close repeats the three reasons, then the callback form appears.

## UI/UX feel
- The promise is set in large type in the profile's accent colour. The reasons appear as compact chips, each with a typewriter-style number.
- The scorecard is a clean comparison grid: a highlighted myPaisaa column and plain ticks or short facts for the alternatives. It avoids red crosses and attack language.
- "Only at myPaisaa" lines use a small badge style, so they read as a signature across chapters.
- The tone is calm and factual: no countdowns, no "best in India" superlatives and no claims that cannot be backed up.

## Implementation phases
- **Phase 1 (MVP, built now):**
  - The promise and three reasons per profile on /v5 and /v6.
  - The hook strip and the new "Why myPaisaa, not ___" chapter with its scorecard.
  - "Only at myPaisaa" lines in each planner result and the rupee commission figure in the costs chapter.
  - The recap at the close, with evidence links.
  - Profession-specific reasons on /v6.
  - Click tracking on the scorecard and evidence links.
- **Phase 2:**
  - Telugu versions of the promise, reasons and scorecard.
  - Any extra USPs the team supplies, such as ratings, awards or press.
  - Real member quotes placed beside each reason.
- **Phase 3:**
  - Testing two promise lines per profile against each other, measured by callback rate.
  - City-specific proof, such as members and groups in the visitor's city.

## Assumptions
- Applies to /v5 and /v6 only. The classic homepage, /v2, /v3 and /v4 stay unchanged.
- Comparisons name only generic alternatives (bank RD/FD, bank loan, app or personal loan, informal chit, traditional or comparable chit companies), never a brand.
- All USPs come from the brief only, as no extra USPs were supplied. Claims stay within its safe-claims wording.
- "5% vs 7%" is framed against the legal cap, not against any competitor's actual rate. The rupee saving is worked out as 2% of the chit value.
- The brief's "1.5–1.7x" is written as **"150–170% of"** comparable chit companies' dividends, not "150–170% higher than". "Higher than" would mean 2.5–2.7x, which overstates the brief's claim. If a "higher than" phrasing is wanted, the accurate version is "50–70% higher than".
- The dividend claim now appears in all four profiles, each time with its footnote: completed groups, data held on file, not a guarantee.
- The /v5 and /v6 stories grow from 9 to 10 chapters. The chapter rail and the "Chapter N of 10" label update to match.
- On /v5, the example characters stay. Where it fits naturally, the character's line also makes the "why" point.
- English only for this phase.
