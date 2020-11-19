<template>
    <div class="page_content_holder">
        <div class="padding_content stats_div">
            <div class="homepage_charts">
                <article class="post">
                    <div class="user_state_cols">
                        <tracking v-bind:campaignExpireStatus="campaignExpireStatus" v-on:changeVariantAndLang="changeVariantLang">
                        </tracking>
                        <div class="state_col details_col">
                            <div class="state_header no_padding details_header new_cal_div">
                                <div style="margin-bottom: 15px; overflow: hidden;">
                                    <h2>Action Trigger/Conversion Trigger</h2>
                                </div>
                                <select class="form-control float_left" v-model="actionType">
                                    <option value="">Select Type</option>
                                    <option value="action_trigger">Action Trigger</option>
                                    <option value="conversion">Conversion Trigger</option>
                                </select>
                                <div class="align_right">
                                    <button class="apply_btn" type="button" v-on:click="actionTriggerListReload">Reload
                                        List
                                    </button>
                                    <!-- <input placeholder="Start Date" type="date" v-model="action.start">
                                    <input placeholder="End Date" type="date" v-model="action.end"> -->

                                         <datepicker v-model="action.start" :format="customFormatter"
                                        placeholder="Start Date" ></datepicker>

                                     <datepicker v-model="action.end" :format="customFormatter"
                                     placeholder="End Date" ></datepicker>
                                    <select class="select_status" v-model="action.type">
                                        <option value="">Select Device Type</option>
                                        <option value="IOS">IOS</option>
                                        <option value="ANDROID">ANDROID</option>
                                        <!-- <option value="WEB">WEB</option> -->
                                    </select>
                                    <button class="apply_btn" type="button" v-on:click="filterActionTrigger">Apply
                                    </button>
                                    <input class="table_search active" type="text" v-model="action.global">
                                    <div class="search_opener inline_block">
                                        <i aria-hidden="true" class="fa fa-search"
                                           v-on:click="globalFilterActionTrigger"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="table_holder no_padding details_table">
                                <listing v-bind:apiPayLoad="actionDataTable.payLoad"
                                         v-bind:componentName="actionDataTable.componentName"
                                         v-bind:customFiltersProp="actionDataTable.customFilters"
                                         v-bind:tableActionType="actionDataTable.actionFilter"
                                         v-bind:tableColumn="actionDataTable.column"
                                         v-bind:tableColumnsClasses="actionDataTable.columnsClasses"
                                         v-bind:tableFilterable="actionDataTable.filterable"
                                         v-bind:tableHeadings="actionDataTable.headings"
                                         v-bind:tableMapColumns="actionDataTable.mapColumns"
                                         v-bind:tableReloading="actionDataTable.reloadProp"
                                         v-bind:tableSearch="actionDataTable.searchProp"
                                         v-bind:tableSortable="actionDataTable.sortable"
                                         v-bind:preLoader="false">
                                </listing>
                            </div>
                        </div>
                      <div v-if="campaignTriggerStatus" class="state_col details_col">
                        <div class="top-holder loader_content">
                        <div class="ajax_loader_graph"><img src="../../../../assets/images/loader.gif"></div>
                        <div class="row">
                          <div class="pull-left" id="chartContainer" style="height: 300px; width: 50%;"></div>
                          <div v-if="campaign.campaign_type == 'email'" class="pull-right" id="chartContainer2" style="height: 300px; width: 50%;"></div>
                        </div>
                        <div v-if="campaign.campaign_type == 'email'" class="h_charts">
                          <div class="col">
                            <div class="d_table">
                              <div class="v_middle">
                                <div class="col_row">
                                  <span class="tag">{{activityStats.openedPercentage}}%</span>
                                  <em>Opened</em>
                                  <span class="tag add"><strong>{{activityStats.uniqueOpens}}</strong> unique / opened <strong>{{activityStats.opened}}</strong> times</span>
                                </div>
                                <div class="col_row">
                                  <span class="tag"><strong>{{activityStats.notOpened}}</strong></span>
                                  <em>Not opened
                                    <!--                                  <i class="fa fa-cloud-download-alt" aria-hidden="true"></i>-->
                                  </em>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col">
                            <div class="d_table">
                              <div class="v_middle">
                                <div class="col_row">
                                  <span class="tag"><strong>{{activityStats.bouncedPercentage}}</strong>%</span>
                                  <em>Bounced</em>
                                  <span class="tag add"><strong>{{activityStats.bounced}}</strong> Bounced</span>
                                </div>
                                <div class="col_row">
                                  <span class="tag"><strong>{{activityStats.clicksPercentage}}</strong>%</span>
                                  <em>Clicked a link <span class="tag add"><strong>{{activityStats.uniqueClicks}}</strong> unique clicks</span></em>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                      <div class="state_col details_col">
                       <div class="h_table">
                        <h2>Link Activity -
                          <button v-if="linkActivityData.length != 0" style="
    display: inline-block;
    vertical-align: middle;" class="apply_btn" type="button" v-on:click="exportActivityStats('link-activity')">Export
                          </button>
                        </h2>
                        <table class="table table-bordered" v-if="linkActivityData.length != 0">
                          <thead>
                          <tr>
                            <th>Link (URL)</th>
                            <th>Total</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="link in linkActivityData">
                            <td style="text-align: center">{{link.actual_url}}</td>
                            <td>{{link.total}}</td>
                          </tr>
                          </tbody>
                        </table>
                        <span v-if="linkActivityData.length == 0" style="text-align: center; padding: 20px;">No Data Available</span>
                      </div>
                      </div>
                      <div class="state_col details_col">
                        <div class="h_table add">
                        <h2>Last 10 opened -
                          <button v-if="lastTenOpenedData.length != 0" style="
    display: inline-block;
    vertical-align: middle;" class="apply_btn" type="button" v-on:click="exportActivityStats('last-ten-opened')">Export
                          </button>
                        </h2>
                        <table class="table table-bordered" v-if="lastTenOpenedData.length != 0">
                          <thead>
                          <tr>
                            <th>User ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="user in lastTenOpenedData">
                            <td style="text-decoration: underline;font-weight: bold;text-align: center;"><router-link
                                v-bind:to="'/dashboard/user-stats/' + user.row_id">{{ user.user_id }}</router-link></td>
                            <td>{{ user.firstname }}</td>
                            <td>{{ user.lastname }}</td>
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <td><span v-if="user.status == 1" class="status_tag">Subscribed</span> </td>
                          </tr>
                          </tbody>
                        </table>
                        <span v-if="lastTenOpenedData.length == 0" style="text-align: center; padding: 20px;">No Data Available</span>
                      </div>
                      </div>
                      <div v-show="campaignExpireStatus == 0" class="state_col">
                        <div class="state_header">
                          <div class="align_right">
                            <ul class="list_none stats_tabbing">
                              <li v-bind:class="activetab == 'views' ? 'active' : ''">
                                <a v-on:click="activetab = 'views'">View</a></li>
                              <li v-bind:class="activetab == 'clicks' ? 'active' : ''">
                                <a v-on:click="activetab = 'clicks'">Click</a></li>
                              <li v-bind:class="activetab == 'click_through' ? 'active' : ''">
                                <a v-on:click="activetab = 'click_through'">Click Through</a></li>
                            </ul>
                            <ul class="state_list add">
                              <li>
                                <em class="color_indicate android"></em>
                                <em>android</em>
                              </li>
                              <li>
                                <em class="color_indicate ios"></em>
                                <em>ios</em>
                              </li>
                            </ul>
                          </div>
                          <h2>Views - Clicks</h2>
                        </div>

                        <div id="stats_tab_content">
                          <div id="view_chart" v-bind:class="activetab === 'views' ? 'tab active' : 'tab'">
                            <div id="chart_views" style="height: 300px; width: 100%;"></div>
                          </div>
                          <div id="click_chart" v-bind:class="activetab === 'clicks' ? 'tab active' : 'tab'">
                            <div id="chart_clicks" style="height: 300px; width: 100%;"></div>
                          </div>
                          <div id="click_through"
                               v-bind:class="activetab === 'click_through' ? 'tab active' : 'tab'">
                            <div id="chart_click_through" style="height: 300px; width: 100%;"></div>
                          </div>
                        </div>
                      </div>
                      <div class="state_col details_col">
                        <div class="state_header no_padding details_header new_cal_div">
                          <div v-if="campaignExpireStatus == 0" class="align_right">
                            <!-- <input placeholder="Start Date" type="date" v-model="model_views_clicks.start_date">
                            <input placeholder="End Date" type="date" v-model="model_views_clicks.end_date"> -->

                            <datepicker v-model="model_views_clicks.start_date" :format="customFormatter"
                                        placeholder="Start Date" ></datepicker>

                            <datepicker v-model="model_views_clicks.end_date" :format="customFormatter"
                                        placeholder="End Date" ></datepicker>
                            <button class="apply_btn" type="button" v-on:click="filterViewsCount">Apply</button>
                          </div>
                          <h2>Views - Count</h2>
                        </div>
                        <div class="stats_columns">
                          <div class="single_column light_border">
                            <div class="single_widget">
                              <strong class="single_title text-center">IOS</strong>
                              <ul class="list_none timings fluid percentages">
                                <li>
                                  <div class="inner_cols">
                                    <div class="inner_col">
                                      <p>CLICKS</p>
                                      <h5 v-if="views_clicks.ios">{{views_clicks.ios.clicks}}</h5>
                                    </div>
                                    <div class="inner_col">
                                      <p>VIEWS</p>
                                      <h5 v-if="views_clicks.ios">{{views_clicks.ios.views}}</h5>
                                    </div>
                                    <div class="inner_col">
                                      <p>PERCENTAGE</p>
                                      <h5 v-if="views_clicks.ios">{{views_clicks.ios.percentage}}</h5>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div class="single_column light_border">
                            <div class="single_widget">
                              <strong class="single_title text-center">ANDROID</strong>
                              <ul class="list_none timings fluid percentages">
                                <li>
                                  <div class="inner_cols">
                                    <div class="inner_col">
                                      <p>CLICKS</p>
                                      <h5 v-if="views_clicks.android">
                                        {{views_clicks.android.clicks}}</h5>
                                    </div>
                                    <div class="inner_col">
                                      <p>VIEWS</p>
                                      <h5 v-if="views_clicks.android">
                                        {{views_clicks.android.views}}</h5>
                                    </div>
                                    <div class="inner_col">
                                      <p>PERCENTAGE</p>
                                      <h5 v-if="views_clicks.android">
                                        {{views_clicks.android.percentage}}</h5>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div class="state_col details_col">
                            <div class="state_header no_padding details_header">
                                <!-- <div class="align_right">
                                    <input class="table_search" type="text">
                                    <div class="search_opener inline_block">
                                        <img
                                            alt="#" src="./../../../../assets/images/search_button.png">
                                            </div>
                                </div> -->
                                <h2>Campaign Details</h2>
                            </div>
                            <div class="stats_columns">
                                <div class="single_column" style="height: 950px;">
                                    <div class="same-height">
                                        <div class="single_widget">
                                            <strong class="single_title">{{campaign.name}}</strong>

                                            <ul class="variant_list fluid list_none" v-if="variants != undefined">
                                                <li class="anchor_pointer"
                                                    v-bind:class="index == currentVariant ? 'active': ''"
                                                    v-for="(variant, index) in variants.length"
                                                    v-on:click="shiftVariant(variant-1)">
                                                    Variant
                                                </li>
                                            </ul>

                                            <div class="languages_holder">
                                                <ul class="list_none flags flag_mode"
                                                    v-if="variants != undefined && variants.length > 0">
                                                    <li class="anchor_pointer"
                                                        v-bind:class="variants[currentVariant].lang[currentLang].language == language.value ? 'active': ''"
                                                        v-for="language in variants[currentVariant].totalLang"
                                                        v-on:click="shiftLang(language.value)">
                                                        <img alt="England" v-bind:src="language.imgUrl">
                                                        <i class="fas fa-times"></i></li>
                                                </ul>
                                                <div class="table_header_holder" style="padding-bottom: 15px;"
                                                     v-if="variants != undefined && campaign.campaign_type != undefined && campaign.campaign_type.toLowerCase() != 'email'">
                                                    <div class="col dummyCol" style="width: 100%">
                                                        <div class="holder" style="overflow: hidden;">
                                                            <select style="width: 98%; float: left"
                                                                    v-model="changeDevice">
                                                                <option v-bind:value="'iphone'">
                                                                    IPHONE
                                                                </option>
                                                                <option v-bind:value="'android_mob'">
                                                                    SAMSUNG
                                                                </option>
                                                                <option v-bind:value="'ipad'">
                                                                    IPAD PRO
                                                                </option>
                                                                <option v-bind:value="'android_tablet'">
                                                                    SAMSUNG TAB
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="confirm_dummy" style="height: 680px">
                                                <div class="preview_skin"
                                                     v-bind:class="changeDevice"
                                                     v-if="variants != undefined && campaign.campaign_type != undefined && campaign.campaign_type.toLowerCase() != 'email'">
                                                    <div class="iframe_holder">
                                                        <iframe class="iframe_el"
                                                                v-bind:srcdoc="iframeStyleLink + variants[currentVariant].lang[currentLang].templateInfo.template"></iframe>
                                                    </div>
                                                </div>
                                                <div class="iframe_holder">
                                                    <iframe class="email_campaign_preview"
                                                            style="width: 100%; height: 100%; border: none"
                                                            v-bind:srcdoc="variants[currentVariant].lang[currentLang].templateInfo.template"
                                                            v-if="variants != undefined && campaign.campaign_type != undefined && campaign.campaign_type.toLowerCase() == 'email'"></iframe>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="single_column">
                                    <div class="same-height">
                                        <div class="single_widget">
                                            <strong class="single_title">
                                                <a class="float_right" data-target="#delivery_details"
                                                   data-toggle="modal"
                                                   href="#">
                                                    <!-- <img alt="#" class="apps_icon"
                                                         src="./../../../../assets/images/file_icon.png"> -->
                                                          Details
                                                </a>
                                                <span>Delivery Window</span>
                                            </strong>
                                            <ul class="list_none timings">
                                                <li>
                                                    <strong class="inner_title">START TIME :</strong>
                                                    <span class="inner_txt">{{campaign.start_time}}</span>
                                                </li>
                                                <li>
                                                    <strong class="inner_title">END TIME: </strong>
                                                    <span class="inner_txt">{{campaign.end_time}}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="single_widget">
                                            <strong class="single_title">Targeted Audience</strong>
                                            <ul class="list_none timings fluid">
                                                <li>
                                                    <strong class="inner_title">SEGMENT :</strong>
                                                    <div class="inner_cols">
                                                        <div class="inner_col" v-for="segment in campaign.segments">
                                                            <p>{{segment.name}}</p>
                                                            <h5>{{segment.row_count}}</h5>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div v-if="campaignExpireStatus == 0" class="single_widget">
                                            <table class="performance_table">
                                                <thead>
                                                <tr>
                                                    <th colspan="2">Performance Statistics</th>
                                                    <th><em class="indi_icon"></em> Best Day</th>
                                                    <th><em class="indi_icon red"></em> Worst Day</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td colspan="2"><span>VIEWS</span></td>
                                                    <td><em class="indi_icon" v-if="views[0]"></em>
                                                        <span v-if="views[0]"> {{views[0]["viewed_date"]}}</span>
                                                        <span v-else> N/A</span>
                                                    </td>
                                                    <td><em class="indi_icon red" v-if="views[1]"></em>
                                                        <span v-if="views[1]"> {{views[1]["viewed_date"]}}</span>
                                                        <span v-else> N/A</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2"><span>CLICKS</span></td>
                                                    <td><em class="indi_icon" v-if="clicks[0]"></em>
                                                        <span v-if="clicks[0]"> {{clicks[0]["click_date"]}}</span>
                                                        <span v-else> N/A</span>
                                                    </td>
                                                    <td><em class="indi_icon red" v-if="clicks[1]"></em>
                                                        <span v-if="clicks[1]"> {{clicks[1]["click_date"]}}</span>
                                                        <span v-else> N/A</span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
    import listing from '../../../otherComponents/datatable/datatableComponent';
    import tracking from './stats/tracking'
    import Step1 from "./campaignCreationSteps/step1";
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: "campaign-Stats",
        components: {
            Step1,
            tracking,
            listing,
            Datepicker
        },
        mounted() {
            let id = this.$route.params.id;
            this.actionDataTable.payLoad.id = id;
            this.getStyleLink();
            this.getCampaignStats();
            this.getById(id, this.renderViewClickChart);
            this.getByViewsClicks(id);
            this.getLinkActivityStats();
            // this.exportActivityStats();
        },
        data() {
            return {
                actionDataTable: {
                    reloadProp: false,
                    componentName: "campaignStats",
                    column: ['event_id', 'event_value', 'track_key', 'device_type', 'campaign_code', 'created_at', 'action'],
                    mapColumns: ['event_id', 'event_value', 'track_key', 'device_type', 'campaign_code', 'created_at'],
                    filterable: ['event_id', 'event_value', 'track_key', 'device_type', 'campaign_code', 'created_at'],
                    sortable: ['event_id', 'event_value', 'track_key', 'device_type', 'campaign_code', 'created_at'],
                    headings: {
                        event_id: 'Event',
                        event_value: 'Value',
                        track_key: 'Track Key',
                        device_type: 'Device Type',
                        campaign_code: 'Campaign Code',
                        created_at: 'Created At',
                        action: 'Action'
                    },
                    columnsClasses: {
                        event_id: '',
                        event_value: '',
                        track_key: '',
                        device_type: '',
                        campaign_code: '',
                        created_at: '',
                        action: ''
                    },
                    payLoad: {
                        "resource": "campaign/action/list",
                        "action": "get",
                        "id": ''
                    },
                    searchProp: {},
                    customFilters: ['action_table_filter', 'action_table_type'],
                    campaignFilterProp: {},
                    actionFilter: {}
                },
                actionType: '',
                campaign: {},
                campaignExpireStatus: 1,
                views: {},
                clicks: {},
                action: {
                    start: '',
                    end: '',
                    type: '',
                    global: ''
                },
                views_clicks: {},
                model_views_clicks: {
                    start_date: '',
                    end_date: ''
                },
                variants: {},
                iframeStyleLink: '',
                currentVariant: 0,
                currentLang: 0,
                changeDevice: "iphone",
                activetab: "views",
                pieChartData: [],
                barChartData: [],
                activityStats: {
                  opened: 0,
                  openedPercentage: 0,
                  notOpened: 0,
                  bounced: 0,
                  bouncedPercentage: 0,
                  uniqueOpens: 0,
                  uniqueClicks: 0,
                  clicksPercentage: 0
                },
                linkActivityData: {},
                lastTenOpenedData: {},
                campaignTriggerStatus: false

            }
        },
        methods: {
          exportActivityStats(type){
            let id = this.$route.params.id;

            var payload = {
              resource: "campaign/stats/campaign-activity-stats-export",
              action: "get",
              data: {
                type: type
              },
              id: id,
            };
            this.api("post",
                this.constants.getUrl("backendApiUrl"),
                payload,
                this.authHeaders
            ).then((response) => {
              console.log("export stats ", response.data.data);
              window.location.href = this.constants.backendUrl + '/download/exportCSV/' + response.data.data.company_id + '/' + response.data.data.file_name;
            }).catch((error) => {
            });
          },
          getLinkActivityStats(){
            let id = this.$route.params.id;

            var payload = {
              resource: "campaign/stats/link-activity-stats",
              action: "get",
              id: id
            };
            this.api("post",
                this.constants.getUrl("backendApiUrl"),
                payload,
                this.authHeaders
            ).then((response) => {
              this.linkActivityData = response.data.data.link_activity;
              this.lastTenOpenedData = response.data.data.last_ten_opened;
              console.log("Link Activity stats ", response.data.data.link_activity);
              console.log("Last ten opened stats ", response.data.data.last_ten_opened);
              // this.renderLinkActivityStats();
            }).catch((error) => {
            });
          },
          renderBarChart(){
            var chart = new CanvasJS.Chart("chartContainer2", {
              animationEnabled: true,

              title:{
                text:"Activity",
                fontFamily: "Lato",
                fontColor: "#666"
              },
              axisX:{
                interval: 1,
                labelFontColor: "black",
              },
              axisY2:{
                interlacedColor: "white",
                gridColor: "rgba(1,77,101,.1)",
                labelFontColor: "black"
              },
              data: [{
                type: "bar",
                name: "companies",
                axisYType: "secondary",
                // color: "#014D65",
                dataPoints: this.barChartData
              }]
            });
            chart.render();

          },
          getBarChartData(){

            let id = this.$route.params.id;

            var payload = {
              resource: "campaign/stats/activity-chart",
              action: "get",
              id: id
            };
            this.api("post",
                this.constants.getUrl("backendApiUrl"),
                payload,
                this.authHeaders
            ).then((response) => {
              this.barChartData = response.data.data.activityChart;
              this.activityStats = response.data.data.activityStats;
              console.log("Activity chart ", this.barChartData);
              console.log("Activity activityStats ", this.activityStats);
              this.renderBarChart();
              $('.loader_content .ajax_loader_graph').css('display', 'none');
            }).catch((error) => {
            });
          },
          explodePie (e) {
          if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
          } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
          }
          e.chart.render();

        },
          renderPieChart(){

            CanvasJS.addColorSet("customColorSet1",
            [//colorSet Array
                "#4661EE",
                "#EC5657",
                "#1BCDD1",
                "#8FAABB",
                "#B08BEB",
                "#3EA0DD",
                "#F5A52A",
                "#23BFAA",
                "#FAA586",
                "#EB8CC6",
          ]);

            var chart = new CanvasJS.Chart("chartContainer", {
              colorSet:  "customColorSet1",
              exportEnabled: true,
              animationEnabled: true,
              title:{
                text: "Top Countries",
                fontFamily: "Lato",
                fontColor: "#666"
              },
              legend:{
                cursor: "pointer",
                itemclick: this.explodePie
              },
              data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: this.pieChartData
              }]
            });
            chart.render();
          },
          getPieChartData(callback){

            let id = this.$route.params.id;

            var payload = {
              resource: "campaign/stats/countries-chart",
              action: "get",
              id: id
            };
            this.api("post",
                this.constants.getUrl("backendApiUrl"),
                payload,
                this.authHeaders
            ).then((response) => {
              this.pieChartData = response.data.data;
              console.log("Pie chart ", response.data.data);
              this.renderPieChart();
              if(typeof callback == 'function') callback();
            }).catch((error) => {
            });
          },
           renderViewClickChart(){
             if(this.campaignExpireStatus == 0){

               this.getChart('views');
               this.getChart('clicks');
               this.getChart('click_through');
             }
           },
            customFormatter(date) {
                return moment(date).format('DD/MM/YYYY');
                },
            changeVariantLang(data) {
                this.shiftVariant(data.variantIndex);
                this.shiftLang(data.lang);
            },
            actionTriggerListReload() {
                this.actionDataTable.reloadProp = !this.actionDataTable.reloadProp;
            },
            shiftVariant(index) {
                this.currentLang = 0;
                this.currentVariant = index;
            },
            shiftLang(value) {
                let langArr = this.variants[this.currentVariant].lang;
                for (let i = 0; i < langArr.length; i++) {
                    if (langArr[i].language == value) {
                        this.currentLang = i;
                        break;
                    }
                }
            },
            getStyleLink() {
                let url = window.location.href.replace('#' + this.$route.path, '') + '/src/assets/css/templates.css';
                fetch(
                    url
                ).then((response) => {
                    response.text().then((text) => {
                        this.iframeStyleLink = "<style>" + text + "</style>";
                    });
                });
            },
            getCampaignStats: function () {
                var options3 = {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light1", // "light1", "light2", "dark1", "dark2"
                    title: {
                        text: ""
                    },
                    dataPointWidth: 25,
                    data: [{
                        type: "column", //change type to bar, line, area, pie, etc
                        //indexLabel: "{y}", //Shows y value on all Data Points
                        indexLabelFontColor: "#5A5757",
                        indexLabelPlacement: "outside",
                        dataPoints: [
                            {x: 10, y: 71, color: "#7cb5ec"},
                            {x: 13, y: 51, color: "#434348"},

                            {x: 25, y: 65, color: "#7cb5ec"},
                            {x: 28, y: 25, color: "#434348"},

                            {x: 40, y: 69, color: "#7cb5ec"},
                            {x: 43, y: 47, color: "#434348"},

                            {x: 55, y: 63, color: "#7cb5ec"},
                            {x: 58, y: 32, color: "#434348"},

                            {x: 70, y: 25, color: "#7cb5ec"},
                            {x: 73, y: 85, color: "#434348"},

                            {x: 85, y: 66, color: "#7cb5ec"},
                            {x: 88, y: 74, color: "#434348"},

                            {x: 100, y: 58, color: "#7cb5ec"},
                            {x: 103, y: 30, color: "#434348"}
                        ]
                    }]
                };
                // $("#chart3").CanvasJSChart(options3);
                // $("#chart4").CanvasJSChart(options3);
                // $("#chart5").CanvasJSChart(options3);
            },
            getById(id, callback) {
                var payload = {
                    resource: "campaign/stats",
                    action: "get",
                    id: id
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payload,
                    this.authHeaders
                ).then((response) => {

                    let data = response.data.data;

                    this.campaignTriggerStatus = data.campaignTriggerStatus;
                    this.campaign = data.campaign;
                    this.campaignExpireStatus = data.campaign.is_remove_cache;
                    this.views = data.views;
                    this.clicks = data.clicks;
                    //this.campaign.campaign_type.toLowerCase() != 'email'
                    this.variants = data.variants;

                    if(typeof callback == 'function')callback();
                    if(this.campaignTriggerStatus){
                      this.getPieChartData( () => {
                        if(this.campaign.campaign_type == 'email'){
                          this.getBarChartData();
                        }else{
                          $('.loader_content .ajax_loader_graph').css('display', 'none');
                        }
                      });
                    }
                }).catch((error) => {
                });
            },
            filterActionTrigger() {
                let data = {
                    type: this.action.type,
                    start_date:(this.action.start != '') ? moment(this.action.start).format('YYYY-MM-DD') : '',
                    end_date: (this.action.end != '') ? moment(this.action.end).format('YYYY-MM-DD') : '',
                    global: this.action.global
                };

                this.actionDataTable.searchProp = data
            },
            globalFilterActionTrigger() {
                /*if (this.action.global.length == 0) {
                    return false;
                }*/
                this.action.type = '';
                this.action.start = '';
                this.action.end = '';
                this.filterActionTrigger();
                //this.action.global = ''
            },
            getByViewsClicks(id) {
                var payload = {
                    resource: "campaign/stats/views-clicks",
                    action: "get",
                    data:{
                    start_date: (this.model_views_clicks.start_date != '') ? moment(this.model_views_clicks.start_date).format('YYYY-MM-DD') : '',
                    end_date: (this.model_views_clicks.end_date != '') ? moment(this.model_views_clicks.end_date).format('YYYY-MM-DD') : '',
                     },
                    id: id
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payload,
                    this.authHeaders
                ).then((response) => {
                    let data = response.data.data;
                    console.log("views_clicks", data);
                    this.views_clicks = data
                }).catch((error) => {
                });
            },
            filterViewsCount() {
                let id = this.$route.params.id;
                this.getByViewsClicks(id)
            },
            getChart(type) {
                let $this = this;
                let id = this.$route.params.id;

                var payload = {
                    resource: "campaign/stats/chart",
                    action: "get",
                    id: id,
                    data: {
                        "type": type
                    }
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payload,
                    this.authHeaders
                ).then((response) => {
                    console.log("chart " + type, response.data.data);

                    $this.$nextTick(() => {
                        $this.chartSelector(response.data.data, type)
                    });
                }).catch((error) => {
                });
            },
            chartSelector(data, type) {
                var options = {
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light1", // "light1", "light2", "dark1", "dark2"
                    dataPointWidth: 25,
                    title: {
                        text: ""
                    },
                    axisY: {
                        title: ""
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: this.toggleDataSeries
                    },
                    toolTip: {
                        shared: true,
                        content: this.toolTipFormatter
                    },
                    data: data
                };
                $("#chart_" + type).CanvasJSChart(options);
            },
            toolTipFormatter(e) {
                var str = "";
                var total = 0;
                var str3;
                var str2;
                for (var i = 0; i < e.entries.length; i++) {
                    var str1 = "<span style= \"color:" + e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>" + e.entries[i].dataPoint.y + "</strong> <br/>";
                    total = e.entries[i].dataPoint.y + total;
                    str = str.concat(str1);
                }
                str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
                str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
                return (str2.concat(str)).concat(str3);
            },
            toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            },
        },
        watch: {
            actionType: {
                handler(actionType) {
                    this.actionDataTable.actionFilter = actionType;
                }

            }
        }
    }
</script>

<style scoped>
    .flags li.active {
        background: gainsboro;
    }

    .languages_holder .flag_mode {
        text-align: left !important;
        margin-top: 20px !important;
        margin-left: 8px !important;
    }



    .h_charts .col_row .tag.add {
      border-radius: 3px;
      background: #9e9c9c;
    }

    .h_charts .col_row em {
      font-size: 17px;
      line-height: 21px;
      color: #656565;
      margin: 0 7px;
    }
    .h_charts .col_row .tag {
      padding: 0 6px;
      color: #fff;
      background: #656565;
      border-radius: 30px;
      font-size: 13px;
    }
    .h_charts .col_row span, .h_charts .col_row em {
      display: inline-block;
      vertical-align: middle;
      font-style: normal;
    }
    .h_charts .col_row {
      overflow: hidden;
      font-size: 13px;
      line-height: 17px;
      margin: 0 0 12px;
      text-align: left !important;
    }
    .h_charts .col:first-child {
      float: left;
    }
    .h_charts .col {
      height:123px;
      float: right;
      width: 48%;
      background: #dedcdc;
      padding: 20px 20px 5px;
    }
    .h_charts {
      margin:0 0 30px;
      overflow: hidden;
    }
    .h_charts .col_row em i {
      margin: 0 5px;
      color: #656565;
    }
    .d_table{
      width:100%;
      height:100%;
      display: table;
    }
    .v_middle{
      width:100%;
      height:100%;
      display: table-cell;
      vertical-align: middle;
    }
    .h_table h2 {
      font-size: 21px;
      line-height: 25px;
      margin: 0;
      padding:0 20px 14px;
    }
    .h_table table th, .h_table table td {
      padding: 6px 20px;
    }

    .h_table table tbody tr:nth-child(odd) {
      background: #e8e4e4;
    }
    /*.h_table table th:first-child {*/
    /*  width: 94%;*/
    /*}*/
    .h_table table th {
      color: #656565;
    }
    .h_table table {
      width: 100%;
      table-layout: fixed;
    }
    .h_table.add table th:first-child {
      width: auto;
    }
    .h_table {
      overflow: hidden;
      margin: 0 0 30px;
    }
    .status_tag {
      display: inline-block;
      vertical-align: top;
      background: #4c9698;
      color: #fff;
      border-radius: 5px;
      padding: 2px 7px 5px;
      font-size: 13px;
      line-height: 17px;
    }
    div#chartContainer:after,
    #chartContainer2:after{
      width: 100px;
      height: 13px;
      position: absolute;
      content: '';
      left: 0;
      background: #fff;
      bottom: 0;
    }

    #chartContainer2:after{
      width: 100%;
    }

    #chartContainer,
    #chartContainer2{
      position: relative;
    }
    .loader_content{
      position: relative;
      overflow: hidden;
    }
    .loader_content .ajax_loader_graph{
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }

    .ajax_loader_graph {
      display: none;
      position: fixed;
      top: 68px;
      left: 96px;
      height: 100%;
      right: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 100;
    }

    .ajax_loader_graph img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 110px;
      transform: translate(-60%, -70%);
    }


</style>
