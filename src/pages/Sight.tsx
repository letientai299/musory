import { useEffect, useState } from 'react'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'
import { AudioWave } from '../components/AudioWave'
import { PitchDetector } from '../components/PitchDetector'
import SingleNote from '../components/SingleNote'
import { Note } from '@tonaljs/tonal'

const genNote = (low: string, high: string): string => {
  const lowMidi = Note.midi(low)
  const highMidi = Note.midi(high)
  if (!lowMidi || !highMidi) {
    return 'A4'
  }
  const midi = lowMidi + Math.floor(Math.random() * (highMidi - lowMidi))
  return Note.fromMidi(midi)
}

const Sight = () => {
  const [listening, setListening] = useState(false)
  const [lowNote, setLowNote] = useState('C4')
  const [highNote, setHighNote] = useState('C5')

  const [note, setNote] = useState(genNote(lowNote, highNote))
  const [audio, setAudio] = useState<{
    stream: MediaStream | undefined
    analyzer: AnalyserNode | undefined
  }>()

  useHotkeys('Space', () => setListening((pre) => !pre))

  function mute() {
    audio?.analyzer?.disconnect()
    audio?.stream?.getTracks().forEach((t) => t.stop())
    setAudio({
      stream: undefined,
      analyzer: undefined,
    })
  }

  useEffect(() => {
    if (!listening) {
      mute()
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new window.AudioContext()
      const analyzer = new AnalyserNode(audioContext, {
        minDecibels: -40,
      })
      audioContext.createMediaStreamSource(stream).connect(analyzer)
      setAudio({
        stream: stream,
        analyzer: analyzer,
      })
    })

    return mute
  }, [listening])

  function onNoteDetected(detected: string) {
    const midi = Note.midi(note)
    const detectedMidi = Note.midi(detected)
    if (detectedMidi != midi) {
      return
    }
    setNote(genNote(lowNote, highNote))
  }

  return (
    <div className="m-auto flex flex-col items-center">
      <div className={'flex flex-row w-full mb-12'}>
        <div
          className={
            'flex flex-row flex-wrap items-center basis-1/2 justify-center space-x-2'
          }
        >
          <p className={''}>Lowest note</p>
          <input
            value={lowNote}
            onChange={(e) => setLowNote(e.target.value)}
            className={'border border-cyan-500 w-12 text-center'}
          />
          <SingleNote name={lowNote} />
        </div>

        <div
          className={
            'flex flex-wrap flex-row items-center basis-1/2 justify-center space-x-2'
          }
        >
          <p>Highest note</p>
          <input
            value={highNote}
            onChange={(e) => setHighNote(e.target.value)}
            className={'border border-cyan-500 w-12 text-center'}
          />
          <SingleNote name={highNote} />
        </div>
      </div>

      <SingleNote name={note} scale={3} />
      <button
        id="btn-play"
        className={
          'text-6xl ' +
          (!listening ? 'text-gray-400' : '') +
          ' hover:text-cyan-500'
        }
        onMouseDown={() => setListening((pre) => !pre)}
      >
        {listening ? <BsMicMuteFill /> : <BsMicFill />}
      </button>
      <AudioWave analyzer={audio?.analyzer} samplingStep={10} />
      <PitchDetector
        analyzer={audio?.analyzer}
        onNoteDetected={onNoteDetected}
      />

      <article className="prose">
        <ul>
          <li>
            Press <kbd>Space</kbd> to toggle pitch detection via microphone.
          </li>
        </ul>
      </article>
    </div>
  )
}

export default Sight
