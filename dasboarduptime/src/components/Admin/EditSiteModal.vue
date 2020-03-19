<template>
    <div id="admin_modal_edit">
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edition d'un site</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="siteName">Nom</label>
                            <input type="text" class="form-control" id="siteName" placeholder="Entrer un nom" v-model="site.name">
                        </div>
                        <div class="form-group">
                            <label for="siteUrl">Url</label>
                            <input type="text" class="form-control" id="siteUrl" placeholder="Entrer une url" v-model="site.url">
                        </div>
                        <div class="form-group">
                            <label for="siteAccount">Compte</label>
                            <select class="form-control" id="selectaccount" v-model="site.account">
                                <option value="0">-</option>
                                <option v-for="(account, idx) in accounts" :key="idx" :value="account._id">{{account.email}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="siteNotificationGroup">Compte</label>
                            <select class="form-control" id="selectnotificationgroup" v-model="site.notificationgroup">
                                <option value="0">-</option>
                                <option v-for="(notificationgroup, idx) in notificationgroups" :key="idx" :value="notificationgroup._id">{{notificationgroup.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="saveEdit">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'EditSiteModal',
    props: ['site', 'accounts', 'notificationgroups'],
    methods : {
        saveEdit : function(){
            this.$emit('saveEdit');
        }
    }
}
</script>
<style scoped>

</style>