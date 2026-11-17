interface Edge {
  /** ISO 3166-1 alpha-2 */
  country: string;
  /** ISO 3166-2 */
  region: string;
}

type LookupTable<V, K extends string = ThreeUppercaseLetters> = Partial<
  Record<K, V>
>;

// "AAA" | "AAB" | … | "ZZZ" (17,576 members)
type ThreeUppercaseLetters = `${Letter}${Letter}${Letter}`;

type TwoUppercaseLetters = `${Letter}${Letter}`;

type Letter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
