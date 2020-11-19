<template>
    <div class="page_content_holder">
        <div class="padding_content">
            <div class="white_boxed_content lists_page">
                <header class="sec_header">
                    <div class="align_left">
                        <strong style="font-size: 14px !important;">Unsubscribed Users</strong>
                    </div>
                    <input id="table_search" name="table_search" placeholder="Search here..."
                           type="search"
                           v-model="companyUserObj.search"
                           v-on:change="companySearch">

                </header>
                <div class="list_holder">
                    <div class="align_left mCustomScrollbar _mCS_1 mCS_no_scrollbar">
                        <div class="side_widget">
                            <strong class="title colored">Filter(s):</strong>
                            <ul class="list_none side_tags">
                                <li>
                                    <a class="opener anchor_pointer">Status <i class="fas fa-sort-down"></i></a>
                                    <ul class="list_none inner_tags side_tags indicators" style="width: 150px">
                                        <li v-bind:class="dataTable.lookupProp == label ? 'active': ''"
                                            v-for="(label, index) in actives">
                                            <a class="sideBar-filter" style="cursor: pointer" v-bind:id="'active'+index"
                                               v-on:click="fn_userFilter(label, index)">{{label}}
                                                <i aria-hidden="true" class="fa fa-times"
                                                   v-if="dataTable.lookupProp == label"
                                                   v-on:click.stop="removeActive(index)"></i>

                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="table_holder mCustomScrollbar" style="padding-bottom: 60px;">
                        <div class="dataTables_wrapper no-footer" id="example_wrapper">
                            <listing v-bind:apiPayLoad="dataTable.payLoad"
                                     v-bind:componentName="dataTable.componentName"
                                     v-bind:footerComponent="dataTable.isFooterComponent"
                                     v-bind:tableColumn="dataTable.column"
                                     v-bind:tableColumnsClasses="dataTable.columnsClasses"
                                     v-bind:tableFilterable="dataTable.filterable"
                                     v-bind:tableHeadings="dataTable.headings"
                                     v-bind:tableMapColumns="dataTable.mapColumns"
                                     v-bind:tableReloading="dataTable.reloadProp"
                                     v-bind:tableSearch="dataTable.searchProp"
                                     v-bind:tableSideBarSearch="dataTable.lookupProp"
                                     v-bind:tableSortable="dataTable.sortable">
                                <template slot="listing" slot-scope="data">
                                    <i class="fas fa-cog" v-on:click.stop="segmentAction(data.actionlisting)"></i>
                                    <i class="fas fa-sort-down" v-on:click.stop="segmentAction(data.actionlisting)"></i>
                                    <ul class="table_drop list_none"
                                        v-bind:id="data.actionlisting.row.row_id+'_action'">
                                        <li>
                                            <router-link
                                                    v-bind:to="'/dashboard/user-stats/' + data.actionlisting.row.row_id">
                                                <i class="fas fa-street-view"></i> View
                                            </router-link>
                                        </li>
<!-- 
                                        <li v-if="data.actionlisting.row.status == 1">
                                            <a v-on:click="userStatusUpdate(data.actionlisting.row.row_id,0)"><i
                                                    class="fas fa-trash"></i> Inactive </a>
                                        </li>
                                        <li v-else>
                                            <a v-on:click="userStatusUpdate(data.actionlisting.row.row_id,1)"><i
                                                    class="fas fa-trash"></i> Active </a>
                                        </li> -->
                                        <li>
                                            <a v-on:click="deleteUsers(data.actionlisting.row.row_id)"><i
                                                    class="fas fa-trash"></i> Delete </a>
                                        </li>
                                    </ul>
                                </template>
<!--                                <template slot="image_url" slot-scope="data">-->
<!--                                    <div v-if="data.imagelisting.row.image_url">-->
<!--                                        <img v-bind:src="data.imagelisting.row.image_url"/>-->
<!--                                    </div>-->
<!--                                    <div v-else>-->
<!--                                        <img src="../../../../assets/images/profile_placeholder.png"/>-->
<!--                                    </div>-->
<!--                                </template>-->
                                <template slot="user_id" slot-scope="data">
                                  <div class="text-center">
                                    <b>{{data.userList.row.user_id}}</b>
                                  </div>

<!--                                    <b>Row Id : {{data.userList.row.row_id}}</b><br/>-->
<!--                                    <b>User Name : {{data.userList.row.username != null ? data.userList.row.username :-->
<!--                                        'N/A'}}</b>-->
                                  <br/>
                                    <span data-toggle="tooltip"
                                          title="This user could not be able to receive notifications!" v-show="data.userList.row.is_revoked === 1"
                                          class="label label-danger">Revoked</span>
                                </template>
                            </listing>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import listing from '../../../otherComponents/datatable/datatableComponent';

    export default {
        name: "LookupListing",
        components: {
            listing,
        },
        data() {
            return {
                dataTable: {
                    reloadProp: false,
                    // column: ['image_url', 'user_id', 'email', 'device_type', 'last_login', 'is_active', 'Action'],
                    column: [ 'user_id', 'firstname', 'lastname', 'email', 'updated_at', 'Action'],
                    // mapColumns: ['image_url', 'user_id', 'row_id', 'username', 'is_revoked', 'email', 'device_type', 'last_login', 'is_active', 'status', 'Action'],
                    mapColumns: ['user_id', 'firstname', 'lastname', 'row_id', 'is_revoked', 'email', 'updated_at', 'Action'],
                    // filterable: ['user_id', 'email', 'last_login', 'device_type', 'is_active', 'status'],
                    filterable: ['user_id', 'email', 'last_login', 'is_active'],
                    // sortable: ['user_id', 'email', 'last_login', 'device_type', 'is_active', 'status'],
                    sortable: ['user_id', 'email', 'last_login', 'is_active'],
                    isFooterComponent: true,
                    componentName: "companyUserListing",
                    headings: {

                        user_id: 'User Id',
                        firstname: 'First Name',
                        lastname: 'Last Name',
                        // username: 'User Name',
                        is_revoked: 'Is Revoked',
                        email: 'Email',
                        // device_type: "Device Type",
                        updated_at: 'Unsubscribe Date',
                        // is_active: 'Status',
                        Action: 'Action'

                    },
                    columnsClasses: {
                        image_url: 'medium_image width_15',
                        row_id: '',
                        user_id: 'colspan_1',
                        // user_id: 'colspan_2 text_left',
                        // username: '',
                        email: 'colspan_2',
                        // device_type: 'width_15',
                        // email: 'colspan_2',
                        // last_login: 'colspan_2',
                        // updated_at: 'width_10',
                        // is_active: 'width_10',
                        Action: 'width_5'
                    },
                    payLoad: {
                        resource: "company/users/unsubscribe-listing",
                        action: "get",
                    },
                    searchProp: '',
                    lookupProp: {},

                },
                companyUserObj: {
                    search: '',
                    lookupFilter: []
                },
                companyParamObj: {
                    companyid: '0',
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    logo: ''

                },
                errors: {
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    logo: ''
                },
                export_button: true,
                export_file: '',
                actives: ["Active", "Inactive"]
            }

        },
        mounted() {
            setTimeout(function () {
                $(".VueTables__search").parent().remove();
            });

            this.checkExportUser();
            this.companyUserListing();
        },
        methods: {
            companyUserListing(){
                this.bus.$on('callUserListings',  () => {
                this.dataTable.reloadProp = !this.dataTable.reloadProp;
            });

            },
            companySearch() {
                console.log('call', this.companyUserObj.search);
                this.dataTable.searchProp = this.companyUserObj.search;
            },
            segmentAction(rowObj) {
                $(".table_drop:not(#" + rowObj.row.row_id + "_action)").hide();
                $("#" + rowObj.row.row_id + "_action").slideToggle('100');
            },
            removeActive(id) {
                console.log('remove', id);
                $("#" + id).removeClass("active");
                this.dataTable.lookupProp = {};
            },
            fn_userFilter(label, index) {
                $(".sideBar-filter").removeClass("active");
                $("#active" + index).addClass("active");
                console.log('label', label);
                this.dataTable.lookupProp = label;
            },
            deleteUsers(id) {
                this.$swal({
                    title: "Are you sure? You want to delete this !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Yes, Delete it!"
                }).then((result) => {
                    if (result.value) {
                        this.api("post",
                            this.constants.getUrl("backendApiUrl"),
                            {
                                resource: "company/users/delete/" + id,
                                action: "delete",
                                data: {
                                    id: id
                                }
                            },
                            this.authHeaders
                        ).then((response) => {
                            this.$swal('Deleted', 'You successfully deleted this file', 'success');
                            this.dataTable.reloadProp = !this.dataTable.reloadProp;
                        }).catch((error) => {
                            console.log('error', error);
                        });
                    }
                });
            },
            userStatusUpdate(id, status) {
                let activeStatus = 'DeActivate';
                var data = {
                    'id': id,
                    'is_active': status
                };
                console.log('id', id);
                console.log('status', status);
                if (status) {
                    activeStatus = 'Activate'
                }

                this.$swal({
                    title: "Are you sure ? you want to " + activeStatus + " " + "user!",
                    // text: "Are you sure? You won't be able to revert this!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Yes, Do it!"
                }).then((result) => { // <--
                    if (result.value) {
                        this.api("post",
                            this.constants.getUrl("backendApiUrl"),
                            {
                                resource: "userStatus",
                                action: "update",
                                id: id,
                                data: data
                            },
                            this.authHeaders
                        ).then((response) => {
                            this.$swal('User Status', 'Status changed successfully.', 'success');
                            this.dataTable.reloadProp = !this.dataTable.reloadProp;
                        }).catch((error) => {
                            console.log('error', error);
                        });
                    }
                });
            },
            exportUsers() {
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    {
                        resource: "company/users/export",
                        action: "post"
                    },
                    this.authHeaders
                ).then((response) => {
                    this.$swal('Export Users', 'Your "Export" request is in process. You will be notified via email as soon as the process completes.', 'success');
                    this.export_button = false
                }).catch((error) => {
                    console.log('error', error);
                });
            },
            checkExportUser() {
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    {
                        resource: "company/users/exports/file",
                        action: "get"
                    },
                    this.authHeaders,
                    true
                ).then((response) => {
                    console.log(response.data);

                    let data = response.data;
                    this.export_button = data.is_process == true ? false : true;
                    this.export_file = data.file_path
                }).catch((error) => {
                    console.log('error', error);
                });
            },
            downloadExportUsers() {
                window.location.href = this.export_file
            }
        }
    }
</script>

<style>


</style>