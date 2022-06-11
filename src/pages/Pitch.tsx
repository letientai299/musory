import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { AudioWave } from '../components/AudioWave'

const Pitch = () => {
  const [listening, setListening] = useState(false)
  const [audio, setAudio] = useState<{
    stream: MediaStream
    analyzer: AnalyserNode
  }>()

  useHotkeys('Space', () => setListening((pre) => !pre))

  function mute() {
    audio?.analyzer.disconnect()
    audio?.stream.getTracks().forEach((t) => t.stop())
  }

  useEffect(() => {
    if (!listening) {
      mute()
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new window.AudioContext()
      const analyzer = audioContext.createAnalyser()
      audioContext.createMediaStreamSource(stream).connect(analyzer)
      setAudio({
        stream: stream,
        analyzer: analyzer,
      })
    })

    return mute
  }, [listening])

  return (
    <div>
      <strong>{listening ? 'Listening...' : 'Muted'}</strong>
      <AudioWave analyzer={audio?.analyzer} />
    </div>
  )
}

export default Pitch
