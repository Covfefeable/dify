'use client'
import { Button } from '@langgenius/dify-ui/button'
import { cn } from '@langgenius/dify-ui/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from '@langgenius/dify-ui/select'
import { toast } from '@langgenius/dify-ui/toast'
import { RiCloseLine } from '@remixicon/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@/app/components/base/input'
import Modal from '@/app/components/base/modal'
import { useAppContext } from '@/context/app-context'
import { useWorkspacesContext } from '@/context/workspace-context'

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
  const selectableWorkspaces = workspaces.filter(item => item.id !== currentWorkspace?.id)
  const selectedWorkspace = selectableWorkspaces.find(item => item.id === targetTenantId)

  const submit = () => {
    if (!name.trim() || !targetTenantId) {
      toast.error(t('copyToTenant.fieldRequired', { ns: 'app' }))
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
          {t('copyToTenant.title', { ns: 'app' })}
        </div>
        <div className="system-sm-regular mb-9 space-y-6 text-text-secondary">
          <div className="space-y-2">
            <div className="text-sm font-medium text-text-primary">{t('copyToTenant.name', { ns: 'app' })}</div>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10 w-full"
              placeholder={t('copyToTenant.namePlaceholder', { ns: 'app' })}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-text-primary">{t('copyToTenant.targetWorkspace', { ns: 'app' })}</div>
            <Select value={targetTenantId} onValueChange={value => setTargetTenantId(value ?? '')}>
              <SelectTrigger className="h-10 w-full">
                <span className={selectedWorkspace ? 'text-text-primary' : 'text-text-placeholder'}>
                  {selectedWorkspace?.name || t('copyToTenant.targetWorkspacePlaceholder', { ns: 'app' })}
                </span>
              </SelectTrigger>
              <SelectContent popupClassName="w-[var(--trigger-width)]">
                {selectableWorkspaces.map(workspace => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    <SelectItemText>{workspace.name}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <Button
            className="ml-2 w-24"
            variant="primary"
            onClick={submit}
          >
            {t('duplicate', { ns: 'app' })}
          </Button>
          <Button className="w-24" onClick={onHide}>
            {t('operation.cancel', { ns: 'common' })}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CopyToTenantModal
