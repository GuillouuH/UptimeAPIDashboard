<template>
    <div id="adminuser">   
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                Adinistration des users
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';

export default {
    name: 'AdminUser',
    components: {
        AdminHeader, AdminBreadcrumb
    },
    data(){
        return {
            breadcrumb : this.$route.meta.breadcrumb
        }
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }
</style>