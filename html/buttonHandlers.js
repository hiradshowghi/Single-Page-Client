// Define key codes for various keyboard events
const ENTER = 13;
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

// Initialize variables
var match;
var chords =
    ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C',
     'Db','D','D#','E','F','Gb','G','G#','A','A#','C'];
var chordRegex = /C#|D#|F#|G#|A#|Db|Eb|Gb|Ab|Bb|C|D|E|F|G|A|B/g;

//Lost the exact link but got some info on Regex from stackoverflow something like the following link 
//https://stackoverflow.com/questions/67567966/song-chords-lyrics-formatting-preview-not-working
// Add click event listener for transpose up button
$('#transposeUp').click(function() {
    $('.chord').each(function() {
        var currentChord = $(this).text();
        var output = "";
        var parts = currentChord.split(chordRegex);
        var index = 0;
        while (match = chordRegex.exec(currentChord)) {
            var chordIndex = chords.indexOf(match[0]);
            var transposedChord = chords[chordIndex + 1];
            
            // Apply CSS classes based on original and transposed chords
            if (transposedChord) {
                output += parts[index++] + `<span class="transposed-chord">${transposedChord}</span>`;
            } else {
                output += parts[index++];
            }
        }
        output += parts[index];
        $(this).html(output);
    });
});

// Add click event listener for transpose down button
$('#transposeDown').click(function() {
    $('.chord').each(function() {
        var currentChord = $(this).text();
        var output = "";
        var parts = currentChord.split(chordRegex);
        var index = 0;
        while (match = chordRegex.exec(currentChord)) {
            var chordIndex = chords.indexOf(match[0], 1);
            var transposedChord = chords[chordIndex - 1];
            
            // Apply CSS classes based on original and transposed chords
            if (transposedChord) {
                output += parts[index++] + `<span class="transposed-chord">${transposedChord}</span>`;
            } else {
                output += parts[index++];
            }
        }
        output += parts[index];
        $(this).html(output);
    });
});

// Handle key down events
function handleKeyDown(e) {
  let keyCode = e.which;
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    // Prevent browser from using these with text input drop downs
    e.stopPropagation();
    e.preventDefault();
  }
}

// Handle key up events
function handleKeyUp(e) {
  if (e.which == RIGHT_ARROW || e.which == LEFT_ARROW || e.which == UP_ARROW || e.which == DOWN_ARROW) {
    // Do nothing for now
  }

  if (e.which == ENTER) {
    handleSubmitButton(); // Treat ENTER key like you would a submit
    document.getElementById('userTextField').value = '';
  }

  e.stopPropagation();
  e.preventDefault();
}

// Handle submit button click
function handleSubmitButton() {
  // Get text from user text input field
  let userText = document.getElementById('userTextField').value;
  // Clear lines of text in textDiv
  let textDiv = document.getElementById("text-area");
  textDiv.innerHTML = '';

  if (userText && userText !== '') {
    let userRequestObj = {
      text: userText
    };
    let userRequestJSON = JSON.stringify(userRequestObj);
    // Clear the user text field
    document.getElementById('userTextField').value = '';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       console.log("typeof: " + typeof this.responseText);
       console.dir(this.responseText);
       // We are expecting the response text to be a JSON string
       let responseObj = JSON.parse(this.responseText);
       console.dir(responseObj);

        words = []; // Clear drag-able words array;
        if (responseObj.songLines) {
          song.songLines = responseObj.songLines;
          transposedByNSemitones = 0; // Reset transpose to no-transpose
          parseChordProFormat(song.songLines);
        }
      }
    };
    xhttp.open("POST", "song"); // API .open(METHOD, URL)
    xhttp.send(userRequestJSON); // API .send(BODY)
  }
}
