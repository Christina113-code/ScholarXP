export type MultipleChoiceProblem = {
  type: "multiple_choice";
  prompt: string;
  choices: string[];
  answer: { choiceIndex: number };
  metadata?: Record<string, unknown>;
};

export type FRQProblem = {
  type: "frq";
  prompt: string;
  answer: string;
  metadata?: Record<string, unknown>;
};

export type ParsedProblem = MultipleChoiceProblem | FRQProblem;
