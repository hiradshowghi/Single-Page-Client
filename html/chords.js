function parseChordProFormat(chordProLinesArray) {
  console.log('parseChordProFormat::chordProLinesArray');
  console.dir(chordProLinesArray);

  for (let i = 0; i < chordProLinesArray.length; i++) {
    chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm, "");
  }

  let textDiv = document.getElementById("text-area");
  textDiv.innerHTML = '';

  let css_chord_class = 'chord';
  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i];
    console.log('line:');
    console.dir(line);
    let htmlLineWithChords = '';
    let collecting_chord = false;
    let current_chord = '';
    for (let j = 0; j < line.length; j++) {
      let c = line[j];
      if (c === '[') {
        collecting_chord = true;
        current_chord = '';
      } else if (c === ']') {
        collecting_chord = false;
        htmlLineWithChords += `<span class=${css_chord_class}>${current_chord}</span>`;
        current_chord = '';
      } else if (collecting_chord === true) {
        current_chord += c;
      } else {
        htmlLineWithChords += c;
      }
    }
    textDiv.innerHTML += `<p>${htmlLineWithChords}</p>`;
  } 
}
