import { defineMock } from './define'

const data = [
  {
    id: 1,
    name: 'L1-核心架构',
    children: [
      {
        id: 11,
        name: 'L2-前端技术栈',
        children: [
          { id: 111, name: 'L3-状态管理(React)' },
          { id: 112, name: 'L3-UI组件库(Vue)' },
          { id: 113, name: 'L3-构建工具链' },
        ],
      },
      {
        id: 12,
        name: 'L2-后端微服务',
        children: [
          { id: 121, name: 'L3-认证网关' },
          { id: 122, name: 'L3-消息队列' },
          { id: 123, name: 'L3-数据缓存' },
          { id: 124, name: 'L3-定时任务' },
        ],
      },
      {
        id: 13,
        name: 'L2-DevOps',
        children: [
          { id: 131, name: 'L3-CI/CD管道' },
          { id: 132, name: 'L3-容器编排' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'L1-业务中台',
    children: [
      {
        id: 21,
        name: 'L2-用户中心',
        children: [
          { id: 211, name: 'L3-注册登录' },
          { id: 212, name: 'L3-权限管理' },
          { id: 213, name: 'L3-个人中心' },
        ],
      },
      {
        id: 22,
        name: 'L2-订单系统',
        children: [
          { id: 221, name: 'L3-购物车' },
          { id: 222, name: 'L3-支付网关' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'L1-数据平台',
    children: [
      {
        id: 31,
        name: 'L2-数据分析',
        children: [
          { id: 311, name: 'L3-用户行为追踪' },
          { id: 312, name: 'L3-可视化报表' },
        ],
      },
      {
        id: 32,
        name: 'L2-大数据处理',
        children: [
          { id: 321, name: 'L3-实时计算' },
          { id: 322, name: 'L3-离线批处理' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'L1-人工智能',
    children: [
      {
        id: 41,
        name: 'L2-机器学习',
        children: [
          { id: 411, name: 'L3-推荐算法' },
          { id: 412, name: 'L3-图像识别' },
        ],
      },
      {
        id: 42,
        name: 'L2-NLP',
        children: [
          { id: 421, name: 'L3-文本分类' },
          { id: 422, name: 'L3-语音合成' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'L1-物联网',
    children: [
      {
        id: 51,
        name: 'L2-设备管理',
        children: [
          { id: 511, name: 'L3-设备接入' },
          { id: 512, name: 'L3-状态监控' },
        ],
      },
      {
        id: 52,
        name: 'L2-边缘计算',
        children: [
          { id: 521, name: 'L3-数据清洗' },
          { id: 522, name: 'L3-规则引擎' },
        ],
      },
    ],
  },
  // 新增以下数据
  {
    id: 6,
    name: 'L1-区块链',
    children: [
      {
        id: 61,
        name: 'L2-智能合约',
        children: [
          { id: 611, name: 'L3-Solidity开发' },
          { id: 612, name: 'L3-合约审计' },
        ],
      },
      {
        id: 62,
        name: 'L2-分布式存储',
        children: [
          { id: 621, name: 'L3-IPFS节点' },
          { id: 622, name: 'L3-数据加密' },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'L1-元宇宙',
    children: [
      {
        id: 71,
        name: 'L2-虚拟现实',
        children: [
          { id: 711, name: 'L3-3D建模' },
          { id: 712, name: 'L3-AR交互' },
        ],
      },
      {
        id: 72,
        name: 'L2-数字孪生',
        children: [
          { id: 721, name: 'L3-物理仿真' },
          { id: 722, name: 'L3-实时渲染' },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'L1-安全合规',
    children: [
      {
        id: 81,
        name: 'L2-网络安全',
        children: [
          { id: 811, name: 'L3-渗透测试' },
          { id: 812, name: 'L3-漏洞扫描' },
        ],
      },
      {
        id: 82,
        name: 'L2-数据合规',
        children: [
          { id: 821, name: 'L3-GDPR合规' },
          { id: 822, name: 'L3-审计日志' },
        ],
      },
    ],
  },
];


export default defineMock({
  url     : '/api/tree/list',
  method  : 'get',
  response: () => {
    return data
  },
})
