const tonesNum = 12 // also same as notes.length
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
const a4Freq = 440
const a4KeyNumberOnPiano = 60 // array start at 0!

const Notes = {
  fromFrequency: (freq: number): string => {
    const noteNum = tonesNum * (Math.log(freq / a4Freq) / Math.log(2))
    const i = Math.round(noteNum) + a4KeyNumberOnPiano
    const name = notes[i % notes.length]

    // hardcoded with special handling because JS number is inaccurate
    let octave = Math.ceil(i / tonesNum) - 1
    if (name == 'A#' || name == 'B') {
      octave--
    }
    return `${name}${octave}`
  },
}

export default Notes
