import axios from 'axios'
import { defineService } from '@/utils/define'

import type { TreeNodeDto } from './type'

export const useTreeService = defineService({

  getTreeData() {
    return axios.get<TreeNodeDto[]>('tree/list').then(res => res.data)
  },
})
