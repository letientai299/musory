import { ReactElement, useEffect } from 'react'

type MainProps = {
  title?: string
  children: ReactElement
}

export const Main = (p: MainProps) => {
  const pageName = 'Musory' + (p.title ? ' | ' + p.title : '')
  useEffect(() => {
    document.title = pageName
  })
  return (
    <div>
      <header className="bg-black w-full text-white text-xl flex items-center">
        <p className="max-w-8xl m-auto min-w-6xl">
          <a href="/" className="uppercase">
            Musory
          </a>{' '}
          {p.title ? ' ｜ ' + p.title : ''}
        </p>
      </header>

      <main className="max-w-screen-lg m-auto h-full p-12">
        <>{p.children}</>
      </main>

      {/* footer show version and build time */}
      <footer className="w-full bg-grey border-solid border-t flex items-center">
        <article className="max-w-screen-lg m-auto prose-zinc">
          Developed by{' '}
          <a href="https://github.com/letientai299" target="_blank">
            @letientai299
          </a>{' '}
          using React, Tailwind
        </article>
      </footer>
    </div>
  )
}
