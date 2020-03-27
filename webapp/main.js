import Vue                  from 'vue'
import router               from "./router"
import App                  from './App'
import ElementUI            from 'element-ui'
import locale               from 'element-ui/lib/locale/lang/en'
import { library }          from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon }  from '@fortawesome/vue-fontawesome'
import VueCompositionApi    from "@vue/composition-api";
import VueApexCharts        from 'vue-apexcharts'

Vue.use(VueCompositionApi);

Vue.component('apexchart', VueApexCharts)

import {
  faWeight,
  faPercent,
  faChartBar,
  faShoePrints,
  faBurn,
  faRunning,
  faRoute
} from '@fortawesome/free-solid-svg-icons'

import './styles/theme/index.css';
import './styles/animate.css';
import './styles/main.scss';
import './filters'

// -- Composition
Vue.use(VueCompositionApi);

// --> Element UI
Vue.use(ElementUI, { locale });

// --> Font aweomse
library.add(faHeartbeat, faWeight, faPercent, faChartBar, faShoePrints, faBurn, faRunning, faRoute);
Vue.component('fa-icon', FontAwesomeIcon);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");