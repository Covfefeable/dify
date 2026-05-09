import type { Plan } from '@/app/components/billing/type'
import type { IWorkspace } from '@/models/common'
import { Button } from '@langgenius/dify-ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectTrigger,
} from '@langgenius/dify-ui/select'
import { toast } from '@langgenius/dify-ui/toast'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@/app/components/base/divider'
import Input from '@/app/components/base/input'
import Modal from '@/app/components/base/modal'
import PlanBadge from '@/app/components/header/plan-badge'
import { useAppContext } from '@/context/app-context'
import { useWorkspacesContext } from '@/context/workspace-context'
import { createWorkspace, switchWorkspace } from '@/service/common'
import { basePath } from '@/utils/var'

type WorkplaceSelectorContentProps = {
  workspaces: IWorkspace[]
  popupClassName?: string
  showCreateWorkspace?: boolean
  onCreateWorkspace?: () => void
}

type WorkplaceSelectorItemProps = {
  workspace: IWorkspace
}

const WorkplaceSelectorItem = memo(({
  workspace,
}: WorkplaceSelectorItemProps) => (
  <SelectItem value={workspace.id} className="gap-2 py-1 pr-2 pl-3">
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-components-icon-bg-blue-solid text-[13px]">
      <span className="h-6 bg-gradient-to-r from-components-avatar-shape-fill-stop-0 to-components-avatar-shape-fill-stop-100 bg-clip-text align-middle leading-6 font-semibold text-shadow-shadow-1 uppercase opacity-90">
        {workspace.name[0]?.toLocaleUpperCase()}
      </span>
    </div>
    <SelectItemText className="system-md-regular">{workspace.name}</SelectItemText>
    <PlanBadge plan={workspace.plan as Plan} />
  </SelectItem>
))
WorkplaceSelectorItem.displayName = 'WorkplaceSelectorItem'

export const WorkplaceSelectorContent = memo(({
  workspaces,
  popupClassName = 'w-[280px] transition-none data-starting-style:scale-100 data-starting-style:opacity-100 data-ending-style:scale-100 data-ending-style:opacity-100',
  showCreateWorkspace = false,
  onCreateWorkspace,
}: WorkplaceSelectorContentProps) => {
  const { t } = useTranslation()

  return (
    <SelectContent popupClassName={popupClassName}>
      <SelectGroup>
        <div className="flex items-center justify-between pr-3">
          <SelectLabel>
            {t('userProfile.workspace', { ns: 'common' })}
          </SelectLabel>
          {showCreateWorkspace && (
            <button
              type="button"
              className="cursor-pointer text-blue-600 system-xs-medium"
              onClick={(e) => {
                e.preventDefault()
                onCreateWorkspace?.()
              }}
            >
              {t('userProfile.createWorkspace', { ns: 'common' })}
            </button>
          )}
        </div>
        {workspaces.map(workspace => (
          <WorkplaceSelectorItem key={workspace.id} workspace={workspace} />
        ))}
      </SelectGroup>
    </SelectContent>
  )
})
WorkplaceSelectorContent.displayName = 'WorkplaceSelectorContent'

const WorkplaceSelector = () => {
  const { t } = useTranslation()
  const { isCurrentWorkspaceManager } = useAppContext()
  const { workspaces } = useWorkspacesContext()
  const currentWorkspace = workspaces.find(v => v.current)
  const [isShowCreateWorkspace, setIsShowCreateWorkspace] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')

  const handleSwitchWorkspace = async (tenant_id: string) => {
    try {
      if (currentWorkspace?.id === tenant_id)
        return
      await switchWorkspace({ url: '/workspaces/switch', body: { tenant_id } })
      toast.success(t('actionMsg.modifiedSuccessfully', { ns: 'common' }))
      location.assign(`${location.origin}${basePath}`)
    }
    catch {
      toast.error(t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }))
    }
  }

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspace({ url: '/workspaces/create', body: { name: workspaceName } })
      setIsShowCreateWorkspace(false)
      setWorkspaceName('')
      toast.success(t('api.actionSuccess', { ns: 'common' }))
      location.assign(`${location.origin}${basePath}`)
    }
    catch {
      toast.error(t('provider.saveFailed', { ns: 'common' }))
    }
  }

  return (
    <>
      <Select
        value={currentWorkspace?.id ?? ''}
        onValueChange={(value) => {
          if (value)
            void handleSwitchWorkspace(value)
        }}
      >
        <SelectTrigger
          className="w-auto cursor-pointer rounded-[10px] border-0 bg-transparent p-0.5 hover:bg-state-base-hover data-popup-open:bg-state-base-hover"
        >
          <div className="flex items-center">
            <div className="mr-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-components-icon-bg-blue-solid text-[13px] max-[800px]:mr-0">
              <span className="h-6 bg-gradient-to-r from-components-avatar-shape-fill-stop-0 to-components-avatar-shape-fill-stop-100 bg-clip-text align-middle leading-6 font-semibold text-shadow-shadow-1 uppercase opacity-90">
                {currentWorkspace?.name[0]?.toLocaleUpperCase()}
              </span>
            </div>
            <div className="max-w-[149px] min-w-0 truncate system-sm-medium text-text-secondary max-[800px]:hidden">
              {currentWorkspace?.name}
            </div>
          </div>
        </SelectTrigger>
        <WorkplaceSelectorContent
          workspaces={workspaces}
          showCreateWorkspace={isCurrentWorkspaceManager}
          onCreateWorkspace={() => setIsShowCreateWorkspace(true)}
        />
      </Select>
      <Modal
        title={t('userProfile.createWorkspace', { ns: 'common' })}
        closable
        className="!w-[362px] !p-5"
        isShow={isShowCreateWorkspace}
        onClose={() => setIsShowCreateWorkspace(false)}
      >
        <Input
          value={workspaceName}
          onChange={e => setWorkspaceName(e.target.value)}
          placeholder={t('account.workspaceName', { ns: 'common' })}
          className="my-5 px-3 py-2.5"
        />
        <Divider className="m-0" />
        <div className="mt-4 flex items-start justify-end gap-2 self-stretch">
          <Button onClick={() => setIsShowCreateWorkspace(false)}>
            {t('iconPicker.cancel', { ns: 'app' })}
          </Button>
          <Button variant="primary" disabled={false} loading={false} onClick={handleCreateWorkspace}>
            {t('iconPicker.ok', { ns: 'app' })}
          </Button>
        </div>
      </Modal>
    </>
  )
}
export default WorkplaceSelector
