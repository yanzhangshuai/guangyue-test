import type { Directive, Plugin } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export function definePlugin<Option = unknown[]>(v: Plugin<Option>) {
  return v
}

export function defineService<T>(v: T) {
  return () => v
}
