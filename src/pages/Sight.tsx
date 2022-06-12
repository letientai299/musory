import { useEffect, useState } from 'react'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'
import { AudioWave } from '../components/AudioWave'
import { PitchDetector } from '../components/PitchDetector'
import SingleNote from '../components/SingleNote'
import { Note } from '@tonaljs/tonal'

const Sight = () => {
  const [listening, setListening] = useState(false)
  const [note, setNote] = useState('C#5')
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
      const analyzer = new AnalyserNode(audioContext)
      audioContext.createMediaStreamSource(stream).connect(analyzer)
      setAudio({
        stream: stream,
        analyzer: analyzer,
      })
    })

    return mute
  }, [listening])

  function onNoteDetected(detected: string) {
    let midi = Note.midi(note)
    const detectedMidi = Note.midi(detected)
    if (detectedMidi != midi) {
      return
    }

    if (!midi) {
      midi = 50
    }
    const name = Note.fromMidi(1 + midi)
    setNote(name)
  }

  return (
    <div className="m-auto flex flex-col center items-center">
      <SingleNote name={note} />
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
