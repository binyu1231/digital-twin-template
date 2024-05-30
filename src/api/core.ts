import { Asker } from '@coloration/asker'


export const api = new Asker({
  after(res) {
    return res.data
  }
})