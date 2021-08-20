import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/pages/Result.vue'
import Details from '@/pages/Details.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import Admin from '@/pages/Admin.vue'
import AdminSite from '@/pages/AdminSite.vue'
import AdminAccount from '@/pages/AdminAccount.vue'
import AdminNotification from '@/pages/AdminNotification.vue'
import AdminUser from '@/pages/AdminUser.vue'
import AdminMyAccount from '@/pages/AdminMyAccount.vue'
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
            path: '/admin/',
            name: 'Admin',
            component:Admin,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/admin/sites',
            name: 'AdminSite',
            component:AdminSite,
            meta: {
                requiresAuth: true,
                breadcrumb : [
                    {name:'Accueil', link:Admin},
                    {name:'Sites'}
                ]
            }
        },
        {
            path: '/admin/accounts',
            name: 'AdminAccount',
            component:AdminAccount,
            meta: {
                requiresAuth: true,
                breadcrumb : [
                    {name:'Accueil', link:Admin},
                    {name:'Comptes'}
                ]
            }
        },
        {
            path: '/admin/users',
            name: 'AdminUser',
            component:AdminUser,
            meta: {
                requiresAuth: true,
                breadcrumb : [
                    {name:'Accueil', link:Admin},
                    {name:'Utilisateurs'}
                ]
            }
        },
        {
            path: '/admin/notifications',
            name: 'AdminNotifications',
            component:AdminNotification,
            meta: {
                requiresAuth: true,
                breadcrumb : [
                    {name:'Accueil', link:Admin},
                    {name:'Notifications'}
                ]
            }
        },
        {
            path: '/admin/myaccount',
            name: 'MyAccount',
            component: AdminMyAccount,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
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
