// CORE
import type { Metadata } from 'next'
import Link from 'next/link'
// COMPONENTS
import { Item, ItemContent } from '@base-components/item'
import { ButtonGroup } from '@base-components/button-group'
import { Button } from '@base-components/button'
import { Toaster } from '@base-components/sonner'
// LIBRARY
import { MAIN_ROUTES_OBJS } from '@constants/routes'
import { LayoutProps } from '@ts/interfaces'
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
  title: 'Meds Warning',
  description:
    'A web system to help users manage and track their medication expiration dates and remind them to renew them'
}

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-cols-6`}>
        <header className="m-4 col-span-full justify-self-center">
          <ButtonGroup>
            {MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => {
              return (
                <Button key={routeId}>
                  <Link href={path} className="text-2xl font-medium text-white-600 hover:underline">
                    {name}
                  </Link>
                </Button>
              )
            })}
          </ButtonGroup>
        </header>
        <section className="col-start-2 col-span-4">
          <Item>
            <ItemContent>{children}</ItemContent>
          </Item>
        </section>
        <Toaster />
      </body>
    </html>
  )
}
