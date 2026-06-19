import preferences from '@ohos.data.preferences'
import common from '@ohos.app.ability.common'

export class StorageService {
  private static pref: preferences.Preferences | null = null
  private static context: common.UIAbilityContext | null = null

  static init(context: common.UIAbilityContext) {
    StorageService.context = context
    try {
      StorageService.pref = preferences.getPreferencesSync(context, { name: 'focal_storage' })
    } catch (e) {
      console.error('Storage init error:', e)
    }
  }

  static save(key: string, value: object | string | number) {
    if (!StorageService.pref) return
    try {
      StorageService.pref.putSync(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage save error:', e)
    }
  }

  static load(key: string, defaultValue: object): object {
    if (!StorageService.pref) return defaultValue
    try {
      const v = StorageService.pref.getSync(key, '') as string
      if (!v) return defaultValue
      const result: object = JSON.parse(v)
      return result
    } catch (e) {
      return defaultValue
    }
  }

  static loadNumber(key: string, defaultValue: number): number {
    if (!StorageService.pref) return defaultValue
    try {
      const v = StorageService.pref.getSync(key, '') as string
      if (!v) return defaultValue
      const result: object = JSON.parse(v)
      return typeof result === 'number' ? result : defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  static loadString(key: string, defaultValue: string): string {
    if (!StorageService.pref) return defaultValue
    try {
      const v = StorageService.pref.getSync(key, '') as string
      if (!v) return defaultValue
      const result: object = JSON.parse(v)
      return typeof result === 'string' ? result : defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  static remove(key: string) {
    if (!StorageService.pref) return
    try {
      StorageService.pref.deleteSync(key)
    } catch (e) {}
  }

  static getAllKeys(): string[] {
    if (!StorageService.pref) return []
    try {
      const all = StorageService.pref.getAllSync() as Record<string, preferences.ValueType>
      return Object.keys(all)
    } catch (e) {
      return []
    }
  }

  static getStorageSize(): number {
    let total = 0
    const keys = StorageService.getAllKeys()
    for (const key of keys) {
      if (key.startsWith('focal_')) {
        try {
          const v = StorageService.pref?.getSync(key, '') as string
          if (v) total += v.length
        } catch (e) {}
      }
    }
    return total
  }
}
