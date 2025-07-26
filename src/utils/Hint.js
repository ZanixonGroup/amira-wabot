function hint(answer, currentHint = []) {
  let underscore = "_"
  let hintArray = []

  for (let i = 0; i < answer.length; i++) {
    if (currentHint.includes(answer[i])) {
      hintArray.push(answer[i])
    } else {
      hintArray.push(underscore)
    }
  }

  let unopenedLetters = answer.split("").filter(letter => !currentHint.includes(letter))
  if (unopenedLetters.length > 0) {
    let randomIndex = Math.floor(Math.random() * unopenedLetters.length)
    let newHintLetter = unopenedLetters[randomIndex]
    hintArray[answer.indexOf(newHintLetter)] = newHintLetter
  }
  
  return hintArray
}

export default hint;