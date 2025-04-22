export interface TreeDataNode  {
  id        : number
  key       : string
  name      : string
  title     : string
  children? : TreeDataNode[]
  parentKey?: string
}

export interface DragState {
  srcNode   : TreeDataNode | null
  targetNode: TreeDataNode | null
}
