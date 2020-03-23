<template>
    <div id="admin">   
        <AdminHeader></AdminHeader>
        <div class="container-fluid">
            <div class="card border-primary p-4">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="card text-white bg-primary p-2 mb-2">
                            <router-link to="/admin/sites" class="card-block text-light text-center stretched-link text-decoration-none">
                                <div class="card-body">
                                    <h4 class="card-title "><span class="fa fa-globe fa-fw fa-3x" data-original-title="" title=""></span></h4>
                                    <p class="card-text">Sites</p>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card text-white bg-secondary p-2 mb-2">
                            <router-link to="/admin/notifications" class="card-block text-light text-center stretched-link text-decoration-none">
                                <div class="card-body">
                                <h4 class="card-title "><span class="fa fa-bell fa-fw fa-3x" data-original-title="" title=""></span></h4>
                                <p class="card-text">Notifications</p>
                                </div>
                            </router-link >
                        </div>
                    </div>
                    <!--<div class="col-sm-3">
                        <div class="card text-white bg-success p-2 mb-2">
                            <router-link to="/admin/accounts" class="card-block text-light text-center stretched-link text-decoration-none">
                                <div class="card-body">
                                <h4 class="card-title "><span class="fa fa-user-alt fa-fw fa-3x" data-original-title="" title=""></span></h4>
                                <p class="card-text">Comptes</p>
                                </div>
                            </router-link >
                        </div>
                    </div>-->
                    <div class="col-sm-4">
                        <div class="card text-white bg-info p-2 mb-2">
                            <router-link to="/admin/users" class="card-block text-light text-center stretched-link text-decoration-none">
                                <div class="card-body">
                                <h4 class="card-title "><span class="fa fa-user-alt fa-fw fa-3x" data-original-title="" title=""></span></h4>
                                <p class="card-text">Utilisateurs</p>
                                </div>
                            </router-link >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';

export default {
    name: 'Admin',
    components: {
        AdminHeader
    },
    data(){
        return {
            
        }
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }
</style>