'use client'
import { Button } from '@langgenius/dify-ui/button'
import { cn } from '@langgenius/dify-ui/cn'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@langgenius/dify-ui/dialog'
import { IconButton } from '@langgenius/dify-ui/icon-button'
import { Input } from '@langgenius/dify-ui/input'
import { Separator } from '@langgenius/dify-ui/separator'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import s from './index.module.css'

type IDissolveModalProps = {
  workspaceName?: string
  onCancel: () => void
  onDissolve: () => Promise<void>
}

const DissolveModal = ({ workspaceName, onCancel, onDissolve }: IDissolveModalProps) => {
  const { t } = useTranslation(['workspaceMembers', 'app', 'common'])
  const [confirmWorkspaceName, setConfirmWorkspaceName] = useState('')

  return (
    <div className={cn(s.wrap)}>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onCancel()
        }}
      >
        <DialogContent backdropProps={{ forceRender: true }} className="w-[480px] p-8">
          <DialogClose
            render={
              <IconButton
                aria-label={t(($) => $['operation.close'], { ns: 'common' })}
                className="absolute top-8 right-8"
              >
                <span aria-hidden className="i-ri-close-line size-4" />
              </IconButton>
            }
          />
          <DialogTitle className="mb-1 text-xl font-semibold text-text-primary">
            {t(($) => $['members.dissolveConfirm'], { ns: 'workspaceMembers' })}
          </DialogTitle>

          <div className="my-4 text-sm text-text-secondary">
            {t(($) => $['members.dissolveTip'], { ns: 'workspaceMembers' })}
          </div>

          <Input
            placeholder={t(($) => $['members.inputWorkspaceNameToDissolve'], {
              ns: 'workspaceMembers',
            })}
            className="mb-4"
            value={confirmWorkspaceName}
            onChange={(event) => setConfirmWorkspaceName(event.target.value)}
          />
          <Separator />

          <div className="mt-4 flex items-start justify-end gap-2 self-stretch">
            <Button onClick={onCancel}>{t(($) => $['iconPicker.cancel'], { ns: 'app' })}</Button>

            <Button
              variant="primary"
              tone="destructive"
              onClick={() => {
                onDissolve()
              }}
              disabled={confirmWorkspaceName !== workspaceName}
            >
              {t(($) => $['members.dissolve'], { ns: 'workspaceMembers' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DissolveModal
