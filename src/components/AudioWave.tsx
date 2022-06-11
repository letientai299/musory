import { useEffect, useRef } from 'react'

type AudioWaveProps = {
  analyzer: AnalyserNode | undefined
  samplingStep?: number
}

// Thank to https://alexanderell.is/posts/tuner/
function draw(
  ctx: CanvasRenderingContext2D,
  analyzer: AnalyserNode,
  step: number
) {
  const height = ctx.canvas.height
  const width = ctx.canvas.width

  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgb(0, 0, 0)'

  const visualize = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    requestAnimationFrame(visualize)

    const bufferLength = analyzer.fftSize
    const data = new Uint8Array(bufferLength)
    analyzer.getByteTimeDomainData(data)

    ctx.beginPath()
    const sliceWidth = width / bufferLength
    let x = 0
    for (let i = 0; i < bufferLength; i += step) {
      const v = data[i] / 128.0
      const y = (v * height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth * step
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2)
    ctx.stroke()
  }

  visualize()
}

export const AudioWave = (p: AudioWaveProps) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d') as CanvasRenderingContext2D
    if (p.analyzer) {
      let step = p.samplingStep
      if (!step || step < 0) {
        step = 1
      }
      draw(ctx, p.analyzer, step)
    }
  })

  return (
    <div className="border h-40 w-full">
      <canvas ref={canvas} className="w-full h-full min-h-full"></canvas>
    </div>
  )
}
