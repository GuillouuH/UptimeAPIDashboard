<template>
    <div id="logform">
      <div class="container pt-3">
        <div class="row justify-content-sm-center">
          <div class="col-sm-6 col-md-4">
          <div v-if="error != ''" class="alert alert-danger" role="alert">
            {{error}}
          </div>

            <div class="card border-info text-center">
              <div class="card-header">
                Connectez-cous pour continuer
              </div>
              <div class="card-body">
                <form class="form-signin" @submit.prevent="handleConnexion">
                  <input type="text" class="form-control mb-2" placeholder="Email" v-model="email" required autofocus>
                  <input type="password" class="form-control mb-5" placeholder="Mot de passe" v-model="password" required>
                  <button class="btn btn-lg btn-primary btn-block mb-4" type="submit">Connexion</button>
                  <label class="checkbox float-left">
                    <input type="checkbox" value="remember-me" v-model="rememberme">
                      Se souvenir de moi
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

</template>

<script>

import axios from 'axios'

export default {
  name: 'Login',
  data(){
    return{
      email : localStorage.getItem('uptime-connexion-email'),
      password : "",
      rememberme : "",
      error: "",
    }
  },
  methods: {
      handleConnexion (e) {
          let vm = this;
          let data = {
            email : this.email,
            password : this.password
          }
          let url = process.env.urlAPI+'userLogin';
          axios.post(url, data).
          then(function (resp) {
              if(resp.data.success === 1){
                  if(vm.rememberme){
                    localStorage.setItem("uptime-connexion-email", vm.email);
                  }

                  localStorage.setItem("jwt-connexion", resp.data.token);
                  if(vm.$route.params.nextUrl != null){
                      vm.$router.push(vm.$route.params.nextUrl)
                  }else{
                    vm.$router.push('/')
                  }
              } else {
                  vm.error = "L'identifiant ou le mot de passe n'est pas correct.";
              }
          });
      }
  }
}
</script>
<style scoped>
</style>
