/*
 * questions.js: all content for the "Am I exam-ready?" check.
 * Author: Astha Purohit
 *
 * Every question is a real-life situation an A1 learner will meet in Germany.
 * Each one has:
 *   why      : why this question is in the check (what it predicts about the exam)
 *   explain  : why the right answer is right (shown on the results screen)
 *   options  : 4 choices. Each wrong option has a `mistake`, the real error
 *              behind picking it. This makes a wrong answer diagnostic.
 *   topic    : the sub-topic it tests (links to TOPICS below)
 *
 * To change a question, edit it here. No other file needs to change.
 */

const SKILLS = {
  vocab:   { label: "Vocabulary" },
  grammar: { label: "Grammar" },
  reading: { label: "Reading" },
};

/*
 * weight = how often this topic shows up across the A1 exam (my estimate,
 * based on the Goethe A1 format). It decides which weak topics are
 * recommended first.
 * drill  = a concrete 10-minute practice task shown to the learner.
 */
const TOPICS = {
  numbers:    { label: "Numbers & prices", weight: 1.5,
    drill: "Say 20 prices out loud from a supermarket flyer (e.g. 3,50 € → drei Euro fünfzig). Focus on -zehn (13–19) vs -zig (20, 30…)." },
  time:       { label: "Telling the time", weight: 1.5,
    drill: "Set 10 random times on a clock app and say each one the German way: Viertel nach / Viertel vor / halb. Remember: halb neun = 8:30." },
  days:       { label: "Days & dates", weight: 1.2,
    drill: "Write next week's plan in German, one line per day (Am Montag…). Read it aloud until Montag/Mittwoch and Dienstag/Donnerstag feel automatic." },
  family:     { label: "Family & people", weight: 1.0,
    drill: "Draw your family tree and label everyone in German (Großmutter, Onkel, Cousine…). Then describe 5 people: Das ist mein/meine…" },
  places:     { label: "Shops, places & signs", weight: 1.0,
    drill: "Make 10 flashcards: one need → one place (headache → Apotheke, shampoo → Drogerie, bread → Bäckerei, train → Bahnhof)." },
  verbs:      { label: "Verb endings", weight: 1.3,
    drill: "Conjugate wohnen, lernen and arbeiten for ich/du/er/wir/ihr/sie. Then write one true sentence for each person." },
  sein:       { label: "sein & haben", weight: 1.2,
    drill: "Write 6 sentences with sein and 6 with haben, one for each person (ich bin, du bist… / ich habe, du hast…). Say them aloud twice." },
  accusative: { label: "Accusative articles (einen / den)", weight: 1.2,
    drill: "Answer 10 'Haben Sie…?' questions about yourself: Ich habe einen Bruder / eine Schwester / ein Auto. Only masculine words change: ein → einen." },
  wordorder:  { label: "Word order (verb in position 2)", weight: 1.3,
    drill: "Write 8 sentences that start with a time (Morgen, Am Samstag, Um 8 Uhr…). Check the verb is always the 2nd element: Morgen GEHE ich…" },
  separable:  { label: "Separable verbs", weight: 1.0,
    drill: "Describe your morning with aufstehen, einkaufen, anrufen and fernsehen: Ich stehe um 7 Uhr auf. The prefix goes to the end." },
  messages:   { label: "Reading short messages", weight: 1.3,
    drill: "Read 3 short German emails or WhatsApp-style texts (from a Goethe A1 model test). For each one, write in one line: who, what, and why." },
  details:    { label: "Catching details (days, times, numbers)", weight: 1.5,
    drill: "When you read a text, underline every day, time and number first. Then answer the questions. Watch for 24-hour times: 15 Uhr = 3 pm." },
  signs:      { label: "Signs & opening hours", weight: 1.2,
    drill: "Find 5 photos of German shop or doctor signs online (search 'Öffnungszeiten'). For each one, decide: can I go on Tuesday at 4 pm?" },
  ads:        { label: "Short ads", weight: 1.2,
    drill: "Read 3 room or flat ads on a German site. Note the price (per month?), size (m²) and 2 adjectives (ruhig, hell…) for each." },
  negation:   { label: "nicht… sondern traps", weight: 1.0,
    drill: "Write 5 'nicht X, sondern Y' sentences and circle Y each time (Der Zug fährt nicht um 8, sondern um 9). The answer is almost always after sondern." },
};

/* kind decides how the text is drawn: chat bubble, door sign, paper ad or station display. */
const PASSAGES = {
  tom: {
    kind: "chat", from: "Tom", time: "18:42",
    title: "WhatsApp message from your friend Tom",
    text: "Hallo! Ich kann am Samstag leider nicht kommen. Ich muss arbeiten. 😕 Hast du am Sonntag Zeit? Wir können um 15 Uhr Kaffee trinken. Liebe Grüße, Tom",
  },
  doctor: {
    kind: "sign",
    title: "Sign on a doctor's door",
    text: "Praxis Dr. Weber\nSprechzeiten:\nMo – Fr  8 – 12 Uhr\nDi + Do  15 – 18 Uhr",
  },
  room: {
    kind: "ad",
    title: "Ad on a notice board",
    text: "Zimmer frei! 20 m², ruhig, nah am Bahnhof. 350 € im Monat. Tel. 0176 2234 5590",
  },
  train: {
    kind: "display",
    title: "Display at the train station",
    text: "Information: Der Zug nach München fährt heute nicht von Gleis 3, sondern von Gleis 5.",
  },
};

const QUESTIONS = [
  // ---------------- VOCABULARY ----------------
  {
    id: "V1", skill: "vocab", topic: "numbers",
    scenario: "You're paying at a bakery in Berlin. The screen shows 3,50 €.",
    prompt: "What does the cashier say?",
    options: [
      { text: "drei Euro fünfzig", correct: true },
      { text: "dreißig Euro fünf", mistake: "Mixed up drei (3) and dreißig (30)." },
      { text: "drei Euro fünfzehn", mistake: "Mixed up fünfzehn (15) and fünfzig (50): -zehn vs -zig." },
      { text: "dreizehn Euro fünfzig", mistake: "Mixed up drei (3) and dreizehn (13)." },
    ],
    why: "Prices and numbers appear in almost every A1 listening and reading task. -zehn vs -zig is the most common number mistake.",
    explain: "3,50 € is drei Euro fünfzig. -zig means tens (fünfzig = 50). -zehn means teens (fünfzehn = 15).",
  },
  {
    id: "V2", skill: "vocab", topic: "time",
    scenario: "Your colleague texts you: \"Das Meeting ist um Viertel nach acht.\"",
    prompt: "When do you need to be there?",
    options: [
      { text: "8:15", correct: true },
      { text: "7:45", mistake: "Confused nach (past) with vor (to). 7:45 is Viertel vor acht." },
      { text: "8:45", mistake: "8:45 is Viertel vor neun. Nach means 'past' the hour." },
      { text: "8:30", mistake: "Confused Viertel (quarter) with halb. And careful: 8:30 is halb neun, not halb acht." },
    ],
    why: "Appointment times are tested in listening and reading. German time phrases don't map 1:1 to English, so learners who 'translate' lose easy points.",
    explain: "Viertel nach acht = a quarter past eight = 8:15.",
  },
  {
    id: "V3", skill: "vocab", topic: "days",
    scenario: "Your new landlord writes: \"Bitte zahlen Sie die Miete bis Mittwoch.\"",
    prompt: "By which day must you pay the rent?",
    options: [
      { text: "Wednesday", correct: true },
      { text: "Monday", mistake: "Confused Mittwoch with Montag. Both start with M." },
      { text: "Thursday", mistake: "Guessed a mid-week day. Thursday is Donnerstag." },
      { text: "Tuesday", mistake: "Guessed a mid-week day. Tuesday is Dienstag." },
    ],
    why: "Days and deadlines come up in messages, appointments and announcements. Mixing up Mittwoch and Montag means missing the key detail of a task.",
    explain: "Mittwoch = Wednesday (literally 'mid-week'). Montag = Monday.",
  },
  {
    id: "V4", skill: "vocab", topic: "family",
    scenario: "At your visa interview, the officer points to a photo of your father's mother: \"Wer ist das?\"",
    prompt: "Das ist meine…",
    options: [
      { text: "Großmutter", correct: true },
      { text: "Tante", mistake: "Tante is an aunt (a parent's sister), not a grandparent." },
      { text: "Schwester", mistake: "Schwester is a sister." },
      { text: "Tochter", mistake: "Tochter is a daughter. Easy to confuse with Mutter at a glance." },
    ],
    why: "Talking about family is a standard A1 speaking and reading topic, and it's also real life for visa and family-reunion learners.",
    explain: "The mother of your father (or mother) is your Großmutter (Oma).",
  },
  {
    id: "V5", skill: "vocab", topic: "places",
    scenario: "It's Sunday in Munich and you have a bad headache.",
    prompt: "Which sign do you look for to buy medicine?",
    options: [
      { text: "Apotheke", correct: true },
      { text: "Drogerie", mistake: "False friend! A Drogerie sounds like 'drugstore' but sells shampoo and cosmetics, not medicine." },
      { text: "Bäckerei", mistake: "Bäckerei is a bakery." },
      { text: "Bahnhof", mistake: "Bahnhof is a train station." },
    ],
    why: "A1 reading tests signs and everyday places. Drogerie vs Apotheke is a classic false-friend trap.",
    explain: "Medicine is only sold at the Apotheke (pharmacy). Drogerie = toiletries and cosmetics.",
  },

  // ---------------- GRAMMAR ----------------
  {
    id: "G1", skill: "grammar", topic: "verbs",
    scenario: "At a language café you introduce yourself and your flatmate.",
    prompt: "\"Wir ___ in Pune.\"",
    options: [
      { text: "wohnen", correct: true },
      { text: "wohnt", mistake: "-t is the ending for er/sie/es or ihr, not wir." },
      { text: "wohne", mistake: "-e is the ending for ich." },
      { text: "wohnst", mistake: "-st is the ending for du." },
    ],
    why: "The A1 speaking exam starts with introducing yourself. Every sentence needs the right verb ending, and examiners notice when it's wrong.",
    explain: "wir → verb + -en: wir wohnen (same as the infinitive).",
  },
  {
    id: "G2", skill: "grammar", topic: "sein",
    scenario: "You write a thank-you message to your host family.",
    prompt: "\"Danke für alles! Du ___ sehr nett.\"",
    options: [
      { text: "bist", correct: true },
      { text: "ist", mistake: "ist is for er/sie/es, not du." },
      { text: "bin", mistake: "bin is for ich." },
      { text: "seid", mistake: "seid is for ihr (you all)." },
    ],
    why: "sein (to be) is irregular and the most-used verb in A1 writing and speaking. If it's shaky, almost every sentence is shaky.",
    explain: "ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
  },
  {
    id: "G3", skill: "grammar", topic: "accusative",
    scenario: "The visa officer asks: \"Haben Sie Geschwister?\"",
    prompt: "\"Ja, ich habe ___ Bruder.\"",
    options: [
      { text: "einen", correct: true },
      { text: "ein", mistake: "Forgot the accusative. After haben, masculine ein becomes einen." },
      { text: "einem", mistake: "einem is dative (e.g. mit einem Bruder). haben takes the accusative." },
      { text: "eine", mistake: "eine is feminine. Bruder is masculine (der Bruder)." },
    ],
    why: "The accusative is the first grammar topic that really trips A1 learners up, and it appears in almost every sentence with haben, möchten or kaufen.",
    explain: "der Bruder is masculine. After haben (accusative), ein → einen. Only masculine nouns change.",
  },
  {
    id: "G4", skill: "grammar", topic: "wordorder",
    scenario: "You're texting a friend about your weekend plans.",
    prompt: "Which sentence is correct?",
    options: [
      { text: "Am Samstag gehe ich ins Kino.", correct: true },
      { text: "Am Samstag ich gehe ins Kino.", mistake: "English word order. In German the verb must be in position 2, right after 'Am Samstag'." },
      { text: "Am Samstag ich ins Kino gehe.", mistake: "Verb at the end is only for side clauses (weil, dass…)." },
      { text: "Gehe am Samstag ich ins Kino.", mistake: "Verb first makes it sound like a question or a command." },
    ],
    why: "The A1 writing task (a short message) and the speaking test are full of sentences that start with a time. A wrong verb position is the most visible grammar error.",
    explain: "Verb-second rule: whatever comes first (Am Samstag), the verb comes next (gehe), then the subject (ich).",
  },
  {
    id: "G5", skill: "grammar", topic: "separable",
    scenario: "Your teacher asks about your routine: \"Wann stehen Sie auf?\"",
    prompt: "\"Ich ___ um 7 Uhr ___.\"",
    options: [
      { text: "stehe … auf", correct: true },
      { text: "aufstehe … (nothing)", mistake: "Didn't split the verb. In a main clause, the prefix auf goes to the end." },
      { text: "auf … stehe", mistake: "Reversed: the verb goes in position 2 and the prefix at the end." },
      { text: "stehe … an", mistake: "Wrong prefix: anstehen means to queue, not to get up." },
    ],
    why: "Daily-routine questions are standard in A1 speaking, and most routine verbs (aufstehen, einkaufen, anrufen) are separable.",
    explain: "aufstehen splits: Ich stehe (position 2) … auf (end).",
  },

  // ---------------- READING ----------------
  {
    id: "R1", skill: "reading", topic: "messages", passage: "tom",
    scenario: "Read Tom's message.",
    prompt: "Why can't Tom come on Saturday?",
    options: [
      { text: "He has to work.", correct: true },
      { text: "He is sick.", mistake: "Not in the text. Answer only from what's written." },
      { text: "He has no time on Sunday.", mistake: "Reversed: Tom is asking if YOU have time on Sunday." },
      { text: "He has to study.", mistake: "Guessed from 'muss'. The text says arbeiten (work), not lernen." },
    ],
    why: "A1 Reading Part 1 is short personal messages. Learners need to find the reason or main point, not translate every word.",
    explain: "\"Ich muss arbeiten\" = I have to work.",
  },
  {
    id: "R2", skill: "reading", topic: "details", passage: "tom",
    scenario: "Read Tom's message again.",
    prompt: "What does Tom suggest?",
    options: [
      { text: "Coffee on Sunday at 3 pm", correct: true },
      { text: "Coffee on Saturday at 3 pm", mistake: "Grabbed the first day you saw. Saturday is the day he CAN'T come." },
      { text: "Coffee on Sunday at 5 pm", mistake: "24-hour clock: 15 Uhr = 3 pm, not 5 pm." },
      { text: "Lunch on Sunday at 3 pm", mistake: "Kaffee trinken = drinking coffee, not lunch (Mittagessen)." },
    ],
    why: "Exam answer options are built to differ in one detail (day, time or activity). This tests careful reading, which separates a pass from a fail.",
    explain: "\"Am Sonntag … um 15 Uhr Kaffee trinken\" = Sunday, 3 pm, coffee.",
  },
  {
    id: "R3", skill: "reading", topic: "signs", passage: "doctor",
    scenario: "You have a fever. You finish work at 15:30 on Thursday.",
    prompt: "Can you see Dr. Weber at 16:00 on Thursday?",
    options: [
      { text: "Yes", correct: true },
      { text: "No, only in the mornings", mistake: "Missed the second line: Di + Do (Tue and Thu) also 15–18 Uhr." },
      { text: "No, the practice is closed on Thursdays", mistake: "Mo–Fr includes Thursday, and Do = Donnerstag." },
      { text: "Only on Tuesday afternoon", mistake: "Di + Do means Tuesday AND Thursday." },
    ],
    why: "A1 Reading Part 3 is signs and notices. Opening hours with abbreviations (Mo, Di, Do) are a favourite.",
    explain: "Di + Do 15–18 Uhr means Tuesday and Thursday afternoons, 3–6 pm. 16:00 fits.",
  },
  {
    id: "R4", skill: "reading", topic: "ads", passage: "room",
    scenario: "You're looking for a room before you move to Germany.",
    prompt: "Which is true about this room?",
    options: [
      { text: "It is near the train station.", correct: true },
      { text: "It costs 350 € per week.", mistake: "im Monat = per month." },
      { text: "It is loud.", mistake: "ruhig means quiet, the opposite." },
      { text: "It is 35 m².", mistake: "Mixed up the numbers: it's 20 m² (35 comes from the price)." },
    ],
    why: "A1 Reading Part 2 is ads and short notices. It tests whether you can pull price, size and key adjectives from a dense text.",
    explain: "nah am Bahnhof = near the train station.",
  },
  {
    id: "R5", skill: "reading", topic: "negation", passage: "train",
    scenario: "You need to take the train to Munich.",
    prompt: "Where do you go?",
    options: [
      { text: "Platform (Gleis) 5", correct: true },
      { text: "Platform (Gleis) 3", mistake: "Stopped reading at the first number. 'nicht von Gleis 3' means NOT platform 3." },
      { text: "The information desk", mistake: "'Information' is just the heading of the notice." },
      { text: "Nowhere, there's no train today", mistake: "'nicht' applies to Gleis 3, not to the train. The train still runs." },
    ],
    why: "'nicht … sondern' sentences are a classic exam trap: the first number you see is the wrong answer. Missing this costs points in reading and listening.",
    explain: "nicht von Gleis 3, sondern von Gleis 5 = not from platform 3 but from platform 5.",
  },
];

if (typeof module !== "undefined") module.exports = { SKILLS, TOPICS, PASSAGES, QUESTIONS };
