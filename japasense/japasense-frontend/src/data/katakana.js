export const katakanaData = [
  // Basic Vowels
  { char: 'ア', romaji: 'a', type: 'vowel' },
  { char: 'イ', romaji: 'i', type: 'vowel' },
  { char: 'ウ', romaji: 'u', type: 'vowel' },
  { char: 'エ', romaji: 'e', type: 'vowel' },
  { char: 'オ', romaji: 'o', type: 'vowel' },
  
  // K-line
  { char: 'カ', romaji: 'ka', type: 'consonant' },
  { char: 'キ', romaji: 'ki', type: 'consonant' },
  { char: 'ク', romaji: 'ku', type: 'consonant' },
  { char: 'ケ', romaji: 'ke', type: 'consonant' },
  { char: 'コ', romaji: 'ko', type: 'consonant' },
  
  // S-line
  { char: 'サ', romaji: 'sa', type: 'consonant' },
  { char: 'シ', romaji: 'shi', type: 'consonant' },
  { char: 'ス', romaji: 'su', type: 'consonant' },
  { char: 'セ', romaji: 'se', type: 'consonant' },
  { char: 'ソ', romaji: 'so', type: 'consonant' },
  
  // T-line
  { char: 'タ', romaji: 'ta', type: 'consonant' },
  { char: 'チ', romaji: 'chi', type: 'consonant' },
  { char: 'ツ', romaji: 'tsu', type: 'consonant' },
  { char: 'テ', romaji: 'te', type: 'consonant' },
  { char: 'ト', romaji: 'to', type: 'consonant' },
  
  // N-line
  { char: 'ナ', romaji: 'na', type: 'consonant' },
  { char: 'ニ', romaji: 'ni', type: 'consonant' },
  { char: 'ヌ', romaji: 'nu', type: 'consonant' },
  { char: 'ネ', romaji: 'ne', type: 'consonant' },
  { char: 'ノ', romaji: 'no', type: 'consonant' },
  
  // H-line
  { char: 'ハ', romaji: 'ha', type: 'consonant' },
  { char: 'ヒ', romaji: 'hi', type: 'consonant' },
  { char: 'フ', romaji: 'fu', type: 'consonant' },
  { char: 'ヘ', romaji: 'he', type: 'consonant' },
  { char: 'ホ', romaji: 'ho', type: 'consonant' },
  
  // M-line
  { char: 'マ', romaji: 'ma', type: 'consonant' },
  { char: 'ミ', romaji: 'mi', type: 'consonant' },
  { char: 'ム', romaji: 'mu', type: 'consonant' },
  { char: 'メ', romaji: 'me', type: 'consonant' },
  { char: 'モ', romaji: 'mo', type: 'consonant' },
  
  // Y-line
  { char: 'ヤ', romaji: 'ya', type: 'consonant' },
  { char: 'ユ', romaji: 'yu', type: 'consonant' },
  { char: 'ヨ', romaji: 'yo', type: 'consonant' },
  
  // R-line
  { char: 'ラ', romaji: 'ra', type: 'consonant' },
  { char: 'リ', romaji: 'ri', type: 'consonant' },
  { char: 'ル', romaji: 'ru', type: 'consonant' },
  { char: 'レ', romaji: 're', type: 'consonant' },
  { char: 'ロ', romaji: 'ro', type: 'consonant' },
  
  // W-line
  { char: 'ワ', romaji: 'wa', type: 'consonant' },
  { char: 'ヲ', romaji: 'wo', type: 'consonant' },
  
  // N
  { char: 'ン', romaji: 'n', type: 'consonant' },
  
  // Dakuten G-line
  { char: 'ガ', romaji: 'ga', type: 'dakuten' },
  { char: 'ギ', romaji: 'gi', type: 'dakuten' },
  { char: 'グ', romaji: 'gu', type: 'dakuten' },
  { char: 'ゲ', romaji: 'ge', type: 'dakuten' },
  { char: 'ゴ', romaji: 'go', type: 'dakuten' },
  
  // Dakuten Z-line
  { char: 'ザ', romaji: 'za', type: 'dakuten' },
  { char: 'ジ', romaji: 'ji', type: 'dakuten' },
  { char: 'ズ', romaji: 'zu', type: 'dakuten' },
  { char: 'ゼ', romaji: 'ze', type: 'dakuten' },
  { char: 'ゾ', romaji: 'zo', type: 'dakuten' },
  
  // Dakuten D-line
  { char: 'ダ', romaji: 'da', type: 'dakuten' },
  { char: 'ヂ', romaji: 'di', type: 'dakuten' },
  { char: 'ヅ', romaji: 'du', type: 'dakuten' },
  { char: 'デ', romaji: 'de', type: 'dakuten' },
  { char: 'ド', romaji: 'do', type: 'dakuten' },
  
  // Dakuten B-line
  { char: 'バ', romaji: 'ba', type: 'dakuten' },
  { char: 'ビ', romaji: 'bi', type: 'dakuten' },
  { char: 'ブ', romaji: 'bu', type: 'dakuten' },
  { char: 'ベ', romaji: 'be', type: 'dakuten' },
  { char: 'ボ', romaji: 'bo', type: 'dakuten' },
  
  // Handakuten P-line
  { char: 'パ', romaji: 'pa', type: 'handakuten' },
  { char: 'ピ', romaji: 'pi', type: 'handakuten' },
  { char: 'プ', romaji: 'pu', type: 'handakuten' },
  { char: 'ペ', romaji: 'pe', type: 'handakuten' },
  { char: 'ポ', romaji: 'po', type: 'handakuten' },
];

export const getKatakanaByType = (type) => {
  return katakanaData.filter(item => item.type === type);
};

export const getRandomKatakana = (count = 1, excludeTypes = []) => {
  const filtered = excludeTypes.length > 0 
    ? katakanaData.filter(item => !excludeTypes.includes(item.type))
    : katakanaData;
  
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default katakanaData;