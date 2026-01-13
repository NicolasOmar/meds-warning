// CORE
import { FC } from 'react'
// COMPONENTS
import Link from 'next/link'
import { ButtonGroup } from '@base-components/button-group'
import { Button } from '@base-components/button'
// SHARED
import { LayoutTempalteProps } from '@shared-types/interfaces'

const LayoutTemplate: FC<LayoutTempalteProps> = ({ children, paths }) => {
  return (
    <section className="flex flex-col justify-center gap-4 px-5 md:px-0">
      <ButtonGroup className="self-center m-4">
        {paths.map(({ name, path }, routeId) => {
          return (
            <Button key={`layout-template-route-${routeId}`}>
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

export default LayoutTemplate
