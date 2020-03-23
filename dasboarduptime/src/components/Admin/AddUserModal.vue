<template>
    <div id="admin_add_user">
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajout d'un utilisateur</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="newUserName">Nom</label>
                            <input type="text" class="form-control" id="newUserName" placeholder="Entrer un nom" v-model="user.username">
                        </div>
                        <div class="form-group">
                            <label for="newUserEmail">Email</label>
                            <input type="text" class="form-control" id="newUserEmail" placeholder="Entrer un email" v-model="user.email">
                        </div>
                        <div class="form-group">
                            <label for="newUserPassword">Mot de passe</label>
                            <input type="password" class="form-control" id="newUserPassword" placeholder="Entrer un mot de passe" v-model="user.password">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="saveAdd">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddUserModal',
    props: ['user'],
    methods : {
        saveAdd : function(){
            this.$emit('saveAddUser');
        }
    }
}
</script>
<style scoped>

</style>