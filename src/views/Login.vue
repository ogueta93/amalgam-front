<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form v-on:submit.prevent="submitLogin">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="fas fa-envelope"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="email" class="form-control" placeholder="Username" autocomplete="username email" id="email" v-model="email" required/>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="fas fa-key"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password" class="form-control" placeholder="Password" autocomplete="current-password" id="password" v-model="password" required/>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button type="submit" variant="primary" class="px-4">Login</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0">Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import ACTION from '@/constants/Action';

export default {
    name : 'loginView',
    data() {
        return {
            email : null,
            password : null
        }
    },
    mounted: function() {
        /** Initial module instance */
        var that = this;
    },
    updated: function() {
        /** after render */
    },
    methods: {
        submitLogin: function() {
            var data = {
                email: this.email,
                password: this.password
            };
            
            this.$webSocket.sendComplexAction(ACTION.LOGIN_ACTION, this.$options.name, data, this.callBackLogin);
        },
        callBackLogin: function(response, error) {
            if (error) {
                alert('ERROR');
                console.log('Error', response);
            } else {
               console.log('Good', response);
               this.$router.push('/game');
            }
        },
    }
};
</script>