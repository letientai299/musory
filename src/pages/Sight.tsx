import { useEffect, useState } from 'react'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'
import { AudioWave } from '../components/AudioWave'
import { PitchDetector } from '../components/PitchDetector'

const Sight = () => {
  const [listening, setListening] = useState(false)
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
        // maxDecibels: -0,
        // minDecibels: -60,
        // fftSize: 4096,
      })
      audioContext.createMediaStreamSource(stream).connect(analyzer)
      setAudio({
        stream: stream,
        analyzer: analyzer,
      })
    })

    return mute
  }, [listening])

  return (
    <div className="m-auto flex flex-col center items-center">
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
      <PitchDetector analyzer={audio?.analyzer} />

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
