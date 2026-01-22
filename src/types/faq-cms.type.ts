export type TFaqsCmsData = {
  status: boolean;
  message?: string;
  data: {
    counts: Record<string, number>;
    data: Record<
      string,
      {
        id: string;
        question: string;
        answer: string;
      }[]
    >;
  };
};
