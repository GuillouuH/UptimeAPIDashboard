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
                                            <td class="cible">{{cible.cible}}</td>
                                            <td class="cibleEdit d-none"><input type="email" class="form-control" placeholder="destinataire" v-model="editDest"></td>
                                            <td class="text-right">
                                                <div class="destActions btn-group float-right" role="group">
                                                    <button type="button" class="btn btn-secondary d-inline" @click="editDestinataire" :data-cible="cible.cible"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                                                    <button type="button" class="btn btn-danger" @click="deleteDestinataire" :data-group-id="group._id" :data-index="index"><span class="fas fa-trash-alt" aria-hidden="true"></span></button>
                                                </div>
                                                <div class="editDestActions btn-group float-right d-none" role="group">
                                                    <button type="button" class="btn btn-success d-inline" @click="saveEditDestinataire" :data-group-id="group._id" :data-index="index"><span class="fas fa-check" aria-hidden="true"></span></button>
                                                    <button type="button" class="btn btn-danger" @click="cancelEdit"><span class="fas fa-times" aria-hidden="true"></span></button>
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
            newDest : "",
            editDest : ""
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
        addDestinataire: function(e){
            $(e.currentTarget.closest("table")).find(".addForm").removeClass('d-none')
            $(e.currentTarget.closest("table")).find(".saveAdd").removeClass('d-none')
            $(e.currentTarget.closest("table")).find(".addDest").addClass('d-none')
        },
        deleteDestinataire: function(e){
            let groupId = e.currentTarget.getAttribute("data-group-id");
            let index = e.currentTarget.getAttribute("data-index");
            let groupConcerned = this.notificationgroups.find(e => e._id === groupId);
            if(groupConcerned.cibles.length > 1){
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
            } else {
                alert("Le groupe doit contenir au moins un destinataire.")
            }
        },
        editDestinataire: function(e){
            let cible = e.currentTarget.getAttribute("data-cible");
            $(e.currentTarget.closest("td")).find(".destActions").addClass("d-none")
            $(e.currentTarget.closest("td")).find(".editDestActions").removeClass("d-none")
            $(e.currentTarget.closest("tr")).find(".cible").addClass("d-none")
            $(e.currentTarget.closest("tr")).find(".cibleEdit").removeClass("d-none")
            this.editDest = cible

        },
        saveEditDestinataire: function(e){
            if(this.checkIfDestValid(this.editDest).length > 0)
                alert(this.checkIfDestValid(this.editDest).join("\n"));
            else {
                let groupId = e.currentTarget.getAttribute("data-group-id");
                let index = e.currentTarget.getAttribute("data-index");
                let groupConcerned = this.notificationgroups.find(e => e._id === groupId);
                groupConcerned.cibles[index].cible = this.editDest;
                let data = {group_id: groupId, cibles: groupConcerned.cibles};
                let url = process.env.urlAPI+'notificationgroups';
                axios.put(url, data, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success === false){
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "error";
                    } else {
                        this.message.text = "L'email a été modifié avec succés";
                        this.message.type = "success";
                    }
                    this.$refs.toastComponent.openToast();
                });
            }
            this.cancelEdit(e)

        },
        cancelEdit: function(e){
            $(e.currentTarget.closest("td")).find(".destActions").removeClass("d-none")
            $(e.currentTarget.closest("td")).find(".editDestActions").addClass("d-none")
            $(e.currentTarget.closest("tr")).find(".cible").removeClass("d-none")
            $(e.currentTarget.closest("tr")).find(".cibleEdit").addClass("d-none")
            this.editDest = ""
        },
        saveDestinataire: function(e){
            if(this.checkIfDestValid(this.newDest).length > 0)
                alert(this.checkIfDestValid(this.newDest).join("\n"));
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
                        $(e.currentTarget.closest("table")).find(".addForm").addClass('d-none')
                        $(e.currentTarget.closest("table")).find(".saveAdd").addClass('d-none')
                        $(e.currentTarget.closest("table")).find(".addDest").removeClass('d-none')
                    }
                    this.$refs.toastComponent.openToast();
                });
            }
        },
        checkIfDestValid(dest){
            let errors = []

            if(dest === "")
                errors.push("L'adresse email ne peut pas être vide")
            else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(dest)){
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