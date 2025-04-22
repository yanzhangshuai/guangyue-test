import axios from 'axios'
import { defineService } from '@/utils/define'

import type { TreeNode } from './type'

export const useTreeService = defineService({

  getTreeData() {
    return axios.get<TreeNode[]>('tree/list').then(res => res.data)
  },
})
