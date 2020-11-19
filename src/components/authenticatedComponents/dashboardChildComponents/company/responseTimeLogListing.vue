<template>
    <div class="page_content_holder">
        <div class="padding_content">
            <div class="white_boxed_content lists_page">
                <header class="sec_header">
                    <div class="align_left">
                        <strong> API Logs</strong>
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
                                    <a class="opener anchor_pointer">Type <i class="fas fa-sort-down"></i></a>
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

                                <li>
                                    <a class="opener anchor_pointer">Resource Type <i class="fas fa-sort-down"></i></a>
                                    <ul class="list_none inner_tags side_tags indicators" style="width: 150px">
                                        <li v-bind:class="dataTable.lookupProp == label ? 'active': ''"
                                            v-for="(label, index) in resourceTypeFilters">
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
                                        v-bind:id="data.actionlisting.row.id+'_action'">
                                        <li>
                                            <a v-on:click="deleteLog(data.actionlisting.row.id)"><i
                                                    class="fas fa-trash"></i> Delete </a>
                                        </li>
                                    </ul>
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
            listing
        },
        data() {
            return {
                dataTable: {
                    reloadProp: false,
                    column: ['name', 'type', 'record_id', 'console_type', 'response_time', 'created_at', 'Action'],
                    mapColumns: ['id', 'name', 'type', 'record_id', 'console_type', 'response_time', 'created_at', 'Action'],
                    filterable: ['name', 'type', 'record_id', 'console_type', 'response_time', 'created_at'],
                    sortable: ['name', 'type', 'record_id', 'console_type', 'response_time', 'created_at'],
                    isFooterComponent: true,
                    componentName: "APIresponseTimeListing",
                    headings: {
                        name: 'Name',
                        type: 'Type',
                        record_id: 'Resource ID',
                        console_type: 'Resource Type',
                        response_time: 'Response time (Milli seconds)',
                        created_at: 'Created at',
                    },
                    columnsClasses: {
                        record_id: 'width_10',
                        console_type: 'width_10',
                        // name: 'width_10',
                        type: 'width_10',
                        // response_time: 'width_10',
                        // created_at: 'width_5',
                        // device_type: 'width_15',
                        // email: 'colspan_2',
                        // last_login: 'colspan_2',
                        // is_active: 'width_10',
                        // Action: 'width_10'
                    },
                    payLoad: {
                        resource: "response/time/logs",
                        action: "get",
                    },
                    searchProp: '',
                    lookupProp: {},

                },
                companyUserObj: {
                    search: '',
                    lookupFilter: []
                },
                actives: ["API"],
                resourceTypeFilters: ["campaign", "board", "other"]
            }

        },
        mounted() {
            setTimeout(function () {
                $(".VueTables__search").parent().remove();
            });

            // this.checkExportUser();
            // this.companyUserListing();
        },
        methods: {
            deleteLog(id) {
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
                                resource: "response/time/logs/delete/" + id,
                                action: "delete",
                                data: {
                                    id: id
                                }
                            },
                            this.authHeaders
                        ).then((response) => {
                            this.$swal('Deleted', 'You successfully deleted this log', 'success');
                            this.dataTable.reloadProp = !this.dataTable.reloadProp;
                        }).catch((error) => {
                            console.log('error', error);
                        });
                    }
                });
            },
            companyUserListing() {
                this.bus.$on('callUserListings', () => {
                    this.dataTable.reloadProp = !this.dataTable.reloadProp;
                });

            },
            companySearch() {
                console.log('call', this.companyUserObj.search);
                this.dataTable.searchProp = this.companyUserObj.search;
            },
            segmentAction(rowObj) {
                $(".table_drop:not(#" + rowObj.row.id + "_action)").hide();
                $("#" + rowObj.row.id + "_action").slideToggle('100');
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
            }
        }
    }
</script>

<style>

    .table_holder table th:last-child {
        font-size: 15px !important;
    }

    .table_drop {
        right: 0 !important;
        top: 70% !important;
    }
</style>