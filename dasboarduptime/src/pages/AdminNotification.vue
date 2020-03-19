<template>
    <div id="adminnotification">   
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                Adinistration des notifications
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';

import axios from 'axios'

export default {
    name: 'AdminNoitification',
    components: {
        AdminHeader, AdminBreadcrumb
    },
    data(){
        return {
            breadcrumb : this.$route.meta.breadcrumb,
            notificationgroups: null
        }
    },
    mounted(){
        this.getNotificationGroups()
    },
    methods: {
        getNotificationGroups : function(){
            let url = process.env.urlAPI+'notificationgroups';
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(resp => {
                console.log(resp.data)
                this.notificationgroups = resp.data;
            });
        }
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }
</style>