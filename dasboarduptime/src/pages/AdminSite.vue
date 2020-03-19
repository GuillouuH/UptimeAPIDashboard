<template>
    <div id="adminsite">
        <Toast ref="toastComponent"></Toast>
        <EditSiteModal :site="siteEdited" :accounts="accounts" :notificationgroups="notificationgroups" @saveEdit="saveEdit"></EditSiteModal>
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
                <div class="table-responsive">
                    <table v-if="sites !== null" class="table-fixed table table-hover table-striped table-lg" id="data">
                        <thead class="table-header">
                            <tr>
                                <th class="text-left w-25" scope="col">Nom</th>
                                <th class="text-left w-50">Url</th>
                                <th class="text-right w-25">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="results">
                            <tr v-for="(site, idx) in sites" :key="idx">
                                <td class="text-left">{{site.name}}</td>
                                <td class="text-left "><a class="d-inline-block text-truncate" :href="site.url" target="_blank">{{site.url}}</a></td>
                                <td class="text-right">
                                    <div class="btn-group float-right" role="group">
                                        <button type="button" class="btn btn-secondary d-inline" @click="editSite" :data-id="site._id"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                                        <button type="button" class="btn btn-danger"><span class="fas fa-trash-alt" aria-hidden="true"></span></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import EditSiteModal from '@/components/Admin/EditSiteModal';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';
import Toast from '@/components/Admin/Toast';

import axios from 'axios'

export default {
    name: 'AdminSite',
    components: {
        AdminHeader, AdminBreadcrumb, EditSiteModal, Toast
    },
    data(){
        return {
            breadcrumb : this.$route.meta.breadcrumb,
            accounts : null,
            notificationgroups: null,
            sites : null,
            selectedAccount: 0,
            siteEdited : {id:"", name:"", url:"", account:"", notificationgroup: ""}
        }
    },
    mounted(){
        this.getAccounts()
        this.getNotificationGroups()
    },
    methods :{
        getAccounts: function(){
            let url = process.env.urlAPI+'account'
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(response => {
                this.accounts = response.data
            });
        },
        getNotificationGroups : function(){
            let url = process.env.urlAPI+'notificationgroups';
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(resp => {
                this.notificationgroups = resp.data;
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
        },
        editSite: function(e){
            let siteId = e.currentTarget.getAttribute("data-id");
            let siteConcerned = this.sites.find(e => e._id === siteId)
            this.siteEdited.id = siteConcerned._id;
            this.siteEdited.name = siteConcerned.name;
            this.siteEdited.url = siteConcerned.url;
            this.siteEdited.account = siteConcerned.Account;
            this.siteEdited.notificationgroup = siteConcerned.NotificationGroup
            console.log(this.siteEdited)
            $('.modal').modal('show')
        },
        saveEdit: function(e){
            let url = process.env.urlAPI+'sites';
            axios.put(url, this.siteEdited, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(response => {
                if(response.data.success === false){
                    alert("Une erreur est survenue");
                    $('.modal').modal('hide')
                } else {
                    $('.modal').modal('hide');
                    let siteConcerned = this.sites.find(e => e._id === this.siteEdited.id)
                    siteConcerned.name = this.siteEdited.name;
                    siteConcerned.url = this.siteEdited.url;
                    siteConcerned.Account = this.siteEdited.account;
                    siteConcerned.NotificationGroup = this.siteEdited.notificationgroup
                    this.$refs.toastComponent.openToast();
                }
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