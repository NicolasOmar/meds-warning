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

interface CustomDialogProps {
  buttonText: string
  title?: string
  description: string | React.ReactNode
  body?: React.ReactNode
  confirmText: string
  disableConfirm?: boolean
  onConfirm?: () => void
  cancelText?: string
  disableCancel?: boolean
}

const CustomDialog: FC<CustomDialogProps> = ({
  buttonText,
  title,
  description,
  body,
  confirmText,
  onConfirm,
  cancelText,
  disableConfirm,
  disableCancel
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body ?? null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={disableCancel}>
              {cancelText ?? 'Cancel'}
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onConfirm} disabled={disableConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog
