'use client'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import s from './index.module.css'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import 'react-multi-email/dist/style.css'

import Divider from '@/app/components/base/divider'
import Input from '@/app/components/base/input'
import { useState } from 'react'
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
        title={t('common.members.dissolveConfirm')}
        closable
        className="!w-[362px] !p-5"
        isShow
        onClose={onCancel}
      >

        <div className='my-4 text-sm text-text-secondary'>
          {t('common.members.dissolveTip')}
        </div>

        <Input placeholder='输入工作区名称以确认解散' className='mb-2' value={confirmWorkspaceName} onChange={e => setConfirmWorkspaceName(e.target.value)} />
        <Divider className='m-0' />

        <div className='flex w-full items-center justify-center gap-2 p-3'>
          <Button className='w-full' onClick={onCancel}>
            {t('app.iconPicker.cancel')}
          </Button>

          <Button variant="warning" className='w-full' onClick={() => { onDissolve() }} disabled={confirmWorkspaceName !== workspaceName}>
            {t('common.members.dissolve')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default DissolveModal
