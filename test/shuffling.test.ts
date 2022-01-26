/* eslint-disable no-console */
import BN from 'bn.js'
import { mangataInstance } from './mangataInstanceCreation'
import { getXoshiro } from '../src/utils/getXorshiroStates'
import recreateExtrinsicsOrder from '../src/utils/recreateExtrinsicsOrder'

describe('compare with rust impl', () => {
  it('reference test', () => {
    const input: [string, number][] = [
      ['A', 1],
      ['A', 2],
      ['A', 3],
      ['A', 4],
      ['A', 5],
      ['A', 6],
      ['A', 7],
      ['A', 8],
      ['A', 9],
      ['B', 11],
      ['B', 12],
      ['B', 13],
      ['B', 14],
      ['B', 15],
      ['B', 16],
      ['B', 17],
      ['B', 18],
      ['B', 19],
      ['C', 21],
      ['C', 22],
      ['C', 23],
      ['C', 24],
      ['C', 25],
      ['C', 26],
      ['C', 27],
      ['C', 28],
      ['C', 29],
    ]
    const seed = new Uint8Array([
      0xe3, 0x25, 0x1f, 0x26, 0x2a, 0xf5, 0xd9, 0xcf, 0xa7, 0xf0, 0x53, 0xd4, 0x44, 0xe4, 0xcb,
      0xe4, 0x26, 0x9a, 0xa4, 0x30, 0xff, 0x5b, 0x69, 0x3b, 0xc2, 0x3d, 0xaa, 0xf8, 0x0d, 0xc0,
      0xa7, 0x3a,
    ])

    expect(recreateExtrinsicsOrder(input, seed)).toEqual([
      21, 1, 11, 22, 2, 12, 23, 3, 13, 14, 24, 4, 15, 25, 5, 16, 26, 6, 27, 7, 17, 28, 8, 18, 19,
      29, 9,
    ])
  })
})