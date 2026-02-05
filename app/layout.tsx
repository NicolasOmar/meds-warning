// CORE
import { FC } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
// COMPONENTS
import { Button } from '@base-components/button'
import { Separator } from '@base-components/separator'
import { Toaster } from '@base-components/sonner'
// SHARED
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { COMMON_LABELS } from '@shared-constants/common'
import { MAIN_ROUTES_OBJS, ROUTE_URLS } from '@shared-constants/routes'
import { BaseLayoutProps } from '@shared-types/interfaces'
import { getSession } from '@shared-functions/auth'
import { handleLogoutAction } from '@actions/auth'
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {session && session.user ? (
          <header className="sticky top-0 z-10 w-full bg-background border-b">
            <div className="flex h-14 items-center justify-between max-w-5xl mx-auto w-full px-6">
              <Link href={ROUTE_URLS.HOME} className="text-lg font-semibold text-primary">
                {ROOT_LAYOUT_LABELS.METADATA_TITLE}
              </Link>
              <nav className="flex items-center gap-1">
                {MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => (
                  <Button key={`layout-route-${routeId}`} variant="ghost" size="sm" asChild>
                    <Link href={path}>{name}</Link>
                  </Button>
                ))}
                <Separator orientation="vertical" className="h-5 mx-2" />
                <form action={handleLogoutAction}>
                  <Button type="submit" variant="ghost" size="sm">
                    {COMMON_LABELS.LOGOUT}
                  </Button>
                </form>
              </nav>
            </div>
          </header>
        ) : null}
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

export default HomeLayout
