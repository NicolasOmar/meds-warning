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
  text: string
  type: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

interface CustomDialogProps {
  buttonText: string
  title?: string
  description?: string | React.ReactNode
  body?: React.ReactNode
  confirmButton?: CustomDialogButtonProps
  cancelButton?: CustomDialogButtonProps
}

const CustomDialog: FC<CustomDialogProps> = ({
  buttonText,
  title,
  description,
  body,
  confirmButton,
  cancelButton
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
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
                disabled={cancelButton?.disabled}
                onClick={cancelButton?.onClick}
                type={cancelButton?.type}
              >
                {cancelButton?.text}
              </Button>
            </DialogClose>
            <Button
              type={confirmButton?.type}
              onClick={confirmButton?.onClick}
              disabled={confirmButton?.disabled}
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
