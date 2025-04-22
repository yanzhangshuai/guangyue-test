import { ref, unref } from 'vue'
import { set } from '@vueuse/core'

type AsyncFn<T> = () => Promise<T>

type Options<T> = Partial<{
  immediate   :     boolean
  initialValue:  T
  onSuccess   :     (data: T) => void
  onFailure   :     (error?: unknown, data?: T) => void
  onError     :       (error: unknown) => void
}>

/**
 * useAsync 一个简单的异步加载函数，封装了异步函数的调用，以及状态的管理
 * 如果有复杂场景，可以使用 @tanstack/vue-query
 * @param fn async function
 * @param options options
 * @returns { data, error, isLoading, execute }
 */
export function useAsync<T>(fn: AsyncFn<T>, options?: Options<T>) {
  const data      = ref<T>()
  const error     = ref<unknown>()
  const isLoading = ref(false)

  async function execute() {
    set(isLoading, true)
    set(data, options?.initialValue)
    set(error, null)

    try {
      const r = await fn()
      set(data, r)
      options?.onSuccess?.(unref(data)!)
    }
    catch (err) {
      set(error, err)
      options?.onError?.(err)
    }
    finally {
      set(isLoading, false)
      options?.onFailure?.(unref(error), unref(data))
    }
  }

  // 立即执行
  if (options?.immediate) {
    execute()
  }

  return { data, error, isLoading, execute }
}
