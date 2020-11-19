<template>

    <div class="tab" id="schedule_tab">
        <div class="inner_tab_widget">
            <div class="heading_holder">
                <h2>Entry Schedule</h2>
                <p>Decide when users should enter the Semantix Board</p>
            </div>
            <div class="txt_holder">
                <ul class="inner_tabs list_none no_border">
                    <li class="active"><a href="#schedule" class="locked">Schedule</a></li>
                </ul>
            </div>
        </div>
        <div class="inner_tab_content">
            <div class="inner_tab_text active" id="schedule">
                <header class="inner_tab_header">
                    <strong>Once trigger event criteria are met, send this
                        campaign</strong>
                    <select v-model="delivery.selectedScheduleType" v-on:change="changeScheduleType" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                        <option v-for="type in deliveryUi.scheduleType" v-bind:value="type">{{type.label}}</option>
                    </select>
                    <!-- <select class="week_days" v-show="delivery.selectedScheduleType.value == 'weekly'" multiple
                            v-model="delivery.selectedDays" :disabled="boardStatus.status === 'active'">
                        <option v-for="day in deliveryUi.days" v-bind:value="day">{{day.label}}</option>
                    </select> -->
                     <multiselect class="week_days" v-show="delivery.selectedScheduleType.value == 'weekly'" v-model="delivery.selectedDays" :options="deliveryUi.days" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Please select" label="label" track-by="label">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="delivery.selectedDays.length &amp;&amp; !isOpen">{{ delivery.selectedDays.length }} options selected</span></template>
                    </multiselect>
                     <span class="error">{{errors.selectedDays.message}}</span>
                </header>
                <div class="inner_tab_widget">
                    <div class="heading_holder">
                        <span>Time Zone: <em>UTC</em></span>
                        <h2>Campaign Duration</h2>
                    </div>
                    <div class="txt_holder">
                        <div class="row">
                            <strong>Start Time (Required)</strong>
                            <datepicker :disabled-dates="state.disabledStartDates" @selected="disableEndDates()" v-model="delivery.dateTime.start.date" :format="customFormatter" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'"></datepicker>
                            <!-- <input type="date" class="datepicker" v-model="delivery.dateTime.start.date"
                             v-bind:min="todayDate.date" placeholder="mm/dd/DD" :disabled="boardStatus.status === 'active'"> -->
                            <i>at</i>
                            <select v-model="delivery.dateTime.start.hours" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                                <option v-for="hour in deliveryUi.time.hours">{{ ('0' + (hour - 1)).slice(-2) }}</option>
                            </select>
                            <select v-model="delivery.dateTime.start.mints" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                                <option v-for="mint in deliveryUi.time.mints">{{ ('0' + (mint - 1)).slice(-2) }}</option>
                            </select>
                            <!--                            <select>-->
                            <!--                                <option>pm</option>-->
                            <!--                                <option>am</option>-->
                            <!--                            </select>-->
                            <p class="error">{{errors.startDate.message}}</p>
                          <p v-if="!startDateExpiryValidationStatus" class="error">Start date & time should be greater than current date & time</p>
                        </div>
                        <!-- <div class="row"
                             v-show="delivery.selectedScheduleType.value != 'once' || delivery.subStep != 'schedule'"> -->
                            <div class="row">
                            <strong>End Time (Required)</strong>
                            <datepicker v-model="delivery.dateTime.end.date" @selected="makeLockedToFalse()" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'" :disabled-dates="state.disabledEnDDates" :format="customFormatter" placeholder="mm/dd/yyyy" ></datepicker>

                            <!-- <input type="date" class="datepicker"
                                   v-model="delivery.dateTime.end.date" v-bind:min="delivery.dateTime.start.date"
                                   placeholder="mm/dd/DD" :disabled="boardStatus.status === 'active'"> -->
                            <i>at</i>
                            <select v-model="delivery.dateTime.end.hours" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                                <option v-for="hour in deliveryUi.time.hours">{{ ('0' + (hour - 1)).slice(-2) }}</option>
                            </select>
                            <select v-model="delivery.dateTime.end.mints" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                                <option v-for="mint in deliveryUi.time.mints">{{ ('0' + (mint - 1)).slice(-2) }}</option>
                            </select>
                            <!--                            <select>-->
                            <!--                                <option>pm</option>-->
                            <!--                                <option>am</option>-->
                            <!--                            </select>-->
                            <p class="error">{{errors.endDate.message}}</p>
                            <p v-if="!endDateExpiryValidationStatus" class="error">End date & time should be greater than current date & time</p>
                        </div>
                        <!--                        <div class="row">-->
                        <!--                            <input type="checkbox" id="send_campaign">-->
                        <!--                            <label for="send_campaign"><i class="far fa-square"></i>-->
                        <!--                                Send-->
                        <!--                                campaign to users in their local time zone</label>-->
                        <!--                        </div>-->
                        <div class="row">
                            <p><b>Summary:</b> Send Campaign immediately after trigger
                                criteria are met, beginning at
                                {{delivery.dateTime.start.hours}}:{{delivery.dateTime.start.mints}} (Time Zone: UTC)</p>
                        </div>
                    </div>
                </div>
                <div class="inner_tab_widget">
                    <div class="heading_holder">
                        <h2>Priority</h2>
                    </div>
                    <div class="txt_holder">
                        <div class="row">
                            <strong>Select Message Priority</strong>
                            <select style="width: 12% !important;" v-model="delivery.deliveryControl.selectedPriority" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                                <option v-for="priority in deliveryUi.priorities" v-bind:value="priority">
                                    {{priority.label}}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
    export default {
        components: {
    Datepicker,
    Multiselect
  },
        name: "step2",
        props: ['hitApi', 'boardId', 'getBoardStep','boardStatus'],
        mounted() {
            this.populateStartDateUtc();
            this.populateEndDateUtc();
            this.setMyDateToToday();
            this.state.disabledStartDates.to.setDate(this.state.disabledStartDates.to.getDate() - 1);
            // this.disableEndDates();
            $('.multiselect__element span').removeAttr('data-select');
            $('.multiselect__element span').removeAttr('data-deselect');
            $('.multiselect__element span').removeAttr('data-selected');
        },
        data() {
            return {
                locked: true,
                deliveryUi: {
                    enableCappingControl: true,
                    time: {
                        hours: 24,
                        mints: 60,
                    },
                    scheduleType: [
                        {
                            label: "Once",
                            value: "once"
                        },
                        {
                            label: "Daily",
                            value: "daily"
                        },
                        {
                            label: "Weekly",
                            value: "weekly"
                        },
                    ],
                    units: [
                        {
                            label: "Minute",
                            value: "minute"
                        },
                        {
                            label: "Day",
                            value: "day"
                        },
                        {
                            label: "Week",
                            value: "week"
                        },
                        {
                            label: "Month",
                            value: "month"
                        }
                    ],
                    priorities: [
                        {
                            label: "Low",
                            value: "low",
                        },
                        {
                            label: "Medium",
                            value: "medium",
                        },
                        {
                            label: "High",
                            value: "high",
                        },
                    ],
                    days: [
                        {
                            label: "Monday",
                            value: "monday"
                        },
                        {
                            label: "Tuesday",
                            value: "tuesday"
                        },
                        {
                            label: "Wednesday",
                            value: "wednesday"
                        },
                        {
                            label: "Thursday",
                            value: "thursday"
                        },
                        {
                            label: "Friday",
                            value: "friday"
                        },
                        {
                            label: "Saturday",
                            value: "saturday"
                        },
                        {
                            label: "Sunday",
                            value: "sunday"
                        },

                    ],
                    reInject: true,
                    dummyAction: {
                        id: -1,
                        code: "null",
                        name: "Choose Actions...",
                        values: []
                    },
                    selectedAction: {
                        id: -1,
                        code: "null",
                        name: "Choose Actions...",
                        values: []
                    },
                    actions: [],
                    actionDelayValue: [
                        "second",
                        "minute",
                        "hour"
                    ]
                },
                delivery: {
                    // cappingValue: true,
                    step: "delivery",
                    subStep: 'schedule',
                    // deliveryEnable: true,
                    selectedScheduleType: {
                        label: "Once",
                        value: "once"
                    },
                    selectedDays: [],
                    dateTime: {
                        start: {
                            date: "",
                            hours: 0,
                            mints: 0
                        },
                        end: {
                            date: "",
                            hours: 0,
                            mints: 0
                        }
                    },
                    deliveryControl: {
                        // value: 1,
                        // selectedUnit: {
                        //     label: "Day",
                        //     value: "day"
                        // },
                        selectedPriority: {
                            label: "Low",
                            value: "low",
                        }
                    },
                },
                todayDate: {
                           date: "",
                            hours: 0,
                            mints: 0
                },
                errors: {
                    startDate: {
                        message: '',
                    },
                    endDate: {
                        message: '',
                    },
                    // deliveryControl: {
                    //     value: {
                    //         message: ''
                    //     }
                    // },
                    selectedDays: {
                        message: ''
                    },
                    action: {
                        message: ''
                    }

                },
                state : {
                 disabledEnDDates: {
                  to: new Date()
                },
                disabledStartDates: {
                    to: new Date()
                }
               },
              startDateExpiryValidationStatus: true,
              endDateExpiryValidationStatus: true
            }
        },
        methods: {
             checkExpireStartAndEndDates(startDate, endDate){

               var currentIsoDate = new Date();
               currentIsoDate = currentIsoDate.toISOString();
               var currentHours = parseInt(currentIsoDate.split(":")[0].split("T")[1]);
               var currentMins = parseInt(currentIsoDate.split(":")[1]);

            var currentDate = currentIsoDate.split(":")[0].split("T")[0];
            var currentDateTime = currentDate + '-' + ('0' + currentHours).slice(-2) + '-' + ('0' + currentMins).slice(-2)

            let status = true;
            if(startDate && startDate < currentDateTime){
              this.startDateExpiryValidationStatus = false;
              status = false;
            }else{
              this.startDateExpiryValidationStatus = true;
            }

            if(endDate != ''){
              if(endDate < currentDateTime){
                this.endDateExpiryValidationStatus = false;
                status = false;
              }else{
                this.endDateExpiryValidationStatus = true;
              }
            }

            return status;

          },
             makeLockedToFalse() {
             this.locked = false;
            },
             customFormatter(date) {
            return moment(date).format('DD/MM/YYYY');
            },
         disableEndDates(){
        setTimeout(() => {
            this.state.disabledEnDDates.to = new Date(this.delivery.dateTime.start.date);
            this.state.disabledEnDDates.to.setDate(this.state.disabledEnDDates.to.getDate() + 1);
        }, 100);
        },
            setMyDateToToday() {
              var isoDate = new Date();
                isoDate.setMinutes(isoDate.getMinutes() + 3);
                isoDate = isoDate.toISOString();

                this.todayDate.date = isoDate.split(":")[0].split("T")[0];
                this.todayDate.hours = ('0' + (parseInt(isoDate.split(":")[0].split("T")[1]))).slice(-2);
                this.todayDate.mints = ('0' + (parseInt(isoDate.split(":")[1]))).slice(-2);
            },
            populateStartDateUtc() {
                var isoDate = new Date();
                isoDate.setMinutes(isoDate.getMinutes() + 3);
                isoDate = isoDate.toISOString();

                this.delivery.dateTime.start.date = isoDate.split(":")[0].split("T")[0];
                this.delivery.dateTime.start.hours = ('0' + (parseInt(isoDate.split(":")[0].split("T")[1]))).slice(-2) || '00';
                this.delivery.dateTime.start.mints = ('0' + (parseInt(isoDate.split(":")[1]))).slice(-2)  || '00';

            },

          populateEndDateUtc() {
                var isoDate = new Date();
                isoDate.setMinutes(isoDate.getMinutes() + 3);
                isoDate = isoDate.toISOString();

                this.delivery.dateTime.end.hours = '00';
                this.delivery.dateTime.end.mints = '00';

            },
            changeScheduleType() {
                if (this.delivery.selectedScheduleType.value != 'weekly') {
                    this.delivery.selectedDays = [];
                }
            },
            validateStartDate(startDate) {
                let success = true;
                if (startDate == '') {
                    success = false;
                    this.errors.startDate.message = 'Start Date is required';
                } else {
                    this.errors.startDate.message = '';
                }
                return success;
            },
            validateEndDate(endDate) {
                let success = true;
                if (endDate == '') {
                    success = false;
                    this.errors.endDate.message = 'End Date is required';
                } else {
                    this.errors.endDate.message = '';
                }
                return success;
            },
            validateStartEndDate(startDate, endDate) {
                let success = true;
                // startDate = new Date(startDate);
                // startDate = JSON.stringify(startDate);
                // startDate = startDate.slice(1,11)
                // startDate = new Date(startDate);

                // endDate = new Date(endDate);
                // endDate = JSON.stringify(endDate);
                // endDate = endDate.slice(1,11)
                // endDate = new Date(endDate);

                 if (endDate != '' && startDate != '') {
                    if (!(endDate > startDate)) {
                        success = false;
                        this.errors.startDate.message = 'Start Date should not be greater than End Date';
                    } else {
                        this.errors.startDate.message = '';
                    }
                }
                return success;
            },
            submitStep() {
                 this.locked = false;
                if (this.validate()) {
                    this.bus.$emit("disableNextBtn", true);
                    this.bus.$emit("startEndDateExpiredEvent", false);
                    let payLoad = {
                        resource: "board",
                        action: 'update',
                        id: this.boardId,
                        data: this.delivery
                    };

                    this.api("post",
                        this.constants.getUrl("backendApiUrl"),
                        payLoad,
                        this.authHeaders,
                        true,
                    ).then((response) => {
                        console.log('response', response);
                        this.bus.$emit("disableNextBtn", false);
                        if (response.data.meta.code === 200) {
                            this.$emit("scheduleType", this.delivery.selectedScheduleType);
                            this.$emit("goNext", response.data.data.id);
                        } else {
                            this.$swal({
                                position: 'top-right',
                                type: 'warning',
                                title: response.data.data.message,
                                showConfirmButton: false,
                                timer: 2500
                            });
                        }
                    }).catch((error) => {
                        console.log('error', error);
                    });
                }

            },
            validate() {
                if(this.delivery.dateTime.end.date) {
                var isoDate = new Date(this.delivery.dateTime.end.date);
                isoDate.setMinutes(isoDate.getMinutes());
                isoDate = isoDate.toISOString();
                }

                if(this.delivery.dateTime.start.date){
                var startIsoDate = new Date(this.delivery.dateTime.start.date);
                startIsoDate.setMinutes(startIsoDate.getMinutes());
                startIsoDate = startIsoDate.toISOString();
                }

                let success = [];
                let startDate = this.delivery.dateTime.start.date != '' ? this.delivery.dateTime.start.date + '-' + ('0' + this.delivery.dateTime.start.hours).slice(-2) + '-' + ('0' + this.delivery.dateTime.start.mints).slice(-2) : '';
                let endDate = this.delivery.dateTime.end.date != '' ? this.delivery.dateTime.end.date + '-' + ('0' + this.delivery.dateTime.end.hours).slice(-2) + '-' + ('0' + this.delivery.dateTime.end.mints).slice(-2) : '';

               if(this.delivery.dateTime.start.date)
                this.delivery.dateTime.start.date = startIsoDate.split(":")[0].split("T")[0];
                if(this.delivery.dateTime.end.date)
                this.delivery.dateTime.end.date = isoDate.split(":")[0].split("T")[0];

              let errors = {
                    startDate: {
                        message: '',
                    },
                    endDate: {
                        message: '',
                    },
                    selectedDays: {
                        message: ''
                    },
                    action: {
                        message: ''
                    }

                };
                this.errors = JSON.parse(JSON.stringify(errors));

                if (this.delivery.subStep == "schedule") {

                    success.push(this.validateStartDate(startDate));
                    success.push(this.checkExpireStartAndEndDates(startDate, endDate));

                    if (this.delivery.selectedScheduleType.value != 'once') {

                        success.push(this.validateEndDate(endDate));
                        success.push(this.validateStartEndDate(startDate, endDate));
                    }
                    if (this.delivery.selectedScheduleType.value == 'once') {
                        // this.delivery.dateTime.end.date = "";
                        // this.delivery.dateTime.end.hours = 0;
                        // this.delivery.dateTime.end.mints = 0;
                    //   success.push(this.validateStartDate(startDate));
                       success.push(this.validateEndDate(endDate));
                       success.push(this.validateStartEndDate(startDate, endDate));
                       success.push(this.checkExpireStartAndEndDates(startDate, endDate));
                    }

                    if (this.delivery.selectedScheduleType.value == 'weekly') {
                        if (this.delivery.selectedDays.length == 0) {
                            success.push(false);
                            this.errors.selectedDays.message = 'Please select days';
                        } else {
                            this.errors.selectedDays.message = '';
                        }
                    }


                } else {

                }

                for (let i = 0; i < success.length; i++) {
                    if (!success[i]) {
                        return success[i];
                    }
                }

                return true;

            },
            updateStep() {
                this.bus.$emit("step2", {

                });
            },
        },
        watch: {
            hitApi: {
                handler(currVal, oldVal) {
                    if (currVal.step == 2) {
                        this.submitStep();
                    }
                },
                deep: true
            },
            boardId(currVal, oldVal) {
                this.action = "update";
                if(currVal){
                this.boardId = currVal;
                } else if (oldVal){
                this.boardId = oldVal;
                }
            },
            getBoardStep: {
                handler(currVal, oldVal) {
                    if (JSON.stringify(currVal) != "{}") {
                        this.delivery = currVal;
                        this.updateStep();
                    }
                },
                deep: true
            },
            boardStatus: {
                 handler(currVal, oldVal) {
                    if (JSON.stringify(currVal) != "{}") {
                    }
                },
                deep: true
            },
            delivery: {
                handler(currVal, oldVal) {
                    if (!this.locked) {
                        this.validate();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

    .week_days {
        height: 76px !important;
        vertical-align: top !important;
        background: none !important;
    }

</style>