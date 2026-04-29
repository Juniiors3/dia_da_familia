export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface Quote {
  text: string;
  author: string;
}

export const INSPIRATIONAL_QUOTES: Quote[] = [
  { text: "A vida é o que acontece enquanto você faz outros planos.", author: "John Lennon" },
  { text: "A melhor maneira de prever o futuro é criá-lo.", author: "Peter Drucker" },
  { text: "Onde quer que você vá, vá com todo o seu coração.", author: "Confúcio" },
  { text: "A simplicidade é o último grau de sofisticação.", author: "Leonardo da Vinci" },
  { text: "Às vezes, as coisas mais simples são as mais belas.", author: "Anônimo" },
  { text: "Capture cada momento como se fosse o último.", author: "LumiFrame" },
  { text: "O hoje é um presente, por isso é chamado de presente.", author: "Eleanor Roosevelt" }
];
