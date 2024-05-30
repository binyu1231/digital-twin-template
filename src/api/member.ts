import { api } from './core'
import { Asker } from '@coloration/asker'

export async function getVisitors() {
  return api.get('/visitors', {}, {
    adapter: async function () {
      return Asker.get('https://jsonplaceholder.typicode.com/users')
    }
  })
}