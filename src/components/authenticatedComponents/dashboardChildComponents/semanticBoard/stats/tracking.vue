<template>
    <div class="state_col details_col">
        <div style="margin-bottom: 25px">
            <h2>Board Tracking -
                <button class="apply_btn" type="button" v-on:click="exportUsers($route.params.id)">Export</button>
              <button class="apply_btn" type="button" v-on:click="fetchTrackingStats($route.params.id)">Reload Stats</button>

              <button style="margin-left: 5px" class="apply_btn pull-right" type="button" v-on:click="fetchTrackingStats($route.params.id)">Apply
              </button>
              <select class="select_status pull-right" v-model="statsSelectedDevice">
                <option value="">All Devices</option>
                <option value="ios">IOS</option>
                <option value="android">ANDROID</option>
              </select>
            </h2>
        </div>

        <div class="state_header no_padding">
            <table class="table table-bordered text-center">
                <thead>
                <tr>
                    <th class="col-background-color">Targeted Users</th>
                    <th class="col-background-color">Total Trackings</th>
                    <th>Sent</th>
                    <th>Viewed</th>
                    <th>Failed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="col-background-color" style="text-align: center;">{{ trackingStats.targetedUsers }}</td>
                    <td class="col-background-color">{{ trackingStats.total }}</td>
                    <td>{{ trackingStats.sent }}</td>
                    <td>{{ trackingStats.viewed }}</td>
                    <td>{{ trackingStats.failed }}</td>
                </tr>
                </tbody>
            </table>
        </div>


        <div v-if="boardExpireStatus == 0" class="state_header no_padding details_header new_cal_div">
            <div class="align_right">
                <button class="apply_btn" type="button" v-on:click="trackingListReload">Reload List</button>
                <!-- <input placeholder="Start Date" class="input_width_campaign_stats" type="date"
                       v-model="tracking.start_date"> -->

                        <datepicker v-model="tracking.start_date" :format="customFormatter"
               placeholder="Start Date" ></datepicker>

               <datepicker v-model="tracking.end_date" :format="customFormatter"
               placeholder="End Date" ></datepicker>
               
                <!-- <input placeholder="End Date" class="input_width_campaign_stats" type="date"
                       v-model="tracking.end_date"> -->
                <select class="select_status select_width_campaign_stats" v-model="tracking.variant_type">
                    <option value="-1">Variant Type</option>
                    <option value="InApp">InApp</option>
                    <option value="Push">Push</option>
                    <option value="Email">Email</option>
                </select>
                <!--                <select class="select_status select_width_campaign_stats" v-model="tracking.selectedVariantFilter">-->
                <!--                    <option v-bind:value="-1">Select Variant Steps</option>-->
                <!--                    <option v-for="filter in variantFilters" v-bind:value="filter.variantId">{{filter.label}}</option>-->
                <!--                </select>-->
                <select class="select_status select_width_campaign_stats" v-model="tracking.status">
                    <option value="">Select Status</option>
                    <option value="added">Added</option>
                    <option value="executing">Executing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
                <select class="select_status select_width_campaign_stats" v-model="tracking.deviceType">
                    <option value="-1">Select Device</option>
                    <option value="ios">IOS</option>
                    <option value="android">Android</option>
                    <!-- <option value="web">Web</option> -->
                </select>
                <button class="apply_btn" type="button" v-on:click="searchCampaignTracking">Apply</button>
                <input class="table_search active" type="text" v-model="tracking.global">
                <div class="search_opener inline_block">
                    <!--<img alt="#" src="../../../../../assets/images/search_button.png" v-on:click="this.globalFilterTracking">-->
                    <i class="fa fa-search" aria-hidden="true" v-on:click="globalFilterTracking"></i>
                </div>
            </div>
            <!--<h2>Campaign Tracking</h2>-->
        </div>
        <div v-if="boardExpireStatus == 0" class="table_holder no_padding details_table">
            <listing v-bind:apiPayLoad="trackingDataTable.payLoad"
                     v-bind:componentName="trackingDataTable.componentName"
                     v-bind:customFiltersProp="trackingDataTable.customFilters"
                     v-bind:tableColumn="trackingDataTable.column"
                     v-bind:tableColumnsClasses="trackingDataTable.columnsClasses"
                     v-bind:tableFilterable="trackingDataTable.filterable"
                     v-bind:tableHeadings="trackingDataTable.headings"
                     v-bind:tableMapColumns="trackingDataTable.mapColumns"
                     v-bind:tableReloading="trackingDataTable.reloadProp"
                     v-bind:tableSearch="trackingDataTable.searchProp"
                     v-bind:tableSortable="trackingDataTable.sortable">
                <template slot="status-slot" slot-scope="data">
                    <span v-bind:class="data.data.row.status == 'added' ? 'added': data.data.row.status == 'failed' ? 'failed': data.data.row.status == 'executing' ? 'executing': data.data.row.status == 'completed' ? 'completed': ''">
                        {{data.data.row.status}}
                    </span>
                </template>
                <template slot="email-slot" slot-scope="data">
                    <router-link
                            v-bind:to="'/dashboard/user-stats/' + data.nameColumn.row.row_id">
                        {{data.nameColumn.row.email}}
                    </router-link>
                </template>
                <template slot="listing" slot-scope="data">
                    <div v-if="data.actionlisting.row.status=='failed'">
                        <i class="fas fa-cog" v-on:click.stop="trackingAction(data.actionlisting)"></i>
                        <i class="fas fa-sort-down" v-on:click.stop="trackingAction(data.actionlisting)"></i>
                        <ul class="table_drop list_none" v-bind:id="data.actionlisting.row.id+'_action'">
                            <li>
                                <a v-on:click="reSendNotification(data.actionlisting.row, 1)"><i
                                        class="fa fa-repeat"></i>Resend</a>
                            </li>
                        </ul>
                    </div>
                </template>
                <template slot="message" slot-scope="data">
                    <a class="anchor_pointer abbbc" title="Message" data-toggle="popover" data-trigger="hover"
                       v-bind:data-content="data.data.row.message">{{data.data.row.message}}</a>
                </template>
                <template slot="variant" slot-scope="data">
                    <span class="anchor_pointer" v-on:click="seeVariantLang(data.data.row.variantLang)">{{data.data.row.variant}}</span>
                </template>
            </listing>
        </div>

    </div>
</template>
<script>
    import Datepicker from 'vuejs-datepicker';
    import listing from '../../../../otherComponents/datatable/datatableComponent';
    import csvDownload from "../../../../../mixins/csvDownload/csvDownload";

    export default {
        components: {
            listing,
            Datepicker
        },
      props: ['boardExpireStatus'],
        mixins: [csvDownload],
        data() {
            let id = this.$route.params.id;
            return {
                trackingDataTable: {
                    reloadProp: false,
                    componentName: "boardTracking",
                    column: [ 'email','variant_type', 'variant', 'track_key', 'sent_at', 'status', 'device_type', 'viewed_at', 'message', 'Action'],
                    mapColumns: ['email','variant_type', 'id', 'row_id', 'variantLang', 'variant', 'track_key', 'sent_at', 'status', 'device_type', 'viewed_at', 'message'],
                    filterable: ['email','variant_type', 'track_key', 'sent_at', 'status', 'device_type', 'viewed_at', 'message'],
                    sortable: ['email','variant_type', 'track_key', 'sent_at', 'status', 'device_type', 'viewed_at', 'message'],
                    headings: {
                        email: 'Email ',
                        variant_type: 'Variant Type',
                        variant: 'Variant Steps',
                        track_key: 'Track key',
                        sent_at: 'Sent At',
                        status: 'Status',
                        viewed_at: 'Viewed At',
                        message: 'Message',
                        action: 'Action',
                        device_type: 'Device Type'
                    },
                    columnsClasses: {
                        track_key: '',
                        email: '',
                        sent_at: '',
                        status: '',
                        viewed_at: '',
                        message: '',
                        action: ''
                    },
                    payLoad: {
                        "resource": "board/tracking/list",
                        "action": "get",
                        "id": id
                    },
                    searchProp: '',
                    customFilters: ['track_table_filter'],
                    campaignFilterProp: {},
                },
                tracking: {
                    start_date: '',
                    end_date: '',
                    status: '',
                    global: '',
                    selectedVariantFilter: -1,
                    deviceType: -1,
                    variant_type: -1
                },
                variantFilters: [],
                trackingStats: {
                    total: 0,
                    sent: 0,
                    viewed: 0,
                    failed: 0,
                    targetedUsers: 0
                },
              statsSelectedDevice: ''
            }
        },
        mounted() {
            let id = this.$route.params.id;
            //this.fetchVariants(this.$route.params.id);
            this.fetchTrackingStats(this.$route.params.id);
            $("#footer").css({display: "none"});
        },
        beforeDestroy() {
            $("#footer").css({display: "block"});
        },
        methods: {
            fetchTrackingStats(boardId) {
                const payLoad = {
                    resource: "board/tracking/stats/" + boardId,
                    action: "get",
                  data: {
                    'selectedDevice': this.statsSelectedDevice
                  }
                };

                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                ).then((response) => {
                  this.trackingStats = response.data.data;
                }).catch((error) => {

                })
            },
            customFormatter(date) {
      return moment(date).format('DD/MM/YYYY');
    },
            trackingListReload() {
                this.trackingDataTable.reloadProp = !this.trackingDataTable.reloadProp;
            },
            searchCampaignTracking() {
                let data = {
                    status: this.tracking.status,
                    start_date: (this.tracking.start_date != '') ? moment(this.tracking.start_date).format('YYYY-MM-DD') : '',
                    end_date: (this.tracking.end_date != '') ? moment(this.tracking.end_date).format('YYYY-MM-DD') : '',
                    global: this.tracking.global,
                    variantFilter: this.tracking.selectedVariantFilter,
                    deviceType: this.tracking.deviceType,
                    variantType: this.tracking.variant_type
                };
                this.trackingDataTable.searchProp = data
            },
            globalFilterTracking() {
                this.tracking.status = '';
                this.tracking.start_date = '';
                this.tracking.end_date = '';
                this.searchCampaignTracking();
            },
            trackingAction(rowObj) {
                $(".table_drop:not(#" + rowObj.row.id + "_action)").hide();
                $("#" + rowObj.row.id + "_action").slideToggle('100');
            },
            reSendNotification(rowObj) {
                var payload = {
                    resource: "board/resend/notification",
                    action: "post",
                    data: rowObj
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payload,
                    this.authHeaders
                ).then((response) => {
                    console.log("response", response);
                    if (response.data.meta.code == 200) {
                        this.$swal('success', 'Notification Send Successfully', 'success');
                    } else {
                        this.$swal('error', response.data.error[0], 'error');
                    }
                    this.trackingDataTable.reloadProp = !this.trackingDataTable.reloadProp;
                }).catch((error) => {
                    console.log(error);
                    this.$swal('error', error, 'error');
                });
            },
            seeVariantLang(str) {
                str = str.split("-");
                let obj = {
                    variantIndex: str[0],
                    lang: str[1]
                };
                this.$emit("changeVariantAndLang", obj);
            },
            fetchVariants(boardId) {
                const payLoad = {
                    resource: "board/variants/" + boardId,
                    action: "get",
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                ).then((response) => {
                    console.log('response', response);
                    this.variantFilters = response.data.data;
                }).catch((error) => {
                    console.log('error', error);
                })
            },
            exportUsers(boardId) {
                const payLoad = {
                    resource: "board/tracking/export",
                    action: "get",
                    id: boardId,
                    data: {
                        track_table_filter: {
                            status: this.tracking.status,
                            start_date: this.tracking.start_date,
                            end_date: this.tracking.end_date,
                            global: this.tracking.global,
                            variantFilter: this.tracking.selectedVariantFilter,
                            deviceType: this.tracking.deviceType,
                            variantType: this.tracking.variant_type
                        },
                        columns: ["track_key", "email", "sent_at", "status", "device_type", "viewed_at", "message"],
                        query: "",
                        orderBy: "row_id",
                        ascending: 1,
                        byColumn: 0
                    }
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                ).then((response) => {
                    console.log('board', response);
                    if (response.data.meta.code === 200) {
                        window.location.href = this.constants.backendUrl + '/download/exportCSV/' + response.data.data.company_id + '/' + response.data.data.file_name;
                        // this.downloadCSV("boardTracking - " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + ".csv", response.data.data);
                    }
                }).catch((error) => {
                    console.log('error', error);
                });
            },
        }
    }
</script>

<style>
    .added {
        background: #605b5b;
        width: 80px;
        display: inline-block;
        border-radius: 4px;
        color: #fff;
        padding: 3px 10px 4px;
        font-size: 11px;
    }

    .executing {
        background: #f09c25;
        width: 80px;
        display: inline-block;
        border-radius: 4px;
        color: #fff;
        padding: 3px 10px 4px;
        font-size: 11px;
    }

    .completed {
        background: #2a8689;
        width: 80px;
        display: inline-block;
        border-radius: 4px;
        color: #fff;
        padding: 3px 10px 4px;
        font-size: 11px;
    }

    .failed {
        background: #ed1c24;
        width: 80px;
        display: inline-block;
        border-radius: 4px;
        color: #fff;
        padding: 3px 10px 4px;
        font-size: 11px;
    }

    #campaignTracking table tbody tr td:nth-child(6) a {
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
    }

    .popover {
        width: 200px;
        right: auto !important;
        margin: 0 !important;
        left: -201px !important;
        top: 0 !important;
        border-radius: 0;
        text-align: center;
    }

    .popover.right > .arrow {
        left: auto;
        right: -11px;
        top: 10px !important;
        margin-top: 0;
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
    }

    .select_width_campaign_stats {
        width: 124px !important;
    }

    .input_width_campaign_stats {
        width: 135px !important;
    }

    .table-bordered th, .table-bordered td {
        border: 1px solid #ddd !important;
        text-align: center;
        color: #2a8689;
    }

    .col-background-color{
      background-color: #efeeee;
    }


</style>