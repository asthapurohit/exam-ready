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
 * QUESTION BANK: there are 15 question "slots" (V1–V5, G1–G5, R1–R5), and each
 * slot has 3 versions (a, b, c) that test the same topic in a different real
 * situation. Each attempt picks one version per slot (see picker.js), so a
 * retake 2–3 weeks later tests the learner again instead of their memory.
 *   slot    : which of the 15 positions this question fills
 *   variant : a, b or c
 *   set     : questions that share a reading text are picked together
 *             (R1 + R2 both use the same message, so they share set "MSG")
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
    drill: "Write next week's plan in German, one line per day (Am Montag…). Read it aloud until Montag/Mittwoch and Dienstag/Donnerstag feel automatic. Then do the same with months: Juni vs Juli, März vs Mai." },
  family:     { label: "Family & people", weight: 1.0,
    drill: "Draw your family tree and label everyone in German (Großmutter, Onkel, Cousine…). Then describe 5 people: Das ist mein/meine…" },
  places:     { label: "Shops, places & signs", weight: 1.0,
    drill: "Make 10 flashcards: one need → one place (headache → Apotheke, shampoo → Drogerie, bread → Bäckerei). Add the sign words learners get wrong: Ziehen = pull, Drücken = push, Gift = poison." },
  verbs:      { label: "Verb endings", weight: 1.3,
    drill: "Conjugate wohnen, lernen and arbeiten for ich/du/er/wir/ihr/sie. Then write one true sentence for each person." },
  sein:       { label: "sein & haben", weight: 1.2,
    drill: "Write 6 sentences with sein and 6 with haben, one for each person (ich bin, du bist… / ich habe, du hast…). Say them aloud twice." },
  accusative: { label: "Accusative articles (einen / den)", weight: 1.2,
    drill: "Answer 10 'Haben Sie…?' questions about yourself: Ich habe einen Bruder / eine Schwester / ein Auto. Only masculine words change: ein → einen, der → den (Ich nehme den Zug)." },
  wordorder:  { label: "Word order (verb in position 2)", weight: 1.3,
    drill: "Write 8 sentences that start with a time (Morgen, Am Samstag, Um 8 Uhr…). Check the verb is always the 2nd element: Morgen GEHE ich…" },
  separable:  { label: "Separable verbs", weight: 1.0,
    drill: "Describe your morning with aufstehen, einkaufen, anrufen and fernsehen: Ich stehe um 7 Uhr auf. The prefix goes to the end." },
  messages:   { label: "Reading short messages", weight: 1.3,
    drill: "Read 3 short German emails or WhatsApp-style texts (from a Goethe A1 model test). For each one, write in one line: who, what, and why." },
  details:    { label: "Catching details (days, times, numbers)", weight: 1.5,
    drill: "When you read a text, underline every day, time and number first. Then answer the questions. Watch for 24-hour times: 15 Uhr = 3 pm." },
  signs:      { label: "Signs & opening hours", weight: 1.2,
    drill: "Find 5 photos of German shop or doctor signs online (search 'Öffnungszeiten'). For each one, decide: can I go on Tuesday at 4 pm? Learn the short forms: Mo Di Mi Do Fr Sa So." },
  ads:        { label: "Short ads", weight: 1.2,
    drill: "Read 3 short ads (rooms, jobs, things for sale) on a German site. For each one, note the price (per month? per hour?), the key facts and who does what (Abholung = you collect it)." },
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
  // ----- version b and c reading texts -----
  anna: {
    kind: "chat", from: "Anna (Deutschkurs)", time: "21:05",
    title: "WhatsApp message from Anna, your German teacher",
    text: "Hallo Priya! Morgen ist unser Kurs leider nicht in Raum 4. Wir sind in Raum 12. Der Kurs beginnt wie immer um 18 Uhr. Bitte bring dein Buch mit! Viele Grüße, Anna",
  },
  maria: {
    kind: "chat", from: "Maria (host family)", time: "16:20",
    title: "WhatsApp message from Maria, your host mother",
    text: "Hallo! Ich bin gerade im Supermarkt. Brauchst du etwas? Wir essen heute um 19 Uhr. Papa kommt erst um 20 Uhr nach Hause. Bis später, Maria",
  },
  bakery: {
    kind: "sign",
    title: "Sign on a bakery door",
    text: "Bäckerei Schmidt\nÖffnungszeiten:\nMo – Sa  6 – 18 Uhr\nSo  7 – 11 Uhr",
  },
  office: {
    kind: "sign",
    title: "Sign at the foreigners' office (Ausländerbehörde)",
    text: "Ausländerbehörde\nÖffnungszeiten:\nMo, Di, Fr  8 – 12 Uhr\nDo  14 – 18 Uhr\nMi  geschlossen",
  },
  babysitter: {
    kind: "ad",
    title: "Ad on a supermarket notice board",
    text: "Babysitter gesucht! 2 Kinder (4 und 7 Jahre). Dienstag und Donnerstag, 15 – 18 Uhr. 12 € pro Stunde. Deutsch A1 reicht! Tel. 0151 4478 2201",
  },
  bike: {
    kind: "ad",
    title: "Ad on a university notice board",
    text: "Fahrrad zu verkaufen! 3 Jahre alt, sehr gut. Nur 90 €. Abholung in Köln-Mitte. Tel. 0162 9013 3374",
  },
  bus: {
    kind: "display",
    title: "Display at the bus stop",
    text: "Information: Die Linie 7 fährt heute nicht bis zum Marktplatz, sondern nur bis zum Rathaus.",
  },
  exam: {
    kind: "sign",
    title: "Notice at the language school",
    text: "Goethe-Prüfung A1\nDie Prüfung ist nicht am Montag, sondern am Dienstag um 9 Uhr.\nBitte kommen Sie nicht zu spät!",
  },
};

const QUESTION_BANK = [
  // ---------------- VOCABULARY ----------------
  {
    id: "V1a", slot: "V1", variant: "a", set: "V1", skill: "vocab", topic: "numbers",
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
    id: "V2a", slot: "V2", variant: "a", set: "V2", skill: "vocab", topic: "time",
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
    id: "V3a", slot: "V3", variant: "a", set: "V3", skill: "vocab", topic: "days",
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
    id: "V4a", slot: "V4", variant: "a", set: "V4", skill: "vocab", topic: "family",
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
    id: "V5a", slot: "V5", variant: "a", set: "V5", skill: "vocab", topic: "places",
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
    id: "G1a", slot: "G1", variant: "a", set: "G1", skill: "grammar", topic: "verbs",
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
    id: "G2a", slot: "G2", variant: "a", set: "G2", skill: "grammar", topic: "sein",
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
    id: "G3a", slot: "G3", variant: "a", set: "G3", skill: "grammar", topic: "accusative",
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
    id: "G4a", slot: "G4", variant: "a", set: "G4", skill: "grammar", topic: "wordorder",
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
    id: "G5a", slot: "G5", variant: "a", set: "G5", skill: "grammar", topic: "separable",
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
    id: "R1a", slot: "R1", variant: "a", set: "MSG", skill: "reading", topic: "messages", passage: "tom",
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
    id: "R2a", slot: "R2", variant: "a", set: "MSG", skill: "reading", topic: "details", passage: "tom",
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
    id: "R3a", slot: "R3", variant: "a", set: "R3", skill: "reading", topic: "signs", passage: "doctor",
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
    id: "R4a", slot: "R4", variant: "a", set: "R4", skill: "reading", topic: "ads", passage: "room",
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
    id: "R5a", slot: "R5", variant: "a", set: "R5", skill: "reading", topic: "negation", passage: "train",
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

  // ================= VERSION B =================
  {
    id: "V1b", slot: "V1", variant: "b", set: "V1", skill: "vocab", topic: "numbers",
    scenario: "At a supermarket in Hamburg, the cashier says: \"Das macht siebzehn Euro achtzig.\"",
    prompt: "What does the screen show?",
    options: [
      { text: "17,80 €", correct: true },
      { text: "70,80 €", mistake: "Mixed up siebzehn (17) and siebzig (70): -zehn vs -zig." },
      { text: "17,18 €", mistake: "Mixed up achtzig (80) and achtzehn (18): -zig vs -zehn." },
      { text: "7,80 €", mistake: "Heard sieben (7) and missed the -zehn." },
    ],
    why: "Hearing a price and matching it to what you see is a standard A1 task. -zehn vs -zig is the most common number mistake.",
    explain: "siebzehn = 17 and achtzig = 80, so it's 17,80 €.",
  },
  {
    id: "V2b", slot: "V2", variant: "b", set: "V2", skill: "vocab", topic: "time",
    scenario: "The doctor's receptionist tells you: \"Ihr Termin ist um halb zehn.\"",
    prompt: "When is your appointment?",
    options: [
      { text: "9:30", correct: true },
      { text: "10:30", mistake: "English trap: 'half ten' means 10:30, but German halb zehn means half an hour BEFORE ten." },
      { text: "9:15", mistake: "Confused halb (half) with Viertel (quarter)." },
      { text: "10:00", mistake: "Ignored halb. 10:00 is zehn Uhr." },
    ],
    why: "halb + hour is the time expression Indian and English-speaking learners get wrong most often. Missing an appointment by an hour is a real-life cost too.",
    explain: "halb zehn = half way to ten = 9:30.",
  },
  {
    id: "V3b", slot: "V3", variant: "b", set: "V3", skill: "vocab", topic: "days",
    scenario: "Your new German course sends an email: \"Der Unterricht ist am Donnerstag.\"",
    prompt: "Which day is the class?",
    options: [
      { text: "Thursday", correct: true },
      { text: "Tuesday", mistake: "Confused Donnerstag with Dienstag. Both start with D." },
      { text: "Wednesday", mistake: "Guessed a mid-week day. Wednesday is Mittwoch." },
      { text: "Sunday", mistake: "Sunday is Sonntag. Donner means thunder, not Sonne (sun)." },
    ],
    why: "Days come up in messages, appointments and announcements. Dienstag vs Donnerstag is the most common mix-up.",
    explain: "Donnerstag = Thursday. Dienstag = Tuesday.",
  },
  {
    id: "V4b", slot: "V4", variant: "b", set: "V4", skill: "vocab", topic: "family",
    scenario: "You're filling in a form for your family visa. One box says: \"Name des Ehemanns\".",
    prompt: "Whose name do you write?",
    options: [
      { text: "Your husband's", correct: true },
      { text: "Your brother's", mistake: "Brother is Bruder. Ehe means marriage, so Ehemann is husband." },
      { text: "Your son's", mistake: "Son is Sohn." },
      { text: "Your father-in-law's", mistake: "Father-in-law is Schwiegervater." },
    ],
    why: "Family words come up in A1 reading and speaking, and on real forms that Globio's visa and family-reunion learners will fill in.",
    explain: "Ehemann = husband (Ehe = marriage, Mann = man). Ehefrau = wife.",
  },
  {
    id: "V5b", slot: "V5", variant: "b", set: "V5", skill: "vocab", topic: "places",
    scenario: "You want to go into a small shop. The sign on the door says \"Ziehen\".",
    prompt: "What do you do?",
    options: [
      { text: "Pull the door", correct: true },
      { text: "Push the door", mistake: "Push is Drücken. Ziehen means pull." },
      { text: "Come back later, it's closed", mistake: "Closed is Geschlossen." },
      { text: "Ring the bell", mistake: "Ring the bell is Klingeln (Bitte klingeln)." },
    ],
    why: "A1 reading tests short signs in everyday places. Ziehen and Drücken are on almost every door in Germany.",
    explain: "Ziehen = pull. Drücken = push.",
  },
  {
    id: "G1b", slot: "G1", variant: "b", set: "G1", skill: "grammar", topic: "verbs",
    scenario: "You introduce a classmate at your new course.",
    prompt: "\"Das ist Priya. Sie ___ Deutsch.\"",
    options: [
      { text: "lernt", correct: true },
      { text: "lernen", mistake: "Here sie means 'she' (one person: Priya), so it takes -t. lernen is for sie = they." },
      { text: "lernst", mistake: "-st is the ending for du." },
      { text: "lerne", mistake: "-e is the ending for ich." },
    ],
    why: "Talking about other people is part of the A1 speaking test. sie (she) vs sie (they) is a classic trap, because only the verb ending tells them apart.",
    explain: "sie = she → verb + -t: sie lernt. sie = they → sie lernen.",
  },
  {
    id: "G2b", slot: "G2", variant: "b", set: "G2", skill: "grammar", topic: "sein",
    scenario: "You're at the doctor's. You want to say you have a headache.",
    prompt: "\"Ich ___ Kopfschmerzen.\"",
    options: [
      { text: "habe", correct: true },
      { text: "bin", mistake: "In German you HAVE pain (haben), you aren't pain. Think 'I have a headache'." },
      { text: "hast", mistake: "hast is for du." },
      { text: "hat", mistake: "hat is for er/sie/es." },
    ],
    why: "haben and sein carry most A1 sentences. Choosing the wrong one makes simple sentences, like at the doctor's, sound wrong.",
    explain: "ich habe, du hast, er/sie/es hat. Pain goes with haben: Ich habe Kopfschmerzen.",
  },
  {
    id: "G3b", slot: "G3", variant: "b", set: "G3", skill: "grammar", topic: "accusative",
    scenario: "You're ordering at a café in Munich.",
    prompt: "\"Ich möchte ___ Kaffee, bitte.\"",
    options: [
      { text: "einen", correct: true },
      { text: "ein", mistake: "Forgot the accusative. After möchten, masculine ein becomes einen." },
      { text: "eine", mistake: "eine is feminine. Kaffee is masculine (der Kaffee)." },
      { text: "einem", mistake: "einem is dative (e.g. mit einem Freund). möchten takes the accusative." },
    ],
    why: "Ordering food and drinks is a core A1 situation, and almost every order uses the accusative.",
    explain: "der Kaffee is masculine. After möchten (accusative), ein → einen.",
  },
  {
    id: "G4b", slot: "G4", variant: "b", set: "G4", skill: "grammar", topic: "wordorder",
    scenario: "Your friend asks you to meet. You text back.",
    prompt: "Which sentence is correct?",
    options: [
      { text: "Heute habe ich keine Zeit.", correct: true },
      { text: "Heute ich habe keine Zeit.", mistake: "English word order. The verb must come right after 'Heute'." },
      { text: "Heute ich keine Zeit habe.", mistake: "Verb at the end is only for side clauses (weil, dass…)." },
      { text: "Habe heute ich keine Zeit.", mistake: "Verb first makes it sound like a question." },
    ],
    why: "The A1 writing task is a short message, and most messages start with a time word. Wrong verb position is the most visible error.",
    explain: "Verb-second rule: Heute (1) habe (2) ich (3).",
  },
  {
    id: "G5b", slot: "G5", variant: "b", set: "G5", skill: "grammar", topic: "separable",
    scenario: "Your flatmate asks about your weekend plans.",
    prompt: "\"Am Samstag ___ ich im Supermarkt ___.\"",
    options: [
      { text: "kaufe … ein", correct: true },
      { text: "einkaufe … (nothing)", mistake: "Didn't split the verb. In a main clause, ein goes to the end." },
      { text: "ein … kaufe", mistake: "Reversed: verb in position 2, prefix at the end." },
      { text: "kaufe … auf", mistake: "Wrong prefix: aufkaufen means to buy up everything." },
    ],
    why: "Weekend plans and daily routines are standard A1 speaking topics, and einkaufen is one of the most-used separable verbs.",
    explain: "einkaufen splits: Ich kaufe (position 2) … ein (end).",
  },
  {
    id: "R1b", slot: "R1", variant: "b", set: "MSG", skill: "reading", topic: "messages", passage: "anna",
    scenario: "Read Anna's message.",
    prompt: "What is different about tomorrow's class?",
    options: [
      { text: "It's in a different room.", correct: true },
      { text: "It starts later.", mistake: "The text says wie immer um 18 Uhr: as always, at 6 pm." },
      { text: "It's cancelled.", mistake: "'nicht' is about Raum 4, not the class. The class still happens." },
      { text: "It's online.", mistake: "Not in the text. Answer only from what's written." },
    ],
    why: "A1 Reading Part 1 is short personal messages. The skill is finding what changed, not translating every word.",
    explain: "\"nicht in Raum 4. Wir sind in Raum 12\" = the room has changed.",
  },
  {
    id: "R2b", slot: "R2", variant: "b", set: "MSG", skill: "reading", topic: "details", passage: "anna",
    scenario: "Read Anna's message again.",
    prompt: "Where and when is the class?",
    options: [
      { text: "Room 12 at 6 pm", correct: true },
      { text: "Room 4 at 6 pm", mistake: "Grabbed the first room you saw. Room 4 is where it's NOT." },
      { text: "Room 12 at 8 pm", mistake: "24-hour clock: 18 Uhr = 6 pm, not 8 pm." },
      { text: "Room 18 at 12", mistake: "Swapped the numbers: the room is 12 and the time is 18 Uhr." },
    ],
    why: "Exam options are built to differ in one detail. This tests careful reading of numbers, which separates a pass from a fail.",
    explain: "\"in Raum 12 … um 18 Uhr\" = Room 12, 6 pm.",
  },
  {
    id: "R3b", slot: "R3", variant: "b", set: "R3", skill: "reading", topic: "signs", passage: "bakery",
    scenario: "It's Sunday, 12:00, and you want fresh bread.",
    prompt: "Is the bakery open?",
    options: [
      { text: "No, on Sunday it closes at 11", correct: true },
      { text: "Yes, it's open until 18 Uhr", mistake: "6–18 Uhr is Mo–Sa (Monday to Saturday) only." },
      { text: "Yes, Sa means Sunday", mistake: "Sa = Samstag (Saturday). Sunday is So (Sonntag)." },
      { text: "No, it's closed all day on Sunday", mistake: "So 7–11 Uhr: it's open on Sunday morning." },
    ],
    why: "A1 Reading Part 3 is signs and notices. Opening hours with day abbreviations (Sa, So) are a favourite.",
    explain: "So 7–11 Uhr = Sunday 7–11 am. At 12:00 it's already closed.",
  },
  {
    id: "R4b", slot: "R4", variant: "b", set: "R4", skill: "reading", topic: "ads", passage: "babysitter",
    scenario: "You want a part-time job while you study in Germany.",
    prompt: "Which is true about this job?",
    options: [
      { text: "A1 German is enough.", correct: true },
      { text: "It pays 12 € per day.", mistake: "pro Stunde = per hour." },
      { text: "There are 7 children.", mistake: "2 Kinder: there are 2 children, aged 4 and 7." },
      { text: "It's every weekday.", mistake: "Dienstag und Donnerstag = only Tuesday and Thursday." },
    ],
    why: "A1 Reading Part 2 is ads and short notices. It tests pulling key facts (pay, days, requirements) from a dense text.",
    explain: "\"Deutsch A1 reicht!\" = A1 German is enough.",
  },
  {
    id: "R5b", slot: "R5", variant: "b", set: "R5", skill: "reading", topic: "negation", passage: "bus",
    scenario: "You need to get to the Marktplatz by bus.",
    prompt: "What's true today?",
    options: [
      { text: "Bus 7 stops at the Rathaus and doesn't reach the Marktplatz.", correct: true },
      { text: "Bus 7 goes to the Marktplatz as normal.", mistake: "Missed the 'nicht': it does NOT go to the Marktplatz today." },
      { text: "Bus 7 doesn't run today.", mistake: "'nicht' applies to the Marktplatz, not the bus. It still runs to the Rathaus." },
      { text: "Bus 7 only goes to the Marktplatz.", mistake: "Reversed: the part after 'sondern' (Rathaus) is where it goes." },
    ],
    why: "'nicht … sondern' is a classic exam trap: the first place you read is the wrong one.",
    explain: "nicht bis zum Marktplatz, sondern nur bis zum Rathaus = not to the Marktplatz, only to the Rathaus.",
  },

  // ================= VERSION C =================
  {
    id: "V1c", slot: "V1", variant: "c", set: "V1", skill: "vocab", topic: "numbers",
    scenario: "You're buying a train ticket. The machine says: \"Bitte zahlen Sie vierundzwanzig Euro.\"",
    prompt: "How much do you pay?",
    options: [
      { text: "24 €", correct: true },
      { text: "42 €", mistake: "German says the ones first: vier-und-zwanzig = 4 and 20 = 24. You read it in English order." },
      { text: "14 €", mistake: "14 is vierzehn." },
      { text: "40 €", mistake: "40 is vierzig. You missed the zwanzig." },
    ],
    why: "German numbers 21–99 are said 'backwards' (4-and-20). It's the number mistake that costs the most points in listening.",
    explain: "vierundzwanzig = vier (4) und (and) zwanzig (20) = 24.",
  },
  {
    id: "V2c", slot: "V2", variant: "c", set: "V2", skill: "vocab", topic: "time",
    scenario: "The cinema app says the film starts \"um Viertel vor sieben\".",
    prompt: "When does the film start?",
    options: [
      { text: "6:45", correct: true },
      { text: "7:15", mistake: "Confused vor (to) with nach (past). 7:15 is Viertel nach sieben." },
      { text: "7:45", mistake: "vor counts back from sieben: a quarter before 7:00 is 6:45." },
      { text: "6:15", mistake: "6:15 is Viertel nach sechs." },
    ],
    why: "Times are tested in listening and reading, and German time phrases don't map 1:1 to English.",
    explain: "Viertel vor sieben = a quarter to seven = 6:45.",
  },
  {
    id: "V3c", slot: "V3", variant: "c", set: "V3", skill: "vocab", topic: "days",
    scenario: "A landlord replies to you: \"Die Wohnung ist ab dem ersten Juni frei.\"",
    prompt: "From when can you move in?",
    options: [
      { text: "1 June", correct: true },
      { text: "1 July", mistake: "Confused Juni (June) and Juli (July). Germans often say 'Juno' and 'Julei' to keep them apart." },
      { text: "1 January", mistake: "January is Januar. It also starts with J, but it's a different month." },
      { text: "3 June", mistake: "ersten = first (1st). The 3rd is dritten." },
    ],
    why: "Dates appear in messages, ads and announcements. Juni vs Juli is the most common month mix-up, and the wrong month means a wrong move-in date.",
    explain: "ab dem ersten Juni = from 1 June.",
  },
  {
    id: "V4c", slot: "V4", variant: "c", set: "V4", skill: "vocab", topic: "family",
    scenario: "Your host shows you a photo: \"Das ist meine Schwester Lena. Paul ist ihr Sohn.\"",
    prompt: "Who is Paul to your host?",
    options: [
      { text: "Her Neffe (nephew)", correct: true },
      { text: "Her Sohn (son)", mistake: "Paul is Lena's son (ihr Sohn = her son, meaning Lena's), not your host's." },
      { text: "Her Bruder (brother)", mistake: "Bruder is brother. Paul is one generation younger." },
      { text: "Her Enkel (grandson)", mistake: "Enkel is a grandchild: the child of your own child." },
    ],
    why: "Describing family is a standard A1 topic. This also tests reading carefully who 'ihr' refers to.",
    explain: "The son of your sister is your Neffe (nephew).",
  },
  {
    id: "V5c", slot: "V5", variant: "c", set: "V5", skill: "vocab", topic: "places",
    scenario: "In your shared kitchen, a bottle under the sink has a label: \"Vorsicht: Gift!\"",
    prompt: "What does the label tell you?",
    options: [
      { text: "It's poison.", correct: true },
      { text: "It's a gift for someone.", mistake: "False friend! Gift means poison in German. A present is ein Geschenk." },
      { text: "It's free to use.", mistake: "Free (no cost) is kostenlos or gratis." },
      { text: "It's fragile.", mistake: "Fragile is zerbrechlich." },
    ],
    why: "A1 reading tests warning signs and labels. Gift is the most famous German false friend, and misreading it is dangerous.",
    explain: "Gift = poison. Vorsicht = careful.",
  },
  {
    id: "G1c", slot: "G1", variant: "c", set: "G1", skill: "grammar", topic: "verbs",
    scenario: "On the first day of class, you ask two classmates where they are from.",
    prompt: "\"Woher ___ ihr?\"",
    options: [
      { text: "kommt", correct: true },
      { text: "kommen", mistake: "-en is for wir and sie/Sie. ihr (you, plural) takes -t." },
      { text: "kommst", mistake: "-st is for du (one person)." },
      { text: "komme", mistake: "-e is for ich." },
    ],
    why: "Asking and answering 'Woher kommst du / kommt ihr?' is part of the A1 speaking test. The ihr form is the one learners forget.",
    explain: "ihr → verb + -t: ihr kommt.",
  },
  {
    id: "G2c", slot: "G2", variant: "c", set: "G2", skill: "grammar", topic: "sein",
    scenario: "You're telling your German teacher about your family.",
    prompt: "\"Meine Eltern ___ sehr nett.\"",
    options: [
      { text: "sind", correct: true },
      { text: "ist", mistake: "Eltern (parents) is plural, so it needs sind, not ist." },
      { text: "seid", mistake: "seid is for ihr (you, plural)." },
      { text: "bin", mistake: "bin is for ich." },
    ],
    why: "sein is the most-used verb in A1. Getting the plural form wrong is very noticeable in speaking and writing.",
    explain: "Eltern = they → sie sind: Meine Eltern sind sehr nett.",
  },
  {
    id: "G3c", slot: "G3", variant: "c", set: "G3", skill: "grammar", topic: "accusative",
    scenario: "You're at the ticket counter at the station.",
    prompt: "\"Ich nehme ___ Zug um 8 Uhr.\"",
    options: [
      { text: "den", correct: true },
      { text: "der", mistake: "Forgot the accusative. After nehmen, masculine der becomes den." },
      { text: "dem", mistake: "dem is dative (e.g. mit dem Zug). nehmen takes the accusative." },
      { text: "die", mistake: "die is feminine or plural. Zug is masculine (der Zug)." },
    ],
    why: "Accusative articles appear in almost every 'I take / I buy / I want' sentence in A1. der → den is the change learners miss.",
    explain: "der Zug is masculine. After nehmen (accusative), der → den.",
  },
  {
    id: "G4c", slot: "G4", variant: "c", set: "G4", skill: "grammar", topic: "wordorder",
    scenario: "You're lost and want to ask a stranger the way.",
    prompt: "Which question is correct?",
    options: [
      { text: "Wo ist der Bahnhof?", correct: true },
      { text: "Wo der Bahnhof ist?", mistake: "Verb at the end is only for side clauses (Wissen Sie, wo der Bahnhof ist?)." },
      { text: "Ist wo der Bahnhof?", mistake: "Verb first is only for yes/no questions (Ist das der Bahnhof?)." },
      { text: "Der Bahnhof wo ist?", mistake: "The question word (wo) must come first, then the verb." },
    ],
    why: "Asking questions is part of the A1 speaking test. W-questions follow the same verb-second rule as statements.",
    explain: "W-word (1) + verb (2): Wo ist der Bahnhof?",
  },
  {
    id: "G5c", slot: "G5", variant: "c", set: "G5", skill: "grammar", topic: "separable",
    scenario: "Your friend is busy now. You promise to phone tomorrow.",
    prompt: "\"Ich ___ dich morgen ___.\"",
    options: [
      { text: "rufe … an", correct: true },
      { text: "anrufe … (nothing)", mistake: "Didn't split the verb. In a main clause, an goes to the end." },
      { text: "an … rufe", mistake: "Reversed: verb in position 2, prefix at the end." },
      { text: "rufe … auf", mistake: "Wrong prefix: aufrufen means to call out a name (like at the doctor's)." },
    ],
    why: "anrufen comes up constantly in A1 messages and phone situations, and it's separable.",
    explain: "anrufen splits: Ich rufe (position 2) dich morgen an (end).",
  },
  {
    id: "R1c", slot: "R1", variant: "c", set: "MSG", skill: "reading", topic: "messages", passage: "maria",
    scenario: "Read Maria's message.",
    prompt: "Why is Maria writing to you?",
    options: [
      { text: "To ask if you need anything from the supermarket.", correct: true },
      { text: "To ask you to go to the supermarket.", mistake: "Reversed: Maria is at the supermarket herself." },
      { text: "To cancel dinner.", mistake: "Dinner is still on: Wir essen heute um 19 Uhr." },
      { text: "Because she is lost.", mistake: "Not in the text. Answer only from what's written." },
    ],
    why: "A1 Reading Part 1 is short personal messages. The skill is finding the purpose of the message.",
    explain: "\"Ich bin gerade im Supermarkt. Brauchst du etwas?\" = I'm at the supermarket. Do you need anything?",
  },
  {
    id: "R2c", slot: "R2", variant: "c", set: "MSG", skill: "reading", topic: "details", passage: "maria",
    scenario: "Read Maria's message again.",
    prompt: "When is dinner?",
    options: [
      { text: "7 pm", correct: true },
      { text: "8 pm", mistake: "20 Uhr is when Papa comes home, not when dinner is." },
      { text: "9 pm", mistake: "24-hour clock: 19 Uhr = 7 pm, not 9 pm." },
      { text: "7 pm, but only when Papa is home", mistake: "Papa comes later (erst um 20 Uhr). Dinner is still at 19 Uhr." },
    ],
    why: "Messages often contain two times or two days, and the exam asks about the one that matters. This tests careful reading.",
    explain: "\"Wir essen heute um 19 Uhr\" = we eat at 7 pm.",
  },
  {
    id: "R3c", slot: "R3", variant: "c", set: "R3", skill: "reading", topic: "signs", passage: "office",
    scenario: "You need to collect your residence permit at the foreigners' office.",
    prompt: "Which visit works?",
    options: [
      { text: "Thursday at 15:00", correct: true },
      { text: "Wednesday at 10:00", mistake: "Mi geschlossen = closed on Wednesday." },
      { text: "Thursday at 10:00", mistake: "Do (Thursday) is only open in the afternoon, 14–18 Uhr." },
      { text: "Friday at 14:00", mistake: "Fr is only open in the morning, 8–12 Uhr." },
    ],
    why: "A1 Reading Part 3 is signs and notices. Office hours with different times on different days are a classic task, and a real one for anyone moving to Germany.",
    explain: "Do 14–18 Uhr = Thursday 2–6 pm. 15:00 fits.",
  },
  {
    id: "R4c", slot: "R4", variant: "c", set: "R4", skill: "reading", topic: "ads", passage: "bike",
    scenario: "You want a cheap bike for your first months in Germany.",
    prompt: "Which is true about this bike?",
    options: [
      { text: "You have to collect it in Köln-Mitte.", correct: true },
      { text: "The bike is new.", mistake: "3 Jahre alt = 3 years old." },
      { text: "It costs 90 € per month.", mistake: "It's a one-time price. Nur 90 € = only 90 €." },
      { text: "The seller will deliver it to you.", mistake: "Abholung = pick-up: you collect it." },
    ],
    why: "A1 Reading Part 2 is ads. It tests pulling out price, condition and who does what.",
    explain: "Abholung in Köln-Mitte = pick-up in Köln-Mitte.",
  },
  {
    id: "R5c", slot: "R5", variant: "c", set: "R5", skill: "reading", topic: "negation", passage: "exam",
    scenario: "You're taking the Goethe A1 exam.",
    prompt: "When must you be there?",
    options: [
      { text: "Tuesday at 9:00", correct: true },
      { text: "Monday at 9:00", mistake: "Stopped reading at the first day. 'nicht am Montag' means NOT Monday." },
      { text: "Any time on Tuesday", mistake: "um 9 Uhr: it starts at 9:00, and 'nicht zu spät' means don't be late." },
      { text: "Tuesday, a bit after 9:00", mistake: "'Bitte kommen Sie nicht zu spät' = please don't be late." },
    ],
    why: "'nicht … sondern' is a classic exam trap, and here it's about the exam itself: missing it would cost a learner the whole fee.",
    explain: "nicht am Montag, sondern am Dienstag um 9 Uhr = not Monday but Tuesday at 9.",
  },
];

if (typeof module !== "undefined") module.exports = { SKILLS, TOPICS, PASSAGES, QUESTION_BANK };
