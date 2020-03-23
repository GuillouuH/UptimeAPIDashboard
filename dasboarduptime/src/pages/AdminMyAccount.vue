<template>
    <div id="admin-myaccount">
        <Toast ref="toastComponent" :message="message"></Toast>
        <AdminHeader></AdminHeader>
        <div class="container-fluid">
            <div class="card border-primary p-4" v-if="user !== null">
                 <div class="form-group">
                    <label for="userName">Mon nom d'utilisateur</label>
                    <input type="text" class="form-control" id="userName" placeholder="Entrer un nom" v-model="user.username">
                </div>
                <div class="form-group">
                    <label for="userEmail">Mon email</label>
                    <input type="text" class="form-control" id="userEmail" placeholder="Entrer un email" v-model="user.email">
                </div>
                <div class="form-group">
                    <label for="userPassword">Mon nouveau mot de passe</label>
                    <input type="text" class="form-control" id="userPassword" placeholder="Entrer un email" v-model="newPassword">
                </div>
                 <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-success addDest btn-lg" @click="saveUser">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AdminHeader from '@/components/Admin/Header';
import Toast from '@/components/Admin/Toast';

import axios from 'axios'

export default {
    name: 'AdminMyAccount',
    components: {
        AdminHeader, Toast
    },
    data(){
        return {
            message: {text:"", type:""},
            user: null,
            newPassword: ""
        }
    },
    mounted(){
        this.getUser()
    },
    methods: {
        getUser : function(){
            let url = process.env.urlAPI+'getmycredentials';
            axios.get(url, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
            then(resp => {
                this.user = resp.data;
            });
        },
        saveUser : function(){
            let userEdit = {id:this.user._id, username:this.user.username, email:this.user.email, newPassword: this.newPassword}
            if(confirm('Vous êtes sur le point de modifier votre compte. Voulez-vous continuer?')){
                let url = process.env.urlAPI+'users';
                axios.put(url, userEdit, {headers: { "user_token": localStorage.getItem('jwt-connexion')}}).
                then(response => {
                    if(response.data.success){
                        localStorage.setItem("jwt-connexion", response.data.token);
                        this.message.text = "Utilisateur modifié avec succés";
                        this.message.type = "success";
                    } else {
                        this.message.text = "Une erreur est survenue";
                        this.message.type = "danger";
                    }
                });

                this.$refs.toastComponent.openToast();
            }
        }
    }

}
</script>