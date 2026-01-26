// CODE
import { FC } from 'react'
// COMPONENTS
import { Button } from '@base-components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@base-components/dialog'

interface CustomDialogButtonProps {
  text: string | React.ReactNode
  title?: string
  type: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

interface CustomDialogProps {
  initButton: Omit<CustomDialogButtonProps, 'onClick' | 'type'>
  title?: string
  description?: string | React.ReactNode
  body?: React.ReactNode
  confirmButton?: CustomDialogButtonProps
  cancelButton?: CustomDialogButtonProps
}

const CustomDialog: FC<CustomDialogProps> = ({
  initButton,
  title,
  description,
  body,
  confirmButton,
  cancelButton
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={initButton?.disabled} title={initButton?.title}>
          {initButton?.text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title ? (
            <DialogTitle>{title}</DialogTitle>
          ) : (
            <DialogTitle className="sr-only">Dialog</DialogTitle>
          )}
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {body ?? null}
        {confirmButton || cancelButton ? (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type={cancelButton?.type}
                title={cancelButton?.title}
                disabled={cancelButton?.disabled}
                onClick={cancelButton?.onClick}
              >
                {cancelButton?.text}
              </Button>
            </DialogClose>
            <Button
              type={confirmButton?.type}
              title={confirmButton?.title}
              disabled={confirmButton?.disabled}
              onClick={confirmButton?.onClick}
            >
              {confirmButton?.text}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
