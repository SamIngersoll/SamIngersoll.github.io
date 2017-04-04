// draculaParams_inv_pos_dict= {
// 	1: 'Common Noun (plural)',
// 	2: 'Personal Pronoun',
// 	3: 'Verb (past tense)',
// 	4: 'Verb (-ing)',
// 	5: 'Prepositions or Subordinating Conjunction',
// 	6: 'Pronoun (possessive)',
// 	7: 'Common Noun',
// 	8: 'Coordinating Conjunction',
// 	9: 'Proper Noun (singular)',
// 	10: '\'',
// 	11: 'USR',
// 	12: 'Interjection',
// 	13: 'Adjective',
// 	14: 'to',
// 	15: ',',
// 	16: '.',
// 	17: 'Adverb',
// 	18: 'Verb (modal)',
// 	19: 'Verb (base form)',
// 	20: 'Verb (past participle)',
// 	21: 'Determiner',
// 	22: ')',
// 	23: 'Wh-adverb',
// 	24: 'Verb (3rd person singular present)',
// 	25: 'Comparative Adjective',
// 	26: 'URL',
// 	27: 'HT',
// 	28: ':',
// 	29: 'Verb (past tense)',
// 	30: '``',
// 	31: 'Cardinal Number',
// 	32: 'Comparative Adverb',
// 	33: 'Particle',
// 	34: 'RT',
// 	35: 'Superlative Adjective',
// 	36: 'Superlative Adverb',
// 	37: 'Existence There',
// 	38: 'Proper Noun (Plural)',
// 	39: 'Possessive Ending  \'s',
// 	40: 'Wh-pronoun',
// 	41: '(',
// 	42: 'Wh-determiner ',
// 	43: 'Foreign Word',
// 	44: '$',
// 	45: 'Predeterminer',
// 	46: 'Symbol',
// 	47: 'MB',
// 	48: 'Possessive wh-pronoun',
// 	49: '-LRB-',
// 	50: '-RRB-',
// 	51: 'List Item Marker',
// 	52: '#',
// };
draculaParams_inv_pos_dict= {
	1: 'Noun (pl)',
	2: 'Personal Pronoun',
	3: 'Verb (past)',
	4: 'Verb (-ing)',
	5: 'Prep/Sub. Conj.',
	6: 'Pronoun',
	7: 'Noun',
	8: 'Coordinating Conj.',
	9: 'Proper Noun',
	10: '\'',
	11: 'USR',
	12: 'Interj.',
	13: 'Adjective',
	14: 'to',
	15: ',',
	16: '.',
	17: 'Adverb',
	18: 'Verb',
	19: 'Verb',
	20: 'Verb',
	21: 'Determiner',
	22: ')',
	23: 'Wh-adverb',
	24: 'Verb',
	25: 'Comparative Adj.',
	26: 'URL',
	27: 'HT',
	28: ':',
	29: 'Verb (past)',
	30: '``',
	31: 'Cardinal Number',
	32: 'Comparative Adv.',
	33: 'Particle',
	34: 'RT',
	35: 'Superl. Adj.',
	36: 'Superl. Adv.',
	37: 'Existence There',
	38: 'Proper Noun',
	39: 'Possessive Ending  \'s',
	40: 'Wh-pronoun',
	41: '(',
	42: 'Wh-determiner ',
	43: 'Foreign Word',
	44: '$',
	45: 'Predeterminer',
	46: 'Symbol',
	47: 'MB',
	48: 'Possessive wh-pronoun',
	49: '-LRB-',
	50: '-RRB-',
	51: 'List Item Marker',
	52: '#',
};

//https://sites.google.com/site/partofspeechhelp/home#TOC-LS
// import numeric from "numeric-1.2.6";
// var numeric = require('numeric');
// This is the core function, used by everything
// var text = "hello, my friend"
// console.log( text );
// console.log( dracula(text, false));
function dracula(content, visualize) {
  // Tokenize
  var tokens = draculaTokenize(content);
  // Create embeddings
  var embeddings = [];
  var lengths = [];
  var maxOffset = 20;
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var tokenEmbeddings = draculaGetEmbeddings(token, maxOffset);
    embeddings.push(tokenEmbeddings);
    var l = token.length;
    if (maxOffset < l) l = maxOffset;
    lengths.push(l);
  }
  for (var i = embeddings.length; i < 47; i++) {
    lengths.push(0);
  }
  if (visualize) {
    visualizeCharacterEmbeddings(embeddings, lengths);
  }

  // First-level LSTMs
  var lstmOutput1 = [];
  var lstmOutput2 = [];
  for (var i = 0; i < embeddings.length; i++) {
    var cur = embeddings[i];
    var out1 = draculaBLSTM(cur, 'lstm_chars_1');
    var out2 = draculaBLSTM(out1, 'lstm_chars_2');
    lstmOutput1.push(out1);
    lstmOutput2.push(out2);
  }

  if (visualize) {
    visualizeLSTMCharsActivation(lstmOutput1, 1, lengths);
    visualizeLSTMCharsActivation(lstmOutput2, 2, lengths);
  }

  var lstmOutput = lstmOutput2;

  // Mean-pooling
  var meanOutput = [];
  for (var i = 0; i < lstmOutput.length; i++) {
    if (lengths[i] == 0) break;
    var cur = new Array(64).fill(0);
    for (var j = 0; j < lengths[i]; j++) {
      cur = numeric.add(cur, lstmOutput[i][j]);
    }
    cur = numeric.div(cur, lengths[i]);
    meanOutput.push(cur);
  }

  if (visualize) {
    visualize2DActivation(meanOutput, "mean-pooling-plot", "Mean-pooling");
  }

  // Word-level LSTMs
  var lstmWords = meanOutput;
  for (var i = 1; i <= 3; i++) {
    var prefix = 'lstm_words_' + i;
    lstmWords = draculaBLSTM(lstmWords, prefix);
    if (visualize)
      visualize2DActivation(lstmWords, "lstm-words-"+i, "Word-level LSTM ("+i+")")
  }
  // Output
  var probs = draculaSoftmax(lstmWords);
  if (visualize) {
    visualize2DActivation(probs, "probs-plot", "Word-level softmax");
  }
  return determineLabels(probs);
  return output.join(', ');
}
