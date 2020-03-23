<template>
    <div id="adminnotification">   
        <Toast ref="toastComponent" :message="message"></Toast>
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                <div class="accordion" id="accordionExample">
                    <div class="card" v-for="(group, index) in notificationgroups" :key="index">
                        <div class="card-header notification-header" :id="'heading' + index">
                            <h2 class="mb-0">
                                <button class="btn btn-block text-left btn-link" type="button" data-toggle="collapse"  :data-target="'#collapse' + index" aria-expanded="true"  :aria-controls="'collapse' + index">
                                    {{group.name}}
                                    <!--<span class="fas fa-xs fa-chevron-down float-right down" aria-hidden="true"></span>
                                    <span class="fas fa-xs fa-chevron-up float-right up" aria-hidden="true"></span>-->
                                </button>
                            </h2>
                        </div>
                        <div :id="'collapse' + index" class="collapse" :aria-labelledby="'heading' + index" data-parent="#accordionExample">
                            <div class="card-body">
                                <table class="table">
                                    <thead>
                                        <th scope="col">Type</th>
                                        <th scope="col">Destinataire</th>
                                        <th scope="col" class="text-right">Actions</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cible, index) in group.cibles" :key="index">
                                            <td>{{cible.type}}</td>
                                            <td>{{cible.cible}}</td>
                                            <td class="text-right">
                                                <div class="btn-group float-right" role="group">
                                                    <button type="button" class="btn btn-secondary d-inline"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                                                    <button type="button" class="btn btn-danger" @click="deleteDestinataire" :data-group-id="group._id" :data-index="index"><span class="fas fa-trash-alt" aria-hidden="true"></span></button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr class="addForm d-none">
                                            <td>email</td>
                                            <td><input type="email" class="form-control" placeholder="destinataire" v-model="newDest"></td>
                                            <td class="text-right">
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="12">
                                                <div class="d-flex justify-content-center">
                                                    <button type="button" class="btn btn-success addDest btn-lg" @click="addDestinataire"><span class="fas fa-plus" aria-hidden="true"></span></button>
                                                    <button type="button" class="btn btn-success btn-lg saveAdd d-none" @click="saveDestinataire" :data-group-id="group._id">Enregistrer</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';
import Toast from '@/components/Admin/Toast';

import axios from 'axios'

export default {
    name: 'AdminNoitification',
    components: {
        AdminHeader, AdminBreadcrumb, Toast
    },
    data(){
        return {
            message: {test:"", type:""},
            breadcrumb : this.$route.meta.breadcrumb,
            notificationgroups: null,
            newDest : ""
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
                this.notificationgroups = resp.data;
            });
        },
        addDestinataire: function(){
            $(".addForm").removeClass('d-none')
            $(".saveAdd").removeClass('d-none')
            $(".addDest").addClass('d-none')
        },
        deleteDestinataire: function(e){
            let groupId = e.currentTarget.getAttribute("data-group-id");
            let index = e.currentTarget.getAttribute("data-index");
            let groupConcerned = this.notificationgroups.find(e => e._id === groupId);
            if(confirm("Vous êtes sur le point de supprimer un destinaire, voulez-vous continuer?")){
                groupConcerned.cibles.splice(index, 1);
                let data = {group_id: groupId, cibles: groupConcerned.cibles};
                let url = process.env.urlAPI+'notificationgroups';
                axios.put(url, data, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success === false){
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "error";
                    } else {
                        this.message.text = "L'email a bien été supprimé du groupe de notification";
                        this.message.type = "success";
                    }
                    
                    this.$refs.toastComponent.openToast();
                });
            }
        },
        saveDestinataire: function(e){
            if(this.checkIfNewDestValid().length > 0)
                alert(this.checkIfNewDestValid().join("\n"));
            else {
                let groupId = e.currentTarget.getAttribute("data-group-id");
                let groupConcerned = this.notificationgroups.find(e => e._id === groupId);
                groupConcerned.cibles.push({type: "email", cible:this.newDest});
                let data = {group_id: groupId, cibles: groupConcerned.cibles};
                let url = process.env.urlAPI+'notificationgroups';
                axios.put(url, data, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success === false){
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "error";
                    } else {
                        this.message.text = "L'email a bien été ajouté au groupe de notification";
                        this.message.type = "success";
                        $(".addForm").addClass('d-none')
                        $(".saveAdd").addClass('d-none')
                        $(".addDest").removeClass('d-none')
                    }
                    this.$refs.toastComponent.openToast();
                });
            }
        },
        checkIfNewDestValid(){
            let errors = []

            if(this.newDest === "")
                errors.push("L'adresse email ne peut pas être vide")
            else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(this.newDest)){
                errors.push("L'adresse email saisie n'est pas valide")
            }

            return errors
        }, 
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }
    .notification-header {
        background-color: rgba(0,0,0,.03) !important;
    }
    .notification-header .fas {
        color: #007bff
    }
    table.table thead, table.table tfoot  {
        background : #ffffff !important;
        color : #212529 !important;
    }
    table.table tr td {
        text-align: left;
    }

</style>