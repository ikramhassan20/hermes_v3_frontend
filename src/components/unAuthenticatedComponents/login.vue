<template>
    <div id="wrapper">
        <div class="login_layer">
            <div class="d-table">
                <div class="v-middle">
                    <form v-bind:class="classActive == true ? 'login_form active': 'login_form'"
                          v-on:submit.prevent="login">
                        <fieldset>
                            <div class="hermis_logo">
                                <img src="../../assets/images/hermisLogo.png">
                            </div>
                            <h2>
                                <div class="icon"><i class="fas fa-lock"></i></div>
                                <span>Member Login</span>
                            </h2>
                            <div class="fields">
                                <div class="row">
                                    <div class="input_holder">
                                        <i class="fas fa-user"></i>
                                        <input placeholder="Email" type="email" v-model="user.email">
                                    </div>
                                    <p class="error" v-if="errors.email">{{ errors.email }}</p>
                                    <span id="emailError" v-if="emailError" style="color: red">Email is required</span>
                                </div>
                                <div class="row">
                                    <div class="input_holder">
                                        <i class="fas fa-unlock-alt"></i>
                                        <input placeholder="Password" type="password" v-model="user.password">
                                    </div>
                                    <span id="passwordError" v-if="passwordError"
                                          style="color: red">Password is required</span>
                                </div>
                                <div class="row vue_captcha">
                                    <vue-recaptcha
                                            :sitekey=user.recaptchaKey
                                            v-model="user.recaptcha"
                                            @verify="markRecaptchaAsVerified"
                                    ></vue-recaptcha>
                                    <span id="captchaError" v-if="captchaError" style="color: red">Captcha is required</span>
                                </div>
                                <div class="row b_margin">
                                    <div class="col">
                                        <router-link to="/forgot-password">Forgot Password?</router-link>
                                    </div>
                                </div>
                                <div class="row">
                                    <input type="submit" v-on:click="login" value="Login">
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import VueRecaptcha from 'vue-recaptcha';

    export default {
        name: "Login",
        components: {VueRecaptcha},
        data() {
            return {
                user: {
                    email: "",
                    password: "",
                    captchToken :"",
                    recaptcha: false,
                    recaptchaKey:process.env.RECAPTCHKEY
                },
                errors: {
                    email: ''
                },
                reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
                classActive: false,
                passwordError: false,
                emailError: false,
                captchaError: false
            };
        },
        mounted() {
            this.classActive = true;
        },
        methods: {
            login($event) {
                $event.preventDefault();
                if (this.user.recaptcha == false) {
                    // $("#captchaError").css('display', 'block');
                    this.captchaError = true;
                }
                if (this.user.email == "") {
                    this.emailError = true;
                }
                if (this.user.password == "") {
                    this.passwordError = true;
                }
                if (this.user.recaptcha == true && (this.user.email != " ") && this.user.password != "") {
                    this.api("post",
                        this.constants.getUrl("login"),
                        this.user
                    ).then((response) => {
                        if (response.data.meta.code == 200) {
                            this.fetchUserInfo(response.data.data.token);
                        } else {
                            this.$swal('Failed', 'These credentials do not match our records.', 'error');
                        }
                    }).catch((error) => {
                        if (error[0].response.data.meta.code == 422) {
                            this.$swal('Failed', error[0].response.data.error[0], 'error');
                        } else {
                            this.$swal('Failed', 'These credentials do not match our records.', 'error');

                        }
                    });
                }
            },
            markRecaptchaAsVerified(response) {
                this.user.recaptcha = true;
                this.user.captchToken = response;
            },
            fetchUserInfo(token) {
                let payload = {
                    resource: "user",
                    action: "get",
                    data: {}
                };
                let authHeaders = {
                    headers: {
                        'Authorization': "Bearer " + token,
                    }
                };

                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payload,
                    authHeaders
                ).then((response) => {
                    if (response.status == 200) {
                        this.storeToken(token);
                        this.$store.dispatch("saveUserInfoAction", response.data);

                        if (response.data.is_admin == 1) {
                            window.location.reload()
                            // this.$router.go("/dashboard/company-listing");
                        } else {
                            window.location.reload()
                            // this.$router.go("/dashboard/company-userListing");
                        }
                    }
                }).catch((error) => {
                });

            }
        },
        watch: {
            user: {
                handler(user) {
                    if (user.email != " ") {
                        if(user.email == ""){
                            this.errors.email = ''
                        }else{
                            (this.reg.test(user.email)) ? this.errors.email = '' : this.errors.email = 'Email address not valid';
                            // $("#emailError").css('display', 'none');
                            this.emailError = false;
                        }
                    }
                    if (user.password != " ") {
                        this.passwordError = false;
                    }
                    if (user.recaptcha) {
                        this.captchaError = false;
                    }

                    // do stuff
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .hermis_logo {
        text-align: center;
        padding: 8px 0px;
    }
</style>