import { ReactElement } from 'react'

type CardProps = {
  name: string
  description: string
  icon: ReactElement
}

export const Card = (p: CardProps) => (
  <div
    className="p-6 m-4 max-w-xl mx-auto bg-white rounded-xl
    shadow-lg flex items-center space-x-4
    hover:drop-shadow-xl"
  >
    <div className="text-6xl">{p.icon}</div>
    <div>
      <p className="prose text-xl font-bold text-black">{p.name}</p>
      <p className="prose">{p.description}</p>
    </div>
  </div>
)
