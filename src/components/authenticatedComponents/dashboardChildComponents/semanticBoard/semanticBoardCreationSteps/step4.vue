<template>
    <div class="tab" id="setting_tab">
        <div class="inner_tab_widget">
            <div class="heading_holder">
                <h2>Targeting Options</h2>
            </div>
            <div class="txt_holder">
                <div class="row">
                    <strong>Target users by choosing multiple segments they must fall
                        into.
                        Further refine your audience by adding additional
                        filters.</strong>
                </div>
            </div>
        </div>
        <div class="inner_tab_widget">
            <div class="heading_holder">
                <h2>Rate Limiting</h2>
            </div>
            <div class="txt_holder">
                <div class="row">
                    <input type="checkbox" v-model="segmentObj.rateLimit.enable" id="allow_rate_limit" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                    <label for="allow_rate_limit"><i aria-hidden="true" class="fa fa-check-square"></i> Enable rate
                        limiting</label>
                </div>
                <div v-show="segmentObj.rateLimit.enable" class="row big_inputs">
                    <strong>Every</strong>
                    <input type="number" min="1" placeholder="1" v-model="segmentObj.rateLimit.boardRateLimit" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                    <select class="fix_width" v-model="segmentObj.rateLimit.durationUnit" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                        <option v-for="unit in rateLimitUnit" v-bind:value="unit">{{unit.charAt(0).toUpperCase() +
                            unit.slice(1)}}
                        </option>
                    </select>
                    <select v-model="segmentObj.rateLimit.durationValue" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                        <option v-for="value in rateLimitDurationValue" v-bind:value="value">{{value}}</option>
                    </select>
                    <strong>Users</strong>
                    <p class="error">{{errors.rateLimit.boardRateLimit.message}}</p>
                </div>
            </div>
        </div>
        <!-- <div v-if="delivery.selectedScheduleType.value != 'once'" class="inner_tab_widget"> -->
        <div  class="inner_tab_widget">
            <div class="heading_holder">
                <h2>Default Delay Control</h2>
            </div>
            <div class="txt_holder">
                <div class="row">
<!--                    <input v-model="delivery.deliveryEnable" type="checkbox" id="allow_users">-->
<!--                    <label for="allow_users"><i class="fa fa-check-square" aria-hidden="true"></i> Allow users-->
<!--                        to become re-eligible to-->
<!--                        receive campaign</label>-->
                </div>
<!--                <div v-show="delivery.deliveryEnable">-->
                    <div>

                    <!--                    <div class="row">-->
<!--                        <p class="notice_bar">Messaging Platform will send messages according to your message-->
<!--                            variant distribution each time users become re-legible. As a result, users may-->
<!--                            receive-->
<!--                            different message variants than they received on prior sends. In order to preserve-->
<!--                            the-->
<!--                            integrity of a historical control group if distributions change, you cannot use a-->
<!--                            control group with this option.</p>-->
<!--                    </div>-->
                    <div class="row">
                        <input type="number" placeholder="1" min="0" v-model="delivery.deliveryControl.value" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                        <select class="fix_width" v-model="delivery.deliveryControl.selectedUnit" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">
                            <option v-for="unit in deliveryUi.units" v-bind:value="unit">{{unit.label}}</option>
                        </select>
                        <p class="error">{{errors.deliveryControl.value.message}}</p>
                    </div>
                </div>
            </div>
        </div>
<!--        <div class="inner_tab_widget">-->
<!--            <div class="heading_holder">-->
<!--                <h2>Priority</h2>-->
<!--            </div>-->
<!--            <div class="txt_holder">-->
<!--                <div class="row">-->
<!--                    <strong>Select Message Priority</strong>-->
<!--                    <select style="width: 12% !important;" v-model="delivery.deliveryControl.selectedPriority">-->
<!--                        <option v-for="priority in deliveryUi.priorities" v-bind:value="priority">-->
<!--                            {{priority.label}}-->
<!--                        </option>-->
<!--                    </select>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="inner_tab_widget">-->
<!--            <div class="heading_holder">-->
<!--                <h2>Frequency Capping</h2>-->
<!--            </div>-->
<!--            <div class="txt_holder">-->
<!--                <div class="row">-->
<!--                    <strong class="fluid no_b_margin">-->
<!--                        <div class="no_float">-->

<!--                            <div class="an-onoffswitchContainer">-->
<!--                                <input type="checkbox" name="check1"-->
<!--                                       class="abs_input an-onoffswitch-checkbox"-->
<!--                                       id="an-onoffswitch0"-->
<!--                                       v-bind:class="delivery.cappingValue ? 'active': ''"-->
<!--                                       v-model="delivery.cappingValue">&lt;!&ndash;an-switch&ndash;&gt;-->
<!--                                <label class="an-onoffswitch-label" for="an-onoffswitch0">-->
<!--                                    <span class="an-onoffswitch-inner"></span>-->
<!--                                    <span class="an-onoffswitch-switch"></span>-->
<!--                                </label>-->
<!--                            </div>-->

<!--                            <strong>This campaign follows your Frequency Capping rules</strong>-->
<!--                            <router-link class="view_cap_rules" to="/dashboard/campaign/capping-settings"><i-->
<!--                                    class="fa fa-eye" aria-hidden="true"></i> View-->
<!--                            </router-link>-->
<!--                        </div>-->
<!--                    </strong>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        name: "step4",
        props: ['hitApi', 'boardId', 'selectedScheduleType', 'getBoardStep','boardStatus'],
        data() {
            return {
                locked: true,
                rateLimitUnit: [
                    "minutes",
                    "hours",
                    "days",
                    "weeks",
                ],
                rateLimitDurationValue: [
                    100,
                    500,
                    1000
                ],
                segmentObj: {
                    rateLimit: {
                        enable: true,
                        boardRateLimit: 1,
                        durationValue: 100,
                        durationUnit: 'minutes',
                    }
                },
                deliveryUi: {
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
                    units: [
                        // {
                        //     label: "Minute",
                        //     value: "minute"
                        // },
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
                },
                delivery: {
                    cappingValue: true,
                    step: "setting",
                    deliveryEnable: true,
                    selectedScheduleType: this.selectedScheduleType,
                    deliveryControl: {
                        value: 1,
                        selectedUnit: {
                            label: "Day",
                            value: "day"
                        }
                    }
                },
                errors: {
                    rateLimit: {
                        boardRateLimit: {
                            message: ''
                        }
                    },
                    deliveryControl: {
                        value: {
                            message: ''
                        }
                    },
                }
            };
        },
        mounted() {
            this.delivery.deliveryEnable = true;
        },
        methods: {
            submitStep() {
                if (this.validate() && this.validateDeliveryControl()) {

                    this.delivery.rateLimit = this.segmentObj.rateLimit;

                    const payLoad = {
                        resource: "board",
                        action: "update",
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

                let success = [];
                let errors = {
                    deliveryControl: {
                        value: {
                            message: ''
                        }
                    },
                    rateLimit: {
                        boardRateLimit: {
                            message: ''
                        }
                    },

                };
                this.errors = JSON.parse(JSON.stringify(errors));

                if (this.segmentObj.rateLimit.enable) {
                    let expression = /^[1-9][0-9]*$/gi;
                    if (!expression.test(this.segmentObj.rateLimit.boardRateLimit)) {
                        success = false;
                        this.errors.rateLimit.boardRateLimit.message = 'Rate limit value can only be a positive integer';
                    }
                }
                // debugger
                // if (this.delivery.deliveryEnable && success) {
                //     success = this.validateDeliveryControl();
                // }
                return success;

            },
            validateDeliveryControl() {
                let success = true;
                let expression = /^[1-9][0-9]*$/gi;

                // if (!expression.test(this.delivery.deliveryControl.value)) {
                if (this.delivery.deliveryControl.value) {
                    // success = false;
                    // returning success to true in 0 value case too
                    success = true;
                    if(this.delivery.deliveryControl.value < 0){
                        this.errors.deliveryControl.value.message = 'Unit value can only be a positive integer';
                        success = false;
                    }
                } else {
                    this.errors.deliveryControl.value.message = '';
                }

                return success;
            }
        },
        watch: {
            hitApi: {
                handler(currVal, oldVal) {
                    if (currVal.step == 4) {
                        this.submitStep();
                    }
                },
                deep: true
            },
            selectedScheduleType: {
                handler(currVal, oldVal) {
                    this.delivery.selectedScheduleType = currVal;
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
                        this.segmentObj.rateLimit = currVal.rateLimit;
                        this.delivery.selectedScheduleType = currVal.selectedScheduleType;
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
            }
        }
    }
</script>

<style scoped>

</style>