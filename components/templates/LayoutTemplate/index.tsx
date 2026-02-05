// CORE
import { FC } from 'react'
// COMPONENTS
import Link from 'next/link'
import { Button } from '@base-components/button'
// SHARED
import { LayoutTempalteProps } from '@shared-types/interfaces'

const LayoutTemplate: FC<LayoutTempalteProps> = ({ children, paths }) => {
  return (
    <section className="flex flex-col gap-6">
      {paths ? (
        <div className="flex items-center gap-1 flex-wrap">
          {paths.map(({ name, path }, routeId) => (
            <Button key={`layout-template-route-${routeId}`} variant="ghost" size="sm" asChild>
              <Link href={path}>{name}</Link>
            </Button>
          ))}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export default LayoutTemplate
