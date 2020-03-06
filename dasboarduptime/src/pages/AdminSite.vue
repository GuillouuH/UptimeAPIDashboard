<template>
    <div id="adminsite">   
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                <div class="row">
                    <div class="col-12 form-group">
                        <label for="selectaccount">Séléctionner un compte</label>
                        <select class="form-control" id="selectaccount" v-model="selectedAccount" v-on:change="modifySelectedAccount">
                            <option value="0">-</option>
                            <option v-for="(account, idx) in accounts" :key="idx" :value="account._id">{{account.email}}</option>
                        </select>
                    </div>
                </div>
                <table v-if="sites !== null" class="table-fixed table table-hover table-striped table-lg" id="data">
                    <thead class="table-header">
                        <tr>
                            <th class="w-25 text-left" scope="col">Nom</th>
                            <th class="w-50 text-left">Url</th>
                            <th class="w-25 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(site, idx) in sites" :key="idx">
                            <td class="text-left">{{site.name}}</td>
                            <td class="text-left"><a :href="site.url" target="_blank">{{site.url}}</a></td>
                            <td class="text-right">
                                <div class="btn-group float-right" role="group">
                                    <button type="button" class="btn btn-secondary"><span class="fas fa-pencil-alt mr-2" aria-hidden="true"></span>Editer</button>
                                    <button type="button" class="btn btn-danger"><span class="fas fa-trash-alt mr-2" aria-hidden="true"></span>Modifier</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';
import axios from 'axios'

export default {
    name: 'AdminSite',
    components: {
        AdminHeader, AdminBreadcrumb
    },
    data(){
        return {
            breadcrumb : this.$route.meta.breadcrumb,
            accounts : null,
            sites : null,
            selectedAccount: 0
        }
    },
    mounted(){
        this.getAccounts()
    },
    methods :{
        getAccounts: function(){
            let url = process.env.urlAPI+'account'
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(response => {
                this.accounts = response.data
            });
        },
        modifySelectedAccount: function(){
            this.sites = null
            if(this.selectedAccount != ""){
                let url = process.env.urlAPI+'sitesbyaccount?id='+this.selectedAccount
                axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    this.sites = response.data
                });
            }
        }
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }
</style>