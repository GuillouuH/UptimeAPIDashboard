<template>
    <div id="adminaccount">
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                Administration des comptes
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';

export default {
    name: 'AdminAccount',
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
