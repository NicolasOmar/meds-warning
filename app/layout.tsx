// CORE
import { FC } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
// COMPONENTS
import { ButtonGroup } from '@base-components/button-group'
import { Button } from '@base-components/button'
import { Toaster } from '@base-components/sonner'
// SHARED
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { BaseLayoutProps } from '@shared-types/interfaces'
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

const HomeLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-cols-6`}>
        <header className="m-4 col-span-full justify-self-center">
          <ButtonGroup>
            {MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => {
              return (
                <Button key={`layout-route-${routeId}`}>
                  <Link href={path} className="text-2xl font-medium text-white-600 hover:underline">
                    {name}
                  </Link>
                </Button>
              )
            })}
          </ButtonGroup>
        </header>
        <section className="col-span-full md:col-span-1 md:col-start-2 md:col-span-4">
          {children}
        </section>
        <Toaster />
      </body>
    </html>
  )
}

export default HomeLayout
