import Vue          from "vue";
import Router       from "vue-router";
import LandingView  from "../views/Landing";
import _            from "lodash"

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: LandingView
    }
  ]
});

export default router;