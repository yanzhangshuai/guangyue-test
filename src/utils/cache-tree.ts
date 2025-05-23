interface TreeNode {
  [key: string]: any // 通用节点类型
  children?    : TreeNode[]
}

export class UniversalTreeCache<T extends TreeNode> {
  private cache = new Map<string, T>()
  private idKey: string // 标识节点唯一的属性名（如'id'/'key'）

  constructor(options: { idKey?: string } = {}) {
    this.idKey = options.idKey || 'key' // 默认使用'key'作为唯一标识
  }

  /**
   * 预缓存完整树结构
   * @param tree 目标树
   * @param options 缓存选项
   * @param options.overwrite 是否覆盖已有缓存
   * @param options.clear 是否清空已有缓存
   */
  precacheTree(tree: T[], options: { overwrite?: boolean, clear?: boolean } = {}) {
    if (options.clear)
      this.clear() // 清空缓存

    this._recursiveCache(tree, options.overwrite || false)
  }

  // 递归缓存实现
  private _recursiveCache(nodes: T[], overwrite: boolean) {
    nodes.forEach((node) => {
      const nodeId = node[this.idKey]
      if (overwrite || !this.cache.has(nodeId)) {
        this.cache.set(nodeId, node)
      }
      if (node.children) {
        this._recursiveCache(node.children as T[], overwrite)
      }
    })
  }

  // 查找节点（带缓存）
  find(target?: string, tree?: T[]): T | null {
    if (!target)
      return null

    if (this.cache.has(target)) {
      return this.cache.get(target)!
    }

    if (!tree)
      return null

    const found = this.bfsFind(tree, target) // 使用广度优先搜索

    if (found)
      this.cache.set(target, found)
    return found
  }

  // 广度优先搜索（避免递归栈溢出）
  private bfsFind(tree: T[], target: string): T | null {
    const queue = [...tree]

    while (queue.length > 0) {
      const node = queue.shift()!
      if (node[this.idKey] === target)
        return node
      if (node.children)
        queue.push(...node.children as T[])
    }
    return null
  }

  /** 清空所有缓存 */
  clear() {
    this.cache.clear()
  }
}
