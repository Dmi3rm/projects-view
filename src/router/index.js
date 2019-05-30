import Vue from 'vue'
import VueRouter from 'vue-router'

import PersonalPage from '@/components/PersonalPage/PersonalPage.vue'
import Graphs3D from '@/components/GraphsPage/GraphsPage.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'PersonalPage',
      component: PersonalPage
    },
    {
      path: '/3dgraphs',
      name: '3DGraphs',
      component: Graphs3D,
    }
  ],
  mode:'history'
})
