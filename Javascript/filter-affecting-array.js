// Modifying each word
let words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];

const modifiedWords = words.filter((word, index, arr) => {
  arr[index + 1] += ' extra';
  return word.length < 6;
});

console.log(modifiedWords);
// Notice there are three words below length 6, but since they've been modified one is returned
// ["spray"]

// Appending new words
words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];
const appendedWords = words.filter((word, index, arr) => {
  arr.push('new');
  return word.length < 6;
})

console.log(appendedWords);
// Only three fits the condition even though the `words` itself now has a lot more words with character length less than 6
// ["spray" ,"limit" ,"elite"]

// Deleting words
words = ['spray', 'limit', 'exuberant', 'destruction', 'elite', 'present'];
const deleteWords = words.filter((word, index, arr) => {
  arr.pop();
  return word.length < 6;
})

console.log(deleteWords);
// Notice 'elite' is not even obtained as it's been popped off 'words' before filter can even get there
// ["spray" ,"limit"]
