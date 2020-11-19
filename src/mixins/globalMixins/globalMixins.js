const mixin = {
    data() {
        return {
            authHeaders: {
                headers: {
                    'Authorization': '',
                }
            },
            emailTemplate: `<style>body{ margin:0; }</style><div class="temp_wrapper" style="background:#f7f7f9; padding:5px 0; color:#666;"> <div class="templete clearfix" style="overflow:hidden; padding: 0 10px 20px; border:1px solid #dedede; max-width:632px; background:#fff; margin:30px auto;"><div class="top_header" style="text-align:center;"><div align="center"><img src="https://s3.amazonaws.com/hero-platform/app/assets/templates/placeholder_724.png" alt="placeholder" style="margin: 25px 0 0; height:118px;width:80%;display:block;"></div> </div>

                           <p style="  font-size:14px; font-weight:400; line-height:18px;  letter-spacing: 1px; margin:0; padding:30px 10px 9px;">
                         Loreum ipsum dolor sit amet, connsec- tetuer adipiscing elit.Aenean commodo ligula aget dolor.
                        Loreum ipsum dolor sit amet, connsec- tetuer adipiscing elit.Aenean commodo ligula aget dolor.
                        Loreum ipsum dolor sit amet, connsec- tetuer adipiscing elit.Aenean commodo ligula aget dolor.
          Loreum ipsum dolor sit amet, connsec- tetuer adipiscing elit.Aenean commodo ligula aget dolor.
        Loreum ipsum dolor sit amet, connsec- tetuer adipiscing elit.Aenean commodo ligula aget dolor.
    </p>

    <div class="templete_divition clearfix" style="overflow:hidden; text-align:center; padding:10px 0;">
        <div class="templete_sec" style="text-align:left; margin: 0 9px; width: 30%;     display: inline-block;     vertical-align: top;">
            <div align="center"><img src="https://s3.amazonaws.com/hero-platform/app/assets/templates/placeholder1.jpg" alt="placeholder" style="height:150px;width:100%;display:block;"></div>
            <p style=" text-align: center;  font-size:14px; font-weight:400; line-height:18px;  letter-spacing: 1px; margin:0; padding:10px 10px 9px;">
                Loreum ipsum dolor sit amit.
            </p>
        </div>
        <div class="templete_sec" style="text-align:left; margin: 0 9px; width: 30%;     display: inline-block;     vertical-align: top;">
            <div align="center"><img src="https://s3.amazonaws.com/hero-platform/app/assets/templates/placeholder1.jpg" alt="placeholder" style="height:150px;width:100%;display:block;"></div>
            <p style=" text-align: center;  font-size:14px; font-weight:400; line-height:18px;  letter-spacing: 1px; margin:0; padding:10px 10px 9px;">
                Loreum ipsum dolor sit amit.
            </p>
        </div>
        <div class="templete_sec" style="text-align:left; margin: 0 9px; width: 30%;     display: inline-block;     vertical-align: top;">
            <div align="center"><img src="https://s3.amazonaws.com/hero-platform/app/assets/templates/placeholder1.jpg" alt="placeholder" style="height:150px;width:100%;display:block;"></div>
            <p style=" text-align: center;  font-size:14px; font-weight:400; line-height:18px;  letter-spacing: 1px; margin:0; padding:10px 10px 9px;">
                Loreum ipsum dolor sit amit.
            </p>
        </div>
    </div>
</div>
</div>`
        }
    },
    mounted() {
        this.authHeaders.headers.Authorization = this.getToken();
        // this.authHeaders.headers.Content-Type = 'multipart/form-data';
        $(".mCustomScrollbar").mCustomScrollbar({
            mouseWheelPixels: 100
        });

        $(".bs-container").css({
            display: "none"
        });
    },
    methods: {
        storeToken(token) {
            this.$store.dispatch('setStoreTokenAction', token);
        },
        getToken() {
            return this.$store.getters.getStoreTokenGetters;
        },
        removeToken() {
            this.$store.dispatch('removeStoreTokenAction');
        },
        setCompanyImage(path) {
            console.log('path', path);
        },
        logOut() {

            alert("asd");
            //this.removeToken();
            //this.$router.go("/login");
        }
    }
};

export default mixin;