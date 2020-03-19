<template>
    <div class="admin_header">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" role="navigation">
            <router-link to="/admin/" class="navbar-brand">
                Administration
            </router-link >
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="exCollapsingNavbar">
                <ul class="nav navbar-nav flex-row justify-content-between ml-auto">
                    <li class="dropdown order-1">
                        <button type="button" id="dropdownMenu1" data-toggle="dropdown" class="btn btn-outline-primary my-2 my-sm-0 dropdown-toggle"><span class="fas fa-user-alt mr-2" aria-hidden="true"></span>Mon compte <span class="caret"></span></button>
                        <ul class="dropdown-menu dropdown-menu-lg-right mt-1">
                        <li class="p-3">
                                <form class="form" role="form">
                                    <div class="form-group">
                                        <button  class="btn btn-outline-primary btn-block" type="" >Modifier</button>
                                    </div>
                                    <div class="form-group">
                                        <button  class="btn btn-danger btn-block" type="" @click.prevent="logout">Déconnexion</button>
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'AdminHeader',
    methods: {
        logout (e){
            localStorage.removeItem('jwt-connexion');
            this.$router.push('/login')
        }
    }
}
</script>