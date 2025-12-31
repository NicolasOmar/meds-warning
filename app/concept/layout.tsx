// CORE
import Link from 'next/link'
// COMPONENTS
import { Button } from '@base-components/button'
import { ButtonGroup } from '@base-components/button-group'
// CONSTANTS
import { CONCEPT_MAIN_ROUTES_OBJS } from '@constants/routes'
// LIBRARY
import { LayoutProps } from '@ts/interfaces'

export default function ConceptLayout({ children }: Readonly<LayoutProps>) {
  return (
    <section className="flex flex-col justify-center">
      <ButtonGroup className="self-center m-4">
        {CONCEPT_MAIN_ROUTES_OBJS.map(({ name, path }, routeId) => {
          return (
            <Button key={routeId}>
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
