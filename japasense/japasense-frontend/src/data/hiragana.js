export const hiraganaData = [
  // Basic Vowels
  { char: 'あ', romaji: 'a', type: 'vowel' },
  { char: 'い', romaji: 'i', type: 'vowel' },
  { char: 'う', romaji: 'u', type: 'vowel' },
  { char: 'え', romaji: 'e', type: 'vowel' },
  { char: 'お', romaji: 'o', type: 'vowel' },
  
  // K-line
  { char: 'か', romaji: 'ka', type: 'consonant' },
  { char: 'き', romaji: 'ki', type: 'consonant' },
  { char: 'く', romaji: 'ku', type: 'consonant' },
  { char: 'け', romaji: 'ke', type: 'consonant' },
  { char: 'こ', romaji: 'ko', type: 'consonant' },
  
  // S-line
  { char: 'さ', romaji: 'sa', type: 'consonant' },
  { char: 'し', romaji: 'shi', type: 'consonant' },
  { char: 'す', romaji: 'su', type: 'consonant' },
  { char: 'せ', romaji: 'se', type: 'consonant' },
  { char: 'そ', romaji: 'so', type: 'consonant' },
  
  // T-line
  { char: 'た', romaji: 'ta', type: 'consonant' },
  { char: 'ち', romaji: 'chi', type: 'consonant' },
  { char: 'つ', romaji: 'tsu', type: 'consonant' },
  { char: 'て', romaji: 'te', type: 'consonant' },
  { char: 'と', romaji: 'to', type: 'consonant' },
  
  // N-line
  { char: 'な', romaji: 'na', type: 'consonant' },
  { char: 'に', romaji: 'ni', type: 'consonant' },
  { char: 'ぬ', romaji: 'nu', type: 'consonant' },
  { char: 'ね', romaji: 'ne', type: 'consonant' },
  { char: 'の', romaji: 'no', type: 'consonant' },
  
  // H-line
  { char: 'は', romaji: 'ha', type: 'consonant' },
  { char: 'ひ', romaji: 'hi', type: 'consonant' },
  { char: 'ふ', romaji: 'fu', type: 'consonant' },
  { char: 'へ', romaji: 'he', type: 'consonant' },
  { char: 'ほ', romaji: 'ho', type: 'consonant' },
  
  // M-line
  { char: 'ま', romaji: 'ma', type: 'consonant' },
  { char: 'み', romaji: 'mi', type: 'consonant' },
  { char: 'む', romaji: 'mu', type: 'consonant' },
  { char: 'め', romaji: 'me', type: 'consonant' },
  { char: 'も', romaji: 'mo', type: 'consonant' },
  
  // Y-line
  { char: 'や', romaji: 'ya', type: 'consonant' },
  { char: 'ゆ', romaji: 'yu', type: 'consonant' },
  { char: 'よ', romaji: 'yo', type: 'consonant' },
  
  // R-line
  { char: 'ら', romaji: 'ra', type: 'consonant' },
  { char: 'り', romaji: 'ri', type: 'consonant' },
  { char: 'る', romaji: 'ru', type: 'consonant' },
  { char: 'れ', romaji: 're', type: 'consonant' },
  { char: 'ろ', romaji: 'ro', type: 'consonant' },
  
  // W-line
  { char: 'わ', romaji: 'wa', type: 'consonant' },
  { char: 'を', romaji: 'wo', type: 'consonant' },
  
  // N
  { char: 'ん', romaji: 'n', type: 'consonant' },
  
  // Dakuten G-line
  { char: 'が', romaji: 'ga', type: 'dakuten' },
  { char: 'ぎ', romaji: 'gi', type: 'dakuten' },
  { char: 'ぐ', romaji: 'gu', type: 'dakuten' },
  { char: 'げ', romaji: 'ge', type: 'dakuten' },
  { char: 'ご', romaji: 'go', type: 'dakuten' },
  
  // Dakuten Z-line
  { char: 'ざ', romaji: 'za', type: 'dakuten' },
  { char: 'じ', romaji: 'ji', type: 'dakuten' },
  { char: 'ず', romaji: 'zu', type: 'dakuten' },
  { char: 'ぜ', romaji: 'ze', type: 'dakuten' },
  { char: 'ぞ', romaji: 'zo', type: 'dakuten' },
  
  // Dakuten D-line
  { char: 'だ', romaji: 'da', type: 'dakuten' },
  { char: 'ぢ', romaji: 'di', type: 'dakuten' },
  { char: 'づ', romaji: 'du', type: 'dakuten' },
  { char: 'で', romaji: 'de', type: 'dakuten' },
  { char: 'ど', romaji: 'do', type: 'dakuten' },
  
  // Dakuten B-line
  { char: 'ば', romaji: 'ba', type: 'dakuten' },
  { char: 'び', romaji: 'bi', type: 'dakuten' },
  { char: 'ぶ', romaji: 'bu', type: 'dakuten' },
  { char: 'べ', romaji: 'be', type: 'dakuten' },
  { char: 'ぼ', romaji: 'bo', type: 'dakuten' },
  
  // Handakuten P-line
  { char: 'ぱ', romaji: 'pa', type: 'handakuten' },
  { char: 'ぴ', romaji: 'pi', type: 'handakuten' },
  { char: 'ぷ', romaji: 'pu', type: 'handakuten' },
  { char: 'ぺ', romaji: 'pe', type: 'handakuten' },
  { char: 'ぽ', romaji: 'po', type: 'handakuten' },
];

export const getHiraganaByType = (type) => {
  return hiraganaData.filter(item => item.type === type);
};

export const getRandomHiragana = (count = 1, excludeTypes = []) => {
  const filtered = excludeTypes.length > 0 
    ? hiraganaData.filter(item => !excludeTypes.includes(item.type))
    : hiraganaData;
  
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default hiraganaData;