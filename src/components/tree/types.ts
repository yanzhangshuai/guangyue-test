export interface TreeDataNode  {
  id        : number
  key       : string
  name      : string
  title     : string
  children? : TreeDataNode[]
  parentKey?: string
}

// 0: none, 1: 合并, 2: 移动之上, 3: 移动之下
export type ActionType = 0 | 1 | 2 | 3

export interface DragState {
  src   : string | undefined
  target: string | undefined
  action: ActionType
}
