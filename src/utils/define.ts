import type { Plugin } from 'vue'

export function definePlugin<Option = unknown[]>(v: Plugin<Option>) {
  return v
}

export function defineService<T>(v: T) {
  return () => v
}
