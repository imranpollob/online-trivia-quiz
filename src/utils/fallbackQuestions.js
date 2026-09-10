/**
 * Curated offline fallback questions across diverse categories.
 * Ensures the quiz remains 100% playable even when OpenTDB is rate-limited or offline.
 */
export const FALLBACK_QUESTIONS = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Utility"
    ]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "Which primary color is created when you mix yellow and blue together?",
    correct_answer: "Green",
    incorrect_answers: ["Purple", "Orange", "Brown"]
  },
  {
    category: "Geography",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital city of Australia?",
    correct_answer: "Canberra",
    incorrect_answers: ["Sydney", "Melbourne", "Brisbane"]
  },
  {
    category: "Science & Nature",
    type: "multiple",
    difficulty: "easy",
    question: "What chemical element has the symbol 'O' on the periodic table?",
    correct_answer: "Oxygen",
    incorrect_answers: ["Osmium", "Gold", "Ozone"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "medium",
    question: "Which programming language was created by Brendan Eich in 1995?",
    correct_answer: "JavaScript",
    incorrect_answers: ["Python", "Ruby", "Java"]
  },
  {
    category: "History",
    type: "multiple",
    difficulty: "medium",
    question: "In which year did the Apollo 11 mission land the first humans on the Moon?",
    correct_answer: "1969",
    incorrect_answers: ["1965", "1971", "1973"]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "medium",
    question: "How many sides does a heptagon have?",
    correct_answer: "7",
    incorrect_answers: ["6", "8", "9"]
  },
  {
    category: "Science & Nature",
    type: "multiple",
    difficulty: "medium",
    question: "What is the hardest natural substance on Earth?",
    correct_answer: "Diamond",
    incorrect_answers: ["Graphene", "Titanium", "Quartz"]
  },
  {
    category: "Geography",
    type: "multiple",
    difficulty: "hard",
    question: "Which is the smallest independent state in the world by both area and population?",
    correct_answer: "Vatican City",
    incorrect_answers: ["Monaco", "Nauru", "San Marino"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "hard",
    question: "What year was the Git version control system initially released by Linus Torvalds?",
    correct_answer: "2005",
    incorrect_answers: ["2001", "2008", "1998"]
  },
  {
    category: "History",
    type: "multiple",
    difficulty: "hard",
    question: "Which ancient civilization constructed the city of Machu Picchu high in the Andes Mountains?",
    correct_answer: "Inca",
    incorrect_answers: ["Maya", "Aztec", "Olmec"]
  },
  {
    category: "General Knowledge",
    type: "boolean",
    difficulty: "easy",
    question: "The Great Wall of China is visible from the Moon without magnification.",
    correct_answer: "False",
    incorrect_answers: ["True"]
  },
  {
    category: "Science & Nature",
    type: "boolean",
    difficulty: "easy",
    question: "Sound travels faster in water than it does in air.",
    correct_answer: "True",
    incorrect_answers: ["False"]
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "medium",
    question: "HTTP status code 418 is officially designated as 'I'm a teapot'.",
    correct_answer: "True",
    incorrect_answers: ["False"]
  },
  {
    category: "Geography",
    type: "multiple",
    difficulty: "medium",
    question: "What is the longest river in South America?",
    correct_answer: "Amazon",
    incorrect_answers: ["Parana", "Orinoco", "Magdalena"]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the name of the artist who painted the famous portrait 'Mona Lisa'?",
    correct_answer: "Leonardo da Vinci",
    incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"]
  },
  {
    category: "Science & Nature",
    type: "multiple",
    difficulty: "medium",
    question: "Which planet in our solar system has the highest surface temperature?",
    correct_answer: "Venus",
    incorrect_answers: ["Mercury", "Mars", "Jupiter"]
  },
  {
    category: "History",
    type: "multiple",
    difficulty: "medium",
    question: "Who was the first President of the United States?",
    correct_answer: "George Washington",
    incorrect_answers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does 'RAM' stand for in computer hardware?",
    correct_answer: "Random Access Memory",
    incorrect_answers: ["Read Access Memory", "Rapid Action Module", "Run Active Memory"]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "hard",
    question: "What is the official currency of Japan?",
    correct_answer: "Yen",
    incorrect_answers: ["Won", "Yuan", "Ringgit"]
  }
];

export function getFallbackQuestions({ amount = 10, difficulty = '', category = '', type = '' } = {}) {
  let filtered = [...FALLBACK_QUESTIONS];

  if (category) {
    filtered = filtered.filter(q => q.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  if (type) {
    filtered = filtered.filter(q => q.type === type);
  }
  // If filter produces too few items, relax filter
  if (filtered.length < amount) {
    filtered = [...FALLBACK_QUESTIONS];
    if (type) {
      filtered = filtered.filter(q => q.type === type);
    }
  }

  // Shuffle
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(amount, shuffled.length));
}
