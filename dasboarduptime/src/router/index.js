import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/pages/Result.vue'
import Details from '@/pages/Details.vue'
import Dashboard from '@/pages/Dashboard.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Result',
            component: Result
        },
        {
            path: '/details/:id/:year',
            name: 'Details',
            component: Details,
            props: true,
        },
        {
            path: '/account/:id/:year',
            name: 'History',
            component:Result
        },
        {
            path: '/account/:id/:year',
            name: 'Account',
            component:Result
        },
        {
            path: '/dashboard/:year/:id/',
            name: 'Dashboard',
            component:Dashboard
        }
    ]
})
