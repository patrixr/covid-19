import axios            from 'axios'
import { cached }       from 'tronicache'
import { API_ENDPOINT } from '../config'

export default cached({
  cache: true,
  timeout:  30 * 60 * 1000,

  async countries() {
    return this.uncached.get('/countries');
  },

  async history() {
    return this.uncached.get('/history');
  },

  uncached: {
    cache: false,

    async get(endpoint) {
      const { data } = await axios.get(API_ENDPOINT + endpoint);
      return data
    }
  }
});
