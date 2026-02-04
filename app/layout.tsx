// CORE
import { FC } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
// COMPONENTS
import { ButtonGroup } from '@base-components/button-group'
import { Button } from '@base-components/button'
import { Toaster } from '@base-components/sonner'
// SHARED
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { BaseLayoutProps } from '@shared-types/interfaces'
import { getSession } from '@shared-functions/auth'
import { handleLogoutAction } from '@actions/auth'
import { PUBLIC_ROUTES } from '@shared-constants/auth'
// STYLES
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: ROOT_LAYOUT_LABELS.METADATA_TITLE,
  description: ROOT_LAYOUT_LABELS.METADATA_DESCRIPTION
}

const HomeLayout: FC<BaseLayoutProps> = async ({ children }) => {
  const session = await getSession()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-cols-6`}>
        {session && !isPublicRoute && (
          <header className="flex gap-4 m-4 col-span-full justify-self-center">
            <ButtonGroup>
              {MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => {
                return (
                  <Button key={`layout-route-${routeId}`}>
                    <Link
                      href={path}
                      className="text-2xl font-medium text-white-600 hover:underline"
                    >
                      {name}
                    </Link>
                  </Button>
                )
              })}
            </ButtonGroup>
            <form action={handleLogoutAction}>
              <Button type="submit" variant="destructive">
                Logout
              </Button>
            </form>
          </header>
        )}
        <section className="col-span-full md:col-span-1 md:col-start-2 md:col-span-4">
          {children}
        </section>
        <Toaster />
      </body>
    </html>
  )
}

export default HomeLayout
