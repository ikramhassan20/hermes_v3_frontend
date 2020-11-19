<template>
    <div>
        <div class="page_content_holder">
            <div class="padding_content">
                <div class="white_boxed_content">
                    <div class="list_holder inner_padding full_scroll">
                        <ul class="tabs add list_none inline_list" v-if="step !== 5">
                            <li v-bind:class="step == 1 ? 'active': ''"><a class="anchor_pointer"
                                                                           data-href="#basics_tab">1. General</a></li>
                            <li v-bind:class="step == 2 ? 'active': ''"><a class="anchor_pointer"
                                                                           data-href="schedule_tab">2. Entry
                                Schedule</a></li>
                            <li v-bind:class="step == 3 ? 'active': ''"><a class="anchor_pointer"
                                                                           data-href="audience_tab">3. Entry
                                Audience</a></li>
                            <li v-bind:class="step == 4 ? 'active': ''"><a class="anchor_pointer"
                                                                           data-href="setting_tab">4. Send Settings</a>
                            </li>
                            <li v-bind:class="step == 5 ? 'active': ''"><a class="anchor_pointer"
                                                                           data-href="semantic_final_tab">5. Build
                                Semantic Board</a></li>
                        </ul>
                        <div id="tab-content" class="p_b_50">
                            <step1
                                    v-show="stepComponent == 'step1'"
                                    v-bind:hitApi="hitApi"
                                    v-on:goNext="oneStepNext"
                                    v-bind:boardId="boardId"
                                    v-bind:getBoardStep="getBoardSteps[0]"
                            ></step1>
                            <step2
                                    v-show="stepComponent == 'step2'"
                                    v-bind:hitApi="hitApi"
                                    v-on:goNext="oneStepNext"
                                    v-on:scheduleType="updateScheduleType"
                                    v-bind:boardId="boardId"
                                    v-bind:getBoardStep="getBoardSteps[1]"
                                    v-bind:boardStatus="getBoardSteps[0]"
                            >
                            </step2>
                            <step3 v-show="stepComponent == 'step3'"
                                   v-bind:hitApi="hitApi"
                                   v-on:goNext="oneStepNext"
                                   v-bind:boardId="boardId"
                                   v-bind:getBoardStep="getBoardSteps[2]"
                                   v-bind:boardStatus="getBoardSteps[0]"
                            ></step3>
                            <step4 v-show="stepComponent == 'step4'"
                                   v-bind:hitApi="hitApi"
                                   v-on:goNext="oneStepNext"
                                   v-bind:boardId="boardId"
                                   v-bind:selectedScheduleType="selectedScheduleType"
                                   v-bind:getBoardStep="getBoardSteps[3]"
                                   v-bind:boardStatus="getBoardSteps[0]"
                            ></step4>
                            <step5 v-show="stepComponent == 'step5'"
                                   v-bind:boardId="boardId"
                                   v-bind:selectedScheduleType="selectedScheduleType"
                                   v-bind:getBoardStep="getBoardSteps[4]"
                                   v-bind:getAllBoardSteps="getAllBoardSteps"
                                   v-on:getBoardStepsData="getBoard"
                            >
                            </step5>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="buttons_strip">
            <!--            <button class="centered">Add Step</button>-->
            <button class="right" v-on:click="checkVariousConditions"
                    v-if="step === 5 && getBoardSteps[0].status === 'draft' ">
                Launch Semantix Boards
            </button>

            <button class="back" v-on:click="back" v-if="step != 1">Back</button>
            <button class="next right" v-on:click="next" v-if="step != 5">Next</button>
            <button class="right" v-if="step === 5 && getBoardSteps[0].status === 'draft'"
                    v-on:click="saveAsDraft">Save as Draft
            </button>
        </div>
    </div>
</template>

<script>

    import step1 from './semanticBoardCreationSteps/step1';
    import step2 from './semanticBoardCreationSteps/step2';
    import step3 from './semanticBoardCreationSteps/step3';
    import step4 from './semanticBoardCreationSteps/step4';
    import step5 from './semanticBoardCreationSteps/step5';

    export default {
        name: "semanticBoardCreateComponent",
        components: {
            step1,
            step2,
            step3,
            step4,
            step5
        },
        data() {
            return {
                stepComponent: "step",
                step: 1,
                hitApi: {
                    step: 1,
                    token: false
                },
                boardId: -1,
                getBoardSteps: [{}, {}, {}, {}, {}],
                getAllBoardSteps: [{}, {}, {}, {}, {}],
                disableNextButton: false,
                selectedScheduleType: {
                    label: "Once",
                    value: "once"
                },
                createdVariants: [],
                boardSchdeuleType: '',
                totalStep5Percentage: 0,
                disableLaunchButton: false,
                startEndDateExpired: false
            }
        },
        mounted() {
            this.stepComponent = "step" + this.step;
            this.bus.$on("disableNextBtn", (data) => {
                this.disableNextButton = data;
            });
            this.bus.$on("disableLaunchBtn", (data) => {
                this.disableLaunchButton = data;
            });
          this.bus.$on("startEndDateExpiredEvent", (data) => {
            this.startEndDateExpired = data;
            console.log('event startEndDateExpiredEvent received ' + this.startEndDateExpired);
          });
            this.bus.$on("jumpToStep", (data) => {
                this.step = data;
                this.stepComponent = "step" + this.step
            });

            if (this.$route.params.id != null) {
                this.getBoard(this.$route.params.id);
            }

            this.bus.$on("receiveVariantsFromStep5", (data) => {
                this.createdVariants = data.variants;
                this.boardSchdeuleType = data.scheduleType;
                this.totalStep5Percentage = data.percentageLimit;
            });
        },
        methods: {
            back() {
                this.step--;
                this.stepComponent = "step" + this.step;
            },
            next() {
                if (this.$route.params.action == "view") {
                    this.step++;
                    this.stepComponent = "step" + this.step;
                } else {
                    this.hitApi.step = this.step;
                    this.hitApi.token = !this.hitApi.token;
                }
            },
            oneStepNext(id) {
                if (id != undefined) {
                    this.boardId = id;
                }
                this.step++;
                this.stepComponent = "step" + this.step;
                if (this.stepComponent === "step5") {
                    this.getBoard(this.boardId)
                }
            },
            updateScheduleType(type) {
                this.selectedScheduleType = type;
            },
            launchBoard() {
                const payLoad = {
                    resource: "board",
                    action: 'update',
                    id: this.boardId,
                    data: {
                        step: "preview",
                        status: "active"
                    }
                };
                console.log(payLoad);
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true)
                    .then(response => {
                        console.log("response", response);
                        if (response.data.meta.code === 200) {
                            this.$router.push("/dashboard/semantixBoard-listing");
                        }
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },
            async checkVariousConditions() {
              if(this.startEndDateExpired)return;
                if (this.disableLaunchButton == true) {
                    this.$swal({
                        position: 'top-right',
                        type: 'warning',
                        title: 'Please enter a valid "From Email"',
                        showConfirmButton: false,
                        timer: 2500
                    });

                } else {
                    await this.bus.$emit("getVariantArray", '');
                    let check = true;
                    if (!this.createdVariants.length > 0) {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'You must have atleast one Variant and its step to launch',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        check = false;
                    } else if (this.createdVariants.length > 0) {
                        this.createdVariants.forEach((variant) => {
                            if (!variant.steps.length > 0) {
                                this.$swal({
                                    position: 'top-right',
                                    type: 'warning',
                                    title: 'You must have atleast one step for each created Variant',
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                                check = false;
                            } else {
                                variant.steps.forEach((step) => {
                                    if (!step.variant_step_id > 0) {
                                        this.$swal({
                                            position: 'top-right',
                                            type: 'warning',
                                            title: 'Please save variant step first',
                                            showConfirmButton: false,
                                            timer: 2500
                                        });
                                        check = false;
                                    }
                                })
                            }
                        })
                    }
                    // if (this.createdVariants.length > 0 && this.boardSchdeuleType === 'Once') {
                    //     this.createdVariants.forEach((variant) => {
                    //         if (variant.steps.length > 1) {
                    //             this.$swal({
                    //                 position: 'top-right',
                    //                 type: 'warning',
                    //                 title: 'You can only have one step for each created Variant in schedule type once case, please delete',
                    //                 showConfirmButton: false,
                    //                 timer: 2500
                    //             });
                    //             check = false;
                    //         }
                    //     })
                    // }

                    if (this.totalStep5Percentage > 0) {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'You must have total 100% to launch board',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        check = false;
                    }

                    if (check) {
                        this.$swal({
                            title: 'Are you sure? You want to launch Board',
                            text: 'You can\'t revert your action',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Yes Launch it!',
                            cancelButtonText: 'Cancel it!',
                            showCloseButton: true,
                            showLoaderOnConfirm: true
                        }).then((result) => {
                            if (result.value) {
                                this.launchBoard();
                            } else {
                                this.$swal('Cancelled', 'Your file is still intact', 'info')
                            }
                        })
                    }

                    // return false;
                }
            },
            getBoard(id) {
                console.log('id', id);
                const payLoad = {
                    "resource": "boards",
                    "action": "get",
                    "id": id
                };

                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true,
                ).then((response) => {
                    if (response.data.meta.code === 200) {
                        if (response.data.data.status != undefined && !response.data.data.status) {
                            this.$router.push("/dashboard/semantixBoard-listing");
                        } else {
                            console.log('board', response);
                            let currentLastStep = response.data.data.length;
                            this.boardId = this.$route.params.id;
                            this.getBoardSteps = response.data.data;
                            this.getAllBoardSteps = response.data.data;
                            this.boardId = this.getAllBoardSteps[0].boardId;
                            if ((this.getBoardSteps[0].status != "draft" && this.$route.params.action.toLowerCase() != "view") || (this.getBoardSteps[0].status == "draft" && this.$route.params.action.toLowerCase() != "edit")) {
                                this.$router.push("/dashboard/semantixBoard-listing");
                            }
                            for (var i = this.getBoardSteps.length; i < 5; i++) {
                                this.getBoardSteps.push({});

                            }
                            this.step = currentLastStep == 5 ? currentLastStep : (currentLastStep + 1);
                            this.stepComponent = "step" + this.step;
                        }
                    }
                }).catch((error) => {
                    console.log('error', error);
                });
            },
            saveAsDraft() {
                this.$router.push("/dashboard/semantixBoard-listing");
            }
        },
        watch: {
            '$route.params.id'(currVal, oldVal) {
                this.getBoard(currVal);
            },
            '$route.params.action'(currVal, oldVal) {
                this.getBoard(this.$route.params.id);
            }
        }
    }
</script>

<style scoped>
    .tabs li {
        width: 20%;
    }


</style>