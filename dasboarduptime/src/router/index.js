import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/pages/Result.vue'
import Details from '@/pages/Details.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import axios from 'axios'
import  * as jwt from 'jsonwebtoken';

Vue.use(Router)

const router =  new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Result',
            component: Result,
            meta: { 
                requiresAuth: true
            }
        },
        {
            path: '/details/:id/:year',
            name: 'Details',
            component: Details,
            props: true,
            meta: { 
                requiresAuth: true
            }
        },
        {
            path: '/account/:id/:year',
            name: 'History',
            component:Result,
            meta: { 
                requiresAuth: true
            }
        },
        {
            path: '/account/:id/:year',
            name: 'Account',
            component:Result,
            meta: { 
                requiresAuth: true
            }
        },
        {
            path: '/dashboard/:year/:id/',
            name: 'Dashboard',
            component:Dashboard,
            meta: { 
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            params: {
                theme: 'dark'
            },
            component: Login,
            meta: { 
                requiresAuth: false
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt-connexion') == null) {
            next({
                name: 'Login',
                params : {
                    nextUrl:to.fullPath
                }
            })
        } else {
            next();
        }
    } else {
        next();
    }
});

// Intercepte les erreurs 401 et redirige sur la page de logIn en supprimant le token

axios.interceptors.response.use(
    response => response,
    error => {
        const {status} = error.response;
        if (status === 401) {
            localStorage.removeItem('jwt-connexion');
            router.push('login');
        }
   }
);

export default router;