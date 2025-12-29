'use client'
import type { Option } from '../../base/prompt-editor/types'
import { RiCloseLine } from '@remixicon/react'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import Modal from '@/app/components/base/modal'
import Toast from '@/app/components/base/toast'
import { useAppContext } from '@/context/app-context'
import { useWorkspacesContext } from '@/context/workspace-context'
import { cn } from '@/utils/classnames'
import { SimpleSelect } from '../../base/select'

export type CopyToTenantModalProps = {
  appName: string
  show: boolean
  onConfirm: (info: { name: string, targetTenantId: string }) => Promise<void>
  onHide: () => void
}

const CopyToTenantModal = ({
  appName,
  show = false,
  onConfirm,
  onHide,
}: CopyToTenantModalProps) => {
  const { t } = useTranslation()
  const { workspaces } = useWorkspacesContext()
  const { currentWorkspace } = useAppContext()
  const [name, setName] = useState(appName)
  const [targetTenantId, setTargetTenantId] = useState('')

  const submit = () => {
    if (!name.trim() || !targetTenantId) {
      Toast.notify({
        type: 'error',
        message: t('app.copyToTenant.fieldRequired'),
      })
      return
    }
    onConfirm({
      name,
      targetTenantId,
    })
    onHide()
  }

  return (
    <>
      <Modal
        isShow={show}
        onClose={() => {}}
        className={cn('relative !max-w-[480px]', 'px-8')}
      >
        <div
          className="absolute right-4 top-4 cursor-pointer p-2"
          onClick={onHide}
        >
          <RiCloseLine className="h-4 w-4 text-text-tertiary" />
        </div>
        <div className="relative mb-9 mt-3 text-xl font-semibold leading-[30px] text-text-primary">
          {t('app.copyToTenant.title')}
        </div>
        <div className="system-sm-regular mb-9 space-y-6 text-text-secondary">
          <div className="space-y-2">
            <div className="text-sm font-medium text-text-primary">{t('app.copyToTenant.name')}</div>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10 w-full"
              placeholder={t('app.copyToTenant.namePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-text-primary">{t('app.copyToTenant.targetWorkspace')}</div>
            <SimpleSelect
              className="w-full"
              placeholder={t('app.copyToTenant.targetWorkspacePlaceholder')}
              items={workspaces.filter(item => item.id !== currentWorkspace?.id).map(item => ({
                name: item.name,
                value: item.id,
              }))}
              onSelect={(value) => {
                const selectedWorkspace = value as unknown as Option
                setTargetTenantId(selectedWorkspace.value)
              }}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <Button
            className="ml-2 w-24"
            variant="primary"
            onClick={submit}
          >
            {t('app.duplicate')}
          </Button>
          <Button className="w-24" onClick={onHide}>
            {t('common.operation.cancel')}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CopyToTenantModal
