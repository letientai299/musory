import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { DebounceInput } from 'react-debounce-input'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'
import { Loop, Synth, Transport } from 'tone'

const defaultBMP = 100
const minBMP = 10
const maxBMP = 200
const safeBmp = (pre: number, n: number) => {
  if (Number.isNaN(n)) {
    return pre
  }

  if (n < minBMP) {
    return minBMP
  }

  if (n > maxBMP) {
    return maxBMP
  }

  return n
}

let toneLoop: Loop

function togglePlaying(playing: boolean, bpm: number) {
  if (toneLoop) {
    toneLoop.stop(0)
  }

  if (!playing) {
    return
  }

  const synth = new Synth().toDestination()
  toneLoop = new Loop((time) => {
    synth.triggerAttackRelease('B2', 0.01, time)
  }).start(0)
  Transport.bpm.rampTo(bpm)
  Transport.start()
}

const Metronome = () => {
  const [bmp, setBmp] = useState(defaultBMP)
  const [playing, setPlaying] = useState(false)

  useHotkeys('up', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('k', () => setBmp((pre) => safeBmp(pre, pre + 1)))
  useHotkeys('down', () => setBmp((pre) => safeBmp(pre, pre - 1)))
  useHotkeys('j', () => setBmp((pre) => safeBmp(pre, pre - 1)))

  useHotkeys('Enter', () => setPlaying((pre) => !pre))
  useHotkeys('Space', () => setPlaying((pre) => !pre))

  togglePlaying(playing, bmp)

  return (
    <div className="m-auto flex flex-col center items-center">
      <DebounceInput
        autoFocus
        type="number"
        debounceTimeout={200}
        value={bmp}
        onChange={(e) =>
          setBmp((pre) => safeBmp(pre, Number.parseInt(e.target.value)))
        }
        className="text-9xl m-auto w-1/2 text-center outline-none appearance-none"
      />
      <p className="text-3xl">BMP</p>

      <button
        id="btn-play"
        className="text-9xl"
        onMouseDown={() => setPlaying(!playing)}
      >
        {playing ? <GiPauseButton /> : <GiPlayButton />}
      </button>

      <article className="prose">
        <ul>
          <li>
            <kbd>Up</kbd> or <kbd>j</kbd> to increase the BMP.
          </li>
          <li>
            <kbd>Down</kbd> or <kbd>k</kbd> to increase the BMP.
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle playing.
          </li>
          <li>
            Hit <kbd>Tab</kbd> or click outside of BMP input if can't toggle
            playing using shortcuts
          </li>
        </ul>
      </article>
    </div>
  )
}

export default Metronome
