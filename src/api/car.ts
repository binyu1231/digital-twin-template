import { api } from './core'

export function getVisitedCars() {
  return api.get('/xxxx', undefined, {
    adapter: [
      { img: 'http://baidu.com', code: '辽C00000', tel: '18799029923', parking: 6, stay: 12 }
    ]
  })
}