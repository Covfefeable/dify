'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import Divider from '@/app/components/base/divider'
import Input from '@/app/components/base/input'

import Modal from '@/app/components/base/modal'
import { cn } from '@/utils/classnames'
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
      <Modal
        title={t('members.dissolveConfirm', { ns: 'common' })}
        closable
        className="!w-[362px] !p-5"
        isShow
        onClose={onCancel}
      >

        <div className="my-4 text-sm text-text-secondary">
          {t('members.dissolveTip', { ns: 'common' })}
        </div>

        <Input placeholder={t('members.inputWorkspaceNameToDissolve', { ns: 'common' })} className="mb-4" value={confirmWorkspaceName} onChange={e => setConfirmWorkspaceName(e.target.value)} />
        <Divider className="m-0" />

        <div className="mt-4 flex items-start justify-end gap-2 self-stretch">
          <Button onClick={onCancel}>
            {t('iconPicker.cancel', { ns: 'app' })}
          </Button>

          <Button variant="warning" onClick={() => { onDissolve() }} disabled={confirmWorkspaceName !== workspaceName}>
            {t('members.dissolve', { ns: 'common' })}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default DissolveModal
