import { type ReactNode } from 'react'
import Modal from './Modal'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Visual style for the confirm button. `danger` for destructive actions. */
  tone?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
  children,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      footer={
        <>
          <button onClick={onCancel} className="btn-outline flex-1">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${
              tone === "danger"
                ? "btn bg-red-600 text-white hover:bg-red-700"
                : "btn-primary"
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}