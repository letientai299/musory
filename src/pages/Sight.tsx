import { useEffect, useState } from 'react'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'
import { AudioWave } from '../components/AudioWave'
import { PitchDetector } from '../components/PitchDetector'
import SingleNote from '../components/SingleNote'
import { Note } from '@tonaljs/tonal'
import { DebounceInput } from 'react-debounce-input'
import { MidiNumbers, Piano } from 'react-piano'
import 'react-piano/dist/styles.css'
import { Synth } from 'tone'
import { Card } from '../components/Card'
import { GiPianoKeys, GiSoundWaves } from 'react-icons/gi'

enum InputMode {
  Sound,
  Keyboard,
}

const genNote = (low: string, high: string): string => {
  const lowMidi = Note.midi(low)
  const highMidi = Note.midi(high)
  if (!lowMidi || !highMidi) {
    return 'A4'
  }
  const midi = lowMidi + Math.floor(Math.random() * (highMidi - lowMidi))
  const note = Note.fromMidi(midi)
  return note.replaceAll('b', '').replaceAll('#', '')
}

const Sight = () => {
  const [inputMode, setInputMode] = useState(InputMode.Keyboard)
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
        minDecibels: -70,
        maxDecibels: -20,
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
    let correct = false
    if (inputMode == InputMode.Sound) {
      const midi = Note.midi(note)
      const detectedMidi = Note.midi(detected)
      if (detectedMidi == midi) {
        correct = true
      }
    } else {
      correct = detected[0].toLowerCase() == note[0].toLowerCase()
    }

    if (!correct) {
      return
    }

    console.log(detected, note, correct)
    setNote(genNote(lowNote, highNote))
  }

  function getInputControl(mode: InputMode) {
    if (mode == InputMode.Sound) {
      return (
        <>
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
        </>
      )
    }

    const first = MidiNumbers.fromNote('C4')
    const last = MidiNumbers.fromNote('B4')
    // note in C4 range
    const shortcuts = [
      { key: 'c', midiNumber: 60 },
      { key: 'd', midiNumber: 62 },
      { key: 'e', midiNumber: 64 },
      { key: 'f', midiNumber: 65 },
      { key: 'g', midiNumber: 67 },
      { key: 'a', midiNumber: 69 },
      { key: 'b', midiNumber: 71 },
    ]

    const synth = new Synth().toDestination()

    return (
      <div className="w-full h-64">
        <Piano
          noteRange={{ first: first, last: last }}
          keyboardShortcuts={shortcuts}
          playNote={(midi: number) => {
            const name = Note.fromMidi(midi)
            synth.triggerAttackRelease(name, 0.05)
            onNoteDetected(name)
          }}
          stopNote={() => {
            return
          }}
        />
        <div className={'flex flex-col items-center'}>
          <article className="prose">
            <ul>
              <li>Press the letter to name the note</li>
            </ul>
          </article>
        </div>
      </div>
    )
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
          <DebounceInput
            value={lowNote}
            debounceTimeout={500}
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
          <DebounceInput
            value={highNote}
            debounceTimeout={500}
            onChange={(e) => setHighNote(e.target.value)}
            className={'border border-cyan-500 w-12 text-center'}
          />
          <SingleNote name={highNote} />
        </div>
      </div>

      <SingleNote name={note} scale={3} />

      <div className={'flex flex-row flex-nowrap w-full'}>
        <div
          className={`basic-1/2 h-full ${
            inputMode == InputMode.Keyboard ? 'text-cyan-500' : ''
          }`}
          onClick={() => setInputMode(InputMode.Keyboard)}
        >
          <Card
            name={'Virtual keyboard'}
            description={
              'Name the key with virtual keyboard, can type the key using laptop keyboard'
            }
            icon={<GiPianoKeys />}
          />
        </div>

        <div
          className={`basic-1/2 h-full ${
            inputMode == InputMode.Sound ? 'text-cyan-500' : ''
          }`}
          onClick={() => setInputMode(InputMode.Sound)}
        >
          <Card
            name={'Pitch detection'}
            description={
              'Using microphone to detect note name from sound. ' +
              'WARNING: slow and not very correct!'
            }
            icon={<GiSoundWaves />}
          />
        </div>
      </div>

      {getInputControl(inputMode)}
    </div>
  )
}

export default Sight
