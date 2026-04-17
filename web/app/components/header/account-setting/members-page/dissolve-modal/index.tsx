'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@langgenius/dify-ui/button'
import { Dialog, DialogCloseButton, DialogContent, DialogTitle } from '@langgenius/dify-ui/dialog'
import Divider from '@/app/components/base/divider'
import Input from '@/app/components/base/input'

import { cn } from '@langgenius/dify-ui/cn'
import s from './index.module.css'
import 'react-multi-email/dist/style.css'

type IDissolveModalProps = {
  workspaceName?: string
  onCancel: () => void
  onDissolve: () => Promise<void>
}

const DissolveModal = ({
  workspaceName,
  onCancel,
  onDissolve,
}: IDissolveModalProps) => {
  const { t } = useTranslation()
  const [confirmWorkspaceName, setConfirmWorkspaceName] = useState('')

  return (
    <div className={cn(s.wrap)}>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open)
            onCancel()
        }}
      >
        <DialogContent
          backdropProps={{ forceRender: true }}
          className="w-[480px] p-8"
        >
          <DialogCloseButton className="top-8 right-8" />
          <DialogTitle className="mb-1 text-xl font-semibold text-text-primary">
            {t('members.dissolveConfirm', { ns: 'common' })}
          </DialogTitle>

          <div className="my-4 text-sm text-text-secondary">
            {t('members.dissolveTip', { ns: 'common' })}
          </div>

          <Input placeholder={t('members.inputWorkspaceNameToDissolve', { ns: 'common' })} className="mb-4" value={confirmWorkspaceName} onChange={e => setConfirmWorkspaceName(e.target.value)} />
          <Divider className="m-0" />

          <div className="mt-4 flex items-start justify-end gap-2 self-stretch">
            <Button onClick={onCancel}>
              {t('iconPicker.cancel', { ns: 'app' })}
            </Button>

            <Button variant="primary" tone='destructive' onClick={() => { onDissolve() }} disabled={confirmWorkspaceName !== workspaceName}>
              {t('members.dissolve', { ns: 'common' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DissolveModal
