import { api } from './core'
import { Asker } from '@coloration/asker'

export function getVisitors() {
  return api.get('/visi123123tors12323123123', {}, {
    adapter: function () {
      return Asker.get('https://jsonplaceholder.typicode.com/users')
    },
  })
}

export function getVisitorDetail(id: string) {
  return api.get('/asdasd', { id }, {
    adapter: { user: 'liang', age: 12, id }
  })
}