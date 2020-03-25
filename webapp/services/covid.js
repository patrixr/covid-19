import axios      from 'axios'
import { cached } from 'tronicache'
import url        from 'url'

const apiKey    = '6161edd7c8mshfacce043a416a70p1eca89jsn07e54a600601'
const baseUrl   = /prod/.test(process.env.NODE_ENV) ? 'https://coronavirus-monitor.p.rapidapi.com/coronavirus' : 'http://localhost:8000';

export default cached({
  cache: true,
  timeout:  30 * 60 * 1000,

  async countries() {
    const stats = await this.perCountryStats();

    return stats.map(s => s['country_name']);
  },

  async perCountryStats() {
    const data = await this.uncached.get('/cases_by_country.php');
    return data['countries_stat'];
  },

  uncached: {
    cache: false,

    async get(endpoint) {
      const headers = {
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      }

      const { data } = await axios.get(baseUrl + endpoint, { headers });
      return data
    }
  }
});
