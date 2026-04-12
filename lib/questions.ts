export type Question = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const questions: Question[] = [
  {
    id: 1,
    topic: "Mathematics",
    question: "If a + b = 10 and ab = 24, what is a² + b²?",
    options: ["52", "48", "60", "100"],
    answer: 0,
    explanation: "a² + b² = (a+b)² - 2ab = 100 - 48 = 52",
  },
  {
    id: 2,
    topic: "Mathematics",
    question: "The number of diagonals in a hexagon is:",
    options: ["6", "9", "12", "15"],
    answer: 1,
    explanation: "Diagonals = n(n-3)/2 = 6(3)/2 = 9",
  },
  {
    id: 3,
    topic: "Mathematics",
    question: "What is the value of sin(30°) + cos(60°)?",
    options: ["0", "1", "√3/2", "2"],
    answer: 1,
    explanation: "sin(30°) = 0.5, cos(60°) = 0.5, sum = 1",
  },
  {
    id: 4,
    topic: "Drawing",
    question: "Which drawing technique uses parallel lines to show shadow?",
    options: ["Stippling", "Hatching", "Blending", "Contour"],
    answer: 1,
    explanation: "Hatching uses parallel lines to indicate tone and shadow.",
  },
  {
    id: 5,
    topic: "Drawing",
    question: "The vanishing point in a perspective drawing is located on the:",
    options: ["Ground line", "Picture plane", "Horizon line", "Vertical axis"],
    answer: 2,
    explanation: "Vanishing points are always on the horizon line in perspective drawing.",
  },
  {
    id: 6,
    topic: "Aesthetic Sensitivity",
    question: "Which colour combination is considered complementary?",
    options: ["Red and Orange", "Blue and Green", "Red and Green", "Yellow and White"],
    answer: 2,
    explanation: "Complementary colours are opposite on the colour wheel; red and green are complementary.",
  },
  {
    id: 7,
    topic: "Aesthetic Sensitivity",
    question: "The Bauhaus school of design was founded in:",
    options: ["1900", "1919", "1925", "1932"],
    answer: 1,
    explanation: "Bauhaus was founded by Walter Gropius in Weimar, Germany in 1919.",
  },
  {
    id: 8,
    topic: "Architecture",
    question: "Which Indian architect designed the Lotus Temple in New Delhi?",
    options: ["Charles Correa", "B.V. Doshi", "Fariborz Sahba", "Raj Rewal"],
    answer: 2,
    explanation: "The Lotus Temple was designed by Iranian-Canadian architect Fariborz Sahba.",
  },
  {
    id: 9,
    topic: "Architecture",
    question: "The architectural style of the Taj Mahal is best described as:",
    options: ["Dravidian", "Mughal", "Rajput", "Indo-Gothic"],
    answer: 1,
    explanation: "The Taj Mahal exemplifies Mughal architecture, combining Persian, Islamic, and Indian styles.",
  },
  {
    id: 10,
    topic: "Mathematics",
    question: "A circle has circumference 44 cm. Its area (in cm²) is:",
    options: ["154", "121", "176", "132"],
    answer: 0,
    explanation: "2πr = 44 → r = 7. Area = πr² = 22/7 × 49 = 154 cm²",
  },
  {
    id: 11,
    topic: "Drawing",
    question: "Which medium is best suited for detailed architectural sketches?",
    options: ["Watercolour", "Charcoal", "Fine liner pen", "Pastel"],
    answer: 2,
    explanation: "Fine liner pens allow precise lines essential for architectural drawings.",
  },
  {
    id: 12,
    topic: "Aesthetic Sensitivity",
    question: "What is 'negative space' in design?",
    options: [
      "Space filled with dark colours",
      "Empty space around and between subjects",
      "Space below the horizon line",
      "Space occupied by shadows",
    ],
    answer: 1,
    explanation: "Negative space is the empty area around and between the subjects of an image.",
  },
  {
    id: 13,
    topic: "Architecture",
    question: "The Golden Ratio is approximately:",
    options: ["1.414", "1.618", "1.732", "2.0"],
    answer: 1,
    explanation: "The Golden Ratio φ ≈ 1.618, widely used in architecture and art.",
  },
  {
    id: 14,
    topic: "Mathematics",
    question: "If a cube has volume 125 cm³, its total surface area is:",
    options: ["25 cm²", "75 cm²", "150 cm²", "100 cm²"],
    answer: 2,
    explanation: "Side = 5 cm. Surface area = 6s² = 6 × 25 = 150 cm²",
  },
  {
    id: 15,
    topic: "Drawing",
    question: "The technique of creating texture by applying paint with a stiff brush is called:",
    options: ["Glazing", "Scumbling", "Impasto", "Dry brushing"],
    answer: 3,
    explanation: "Dry brushing creates texture by dragging a stiff, dry brush over the surface.",
  },
];
