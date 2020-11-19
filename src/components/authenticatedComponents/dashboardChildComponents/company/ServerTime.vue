<template>
    <div class="page_content_holder">
        <div class="padding_content">
            <div class="white_boxed_content">
                <h1>Server Time</h1>
                <div class="new_padding_div">
<!--                    <ul class="tabs stats_tabs list_none inline_list">-->
<!--                        <li class="active"><a>Server Time</a>-->
<!--                        </li>-->
<!--                    </ul>-->
                    <div class="stats_tab_content" id="tab-content">
                        <div class="tab active" id="overview">
                            <div class="state_cols">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="col-sm-2"></div>
                                        <div class="col-sm-8">
                                            <label>UTC Server Time (Using PHP):</label>
                                            <input v-model="serverTime" class="form-control" readonly type="text"
                                            />
                                        </div>
                                        <div class="col-sm-2"></div>
                                    </div>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="col-sm-2"></div>
                                        <div class="col-sm-8">
                                            <label>Database Time:</label>
                                            <input v-model="databaseTime" class="form-control" readonly type="text"
                                            />
                                        </div>
                                        <div class="col-sm-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "serverTime",
        data() {
            return {
                serverTime: '',
                databaseTime: ''
            }
        },
        mounted() {
            $("#footer").css({display: "none"});
            this.getServerTime();
        },
        beforeDestroy() {
            $("#footer").css({display: "block"});
        },
        methods: {
            getServerTime() {
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    {
                        resource: "severTime",
                        action: "get"
                    },
                    this.authHeaders
                ).then((response) => {
                    console.log('res', response);
                    if (response.data.meta.code != 200) {
                        if (response.data.data.check_is_admin == 0) {
                            this.$router.push("/dashboard/company-userListing");
                        } else {
                            this.$router.push("/dashboard/company-listing");
                        }
                    }
                    this.serverTime = response.data.data.serverTime;
                    this.databaseTime = response.data.data.databaseTime;
                }).catch((error) => {
                    console.log('error', error);
                });
            }
        }
    }
</script>

<style scoped>

</style>