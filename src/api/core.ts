import { Asker } from '@coloration/asker'


export const api = new Asker({
  baseUrl: 'http://abasd.com',
  after(res) {
    return res.data
  }
})