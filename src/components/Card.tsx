import { ReactElement } from 'react'

type AppProps = {
  name: string
  description: string
  icon: ReactElement
}

export const Card = (p: AppProps) => (
  <div className="p-6 m-4 max-w-xl mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
    <div className="text-6xl">{p.icon}</div>
    <div>
      <p className="text-xl font-bold text-black">{p.name}</p>
      <p>{p.description}</p>
    </div>
  </div>
)
