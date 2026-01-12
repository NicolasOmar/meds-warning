// CORE
import { FC } from 'react'
import Link from 'next/link'
// COMPONENTS
import { Button } from '@base-components/button'
import { ButtonGroup } from '@base-components/button-group'
// SHARED
import { PRESENTATION_MAIN_ROUTES_OBJS } from '@shared-constants/routes'
import { LayoutProps } from '@shared-types/interfaces'

const PresentationLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <section className="flex flex-col justify-center">
      <ButtonGroup className="self-center m-4">
        {PRESENTATION_MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => {
          return (
            <Button key={`presentation-route-${routeId}`}>
              <Link href={path} className="text-2xl font-medium text-white-600 hover:underline">
                {name}
              </Link>
            </Button>
          )
        })}
      </ButtonGroup>
      {children}
    </section>
  )
}

export default PresentationLayout
