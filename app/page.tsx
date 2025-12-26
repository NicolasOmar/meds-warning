import Link from 'next/link'

enum ROUTES {
  HOME = '/',
  CREATE = '/create',
  UPDATE = '/update',
  FIND = '/find'
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {Object.keys(ROUTES).map((routeKey, routeI) => {
          const route = ROUTES[routeKey as keyof typeof ROUTES]

          return routeI !== 0 ? (
            <section key={routeKey} className="mb-4">
              <Link href={route} className="text-2xl font-medium text-blue-600 hover:underline">
                Go to {routeKey}
              </Link>
            </section>
          ) : null
        })}
      </main>
    </div>
  )
}
