'use client'
import { Button } from '@langgenius/dify-ui/button'
import { cn } from '@langgenius/dify-ui/cn'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@langgenius/dify-ui/dialog'
import { IconButton } from '@langgenius/dify-ui/icon-button'
import { Input } from '@langgenius/dify-ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from '@langgenius/dify-ui/select'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from '@/app/notifications'
import { consoleQuery } from '@/service/console'

export type CopyToTenantModalProps = {
  appName: string
  show: boolean
  onConfirm: (info: { name: string; targetTenantId: string }) => Promise<void>
  onHide: () => void
}

const CopyToTenantModal = ({
  appName,
  show = false,
  onConfirm,
  onHide,
}: CopyToTenantModalProps) => {
  const { t } = useTranslation(['app', 'common'])
  const { data } = useQuery(consoleQuery.workspaces.get.queryOptions())
  const [name, setName] = useState(appName)
  const [targetTenantId, setTargetTenantId] = useState('')
  const workspaces = data?.workspaces ?? []
  const selectableWorkspaces = workspaces.filter((item) => !item.current)
  const selectedWorkspace = selectableWorkspaces.find((item) => item.id === targetTenantId)

  const submit = () => {
    if (!name.trim() || !targetTenantId) {
      toast.error(t(($) => $['copyToTenant.fieldRequired'], { ns: 'app' }))
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
      <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
        <DialogContent className={cn('w-full !max-w-[480px]', 'px-8')}>
          <DialogClose
            render={
              <IconButton
                aria-label={t(($) => $['operation.close'], { ns: 'common' })}
                className="absolute top-6 right-6"
              >
                <span aria-hidden className="i-ri-close-line size-4" />
              </IconButton>
            }
          />
          <DialogTitle className="relative mt-3 mb-9 text-xl leading-[30px] font-semibold text-text-primary">
            {t(($) => $['copyToTenant.title'], { ns: 'app' })}
          </DialogTitle>
          <div className="mb-9 space-y-6 system-sm-regular text-text-secondary">
            <div className="space-y-2">
              <div className="text-sm font-medium text-text-primary">
                {t(($) => $['copyToTenant.name'], { ns: 'app' })}
              </div>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full"
                placeholder={t(($) => $['copyToTenant.namePlaceholder'], { ns: 'app' })}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-text-primary">
                {t(($) => $['copyToTenant.targetWorkspace'], { ns: 'app' })}
              </div>
              <Select
                value={targetTenantId}
                onValueChange={(value) => setTargetTenantId(value ?? '')}
              >
                <SelectTrigger className="h-10 w-full">
                  <span
                    className={selectedWorkspace ? 'text-text-primary' : 'text-text-placeholder'}
                  >
                    {selectedWorkspace?.name ||
                      t(($) => $['copyToTenant.targetWorkspacePlaceholder'], { ns: 'app' })}
                  </span>
                </SelectTrigger>
                <SelectContent className="w-[var(--trigger-width)]">
                  {selectableWorkspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <SelectItemText>{workspace.name}</SelectItemText>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <Button className="ml-2 w-24" variant="primary" onClick={submit}>
              {t(($) => $.duplicate, { ns: 'app' })}
            </Button>
            <Button className="w-24" onClick={onHide}>
              {t(($) => $['operation.cancel'], { ns: 'common' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CopyToTenantModal
