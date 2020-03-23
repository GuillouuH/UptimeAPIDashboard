<template>
    <div id="adminuser">   
        <AddUserModal :user="newUser" @saveAddUser="saveAddUser"></AddUserModal>
        <Toast ref="toastComponent" :message="message"></Toast>
        <AdminHeader></AdminHeader>
        <div class="container-fluid m-2">
            <AdminBreadcrumb :data="breadcrumb"></AdminBreadcrumb>
            <div class="card border-primary p-4">
                <table class="table">
                    <thead>
                        <th scope="col">Email</th>
                        <th scope="col">Name</th>
                        <th scope="col" class="text-right">Actions</th>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in users" :key="index">
                            <td>{{user.email}}</td>
                            <td class="cible">{{user.username}}</td>
                            <td class="text-right">
                                <div class="destActions btn-group float-right" role="group">
                                    <button type="button" class="btn btn-danger" @click="deleteUser" :data-id="user._id"><span class="fas fa-trash-alt" aria-hidden="true"></span></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="12">
                                <div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-success addDest btn-lg" @click="addUser"><span class="fas fa-plus" aria-hidden="true"></span></button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import AdminBreadcrumb from '@/components/Admin/Breadcrumb';
import AddUserModal from '@/components/Admin/AddUserModal';
import Toast from '@/components/Admin/Toast';

import axios from 'axios'

export default {
    name: 'AdminUser',
    components: {
        AdminHeader, AdminBreadcrumb, AddUserModal, Toast
    },
    data(){
        return {
            breadcrumb : this.$route.meta.breadcrumb,
            users : null,
            newUser : {username: "", email: "", password: ""},
            message: {text:"", type:""},
        }
    },
    mounted(){
        this.getUsers()
    },
    methods: {
        getUsers : function(){
            let url = process.env.urlAPI+'users';
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(resp => {
                this.users = resp.data;
            });
        },
        addUser : function(){
            $(".modal").modal("show")
        },
        saveAddUser: function(){
            if(this.checkUser(this.newUser).length > 0)
                alert(this.checkUser(this.newUser).join("\n"));
            else {
                let url = process.env.urlAPI+'users';
                axios.post(url, this.newUser, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success === false){
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "error";
                    } else {
                        this.message.text = "L'utilisateur a été ajouté avec succés";
                        this.message.type = "success";
                        this.getUsers();

                    }
                    $(".modal").modal("hide")
                    this.$refs.toastComponent.openToast();
                });

            }
        },
        deleteUser(e){
            let id = e.currentTarget.getAttribute("data-id");
            if(confirm('Vous êtes sur le point de supprimer cet utilisateur. Voulez-vous continuer?')){
                let url = process.env.urlAPI+'users?id='+id;
                axios.delete(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success){
                        this.message.text = "Utilisateur supprimé avec succés";
                        this.message.type = "success";
                        this.getUsers();
                    } else {
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "error";
                    }
                });
                this.$refs.toastComponent.openToast();
            }
        },
        checkUser: function(user){
            let errors = [];

            if(user.username === "")
                errors.push("Vous devez définir un nom d'utilisateur")
            
            if(user.email === "")
                errors.push("L'email ne peut pas être vide")
            else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(user.email)){
                errors.push("L'adresse email saisie n'est pas valide")
            }
            if(user.password === "")
                errors.push("Vous devez définir un mot de passe")

            return errors = [];
        }
    }
}
</script>
<style scoped>
    .admin-button {
        height:200px;
    }

    table.table thead, table.table tfoot  {
        background : #ffffff !important;
        color : #212529 !important;
    }
    table.table tr td {
        text-align: left;
    }
</style>