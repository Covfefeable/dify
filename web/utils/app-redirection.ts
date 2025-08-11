import { fetchInstalledAppList } from '@/service/explore'
import type { AppMode } from '@/types/app'
import { basePath } from './var'
import Toast from '@/app/components/base/toast'

export const getRedirectionPath = (
  isCurrentWorkspaceEditor: boolean,
  app: { id: string, mode: AppMode },
) => {
  if (!isCurrentWorkspaceEditor) {
    return `/app/${app.id}/overview`
  }
  else {
    if (app.mode === 'workflow' || app.mode === 'advanced-chat')
      return `/app/${app.id}/workflow`
    else
      return `/app/${app.id}/configuration`
  }
}

export const getRedirection = async (
  isCurrentWorkspaceEditor: boolean,
  app: { id: string, mode: AppMode },
  redirectionFunc: (href: string) => void,
) => {
  if (!isCurrentWorkspaceEditor) {
    // redirectionFunc(`/app/${app.id}/overview`)
    try {
      const { installed_apps }: any = await fetchInstalledAppList(app.id) || {}
      if (installed_apps?.length > 0)
        window.open(`${basePath}/explore/installed/${installed_apps[0].id}`, '_blank')
      else
        throw new Error('No app found in Explore')
    }
    catch (e: any) {
      Toast.notify({ type: 'error', message: `${e.message || e}` })
    }
  }
  else {
    if (app.mode === 'workflow' || app.mode === 'advanced-chat')
      redirectionFunc(`/app/${app.id}/workflow`)
    else
      redirectionFunc(`/app/${app.id}/configuration`)
  }
}
