import { defineMock } from './define'

const data = [
  {
    id      : 1,
    name    : '第一层-1',
    children: [
      {
        id      : 11,
        name    : '第二层-1-1',
        children: [
          {
            id  : 111,
            name: '第三层-1-1-1',
          },
          {
            id  : 112,
            name: '第三层-1-1-2',
          },
        ],
      },
      {
        id      : 12,
        name    : '第二层-1-2',
        children: [
          {
            id  : 121,
            name: '第三层-1-2-1',
          },
          {
            id  : 121,
            name: '第三层-1-2-2',
          },
          {
            id  : 121,
            name: '第三层-1-2-3',
          },
        ],
      },
    ],

  },
  {
    id      : 2,
    name    : '第一层-2',
    children: [
      {
        id      : 21,
        name    : '第二层-2-1',
        children: [
          {
            id  : 211,
            name: '第三层-2-1-1',
          },
          {
            id  : 212,
            name: '第三层-2-1-2',
          },
          {
            id  : 213,
            name: '第三层-2-1-3',
          },
        ],
      },
      {
        id      : 22,
        name    : '第二层-2-2',
        children: [
          {
            id  : 221,
            name: '第三层-2-2-1',
          },
          {
            id  : 222,
            name: '第三层-2-2-2',
          },
        ],
      },
    ],
  },
  {
    id      : 3,
    name    : '第一层-3',
    children: [
      {
        id      : 31,
        name    : '第二层-3-1',
        children: [
          {
            id  : 311,
            name: '第三层-3-1-1',
          },
          {
            id  : 312,
            name: '第三层-3-1-2',
          },
        ],
      },
      {
        id      : 32,
        name    : '第二层-3-2',
        children: [
          {
            id  : 321,
            name: '第三层-3-2-1',
          },
          {
            id  : 322,
            name: '第三层-3-2-2',
          },
        ],
      },

    ],
  },
  {
    id      : 4,
    name    : '第一层-4',
    children: [
      {
        id      : 41,
        name    : '第二层-4-1',
        children: [
          {
            id  : 411,
            name: '第三层-4-1-1',
          },
          {
            id  : 412,
            name: '第三层-4-1-2',
          },
        ],
      },
      {
        id      : 42,
        name    : '第二层-4-2',
        children: [
          {
            id  : 421,
            name: '第三层-4-2-1',
          },
          {
            id  : 422,
            name: '第三层-4-2-2',
          },
        ],
      },
      {
        id      : 43,
        name    : '第二层-4-3',
        children: [
          {
            id  : 431,
            name: '第三层-4-3-1',
          },
          {
            id  : 432,
            name: '第三层-4-3-2',
          },
        ],
      },
      {
        id      : 44,
        name    : '第二层-4-4',
        children: [
          {
            id  : 441,
            name: '第三层-4-4-1',
          },
          {
            id  : 442,
            name: '第三层-4-4-2',
          },
        ],
      },
    ],
  },
  {
    id      : 5,
    name    : '第一层-5',
    children: [
      {
        id      : 51,
        name    : '第二层-5-1',
        children: [
          {
            id  : 511,
            name: '第三层-5-1-1',
          },
          {
            id  : 512,
            name: '第三层-5-1-2',
          },
        ],
      },
      {
        id      : 52,
        name    : '第二层-5-2',
        children: [
          {
            id  : 521,
            name: '第三层-5-2-1',
          },
          {
            id  : 522,
            name: '第三层-5-2-2',
          },
        ],
      },
    ],
  },
]

export default defineMock({
  url     : '/api/tree/list',
  method  : 'get',
  response: () => {
    return data
  },
})
