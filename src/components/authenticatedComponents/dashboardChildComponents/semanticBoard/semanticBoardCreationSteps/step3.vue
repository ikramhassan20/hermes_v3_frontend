<template>

    <div class="tab" id="audience_tab">
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
                    <h5>Target Users By Segment</h5>
                    <div class="append_divs t_margin">
                        <div class="loop_elem" v-for="(segment, index) in segmentObj.totalSelectedSegments">
                            <div class="append_div">
                                <div style="float: left; width: 85%">
                                    <input style="width:100% !important;" disabled v-bind:value="segment.label" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'"/>
                                </div>
                                <a v-if="boardStatus.status !== 'active' || boardStatus.status !== 'expired' || boardStatus.status !== 'suspended'" v-on:click="removeSegment(index)" class="anchor_pointer row_remover"><i
                                        class="far fa-trash-alt" ></i></a>
                            </div>
                            <span v-if="index != segmentObj.totalSelectedSegments.length - 1">AND</span>
                        </div>
                    </div>
<!--                    <vSelect placeholder="Search Segment(s)" v-bind:options="segment" -->
<!--                             v-model="selectedSegment"-->
<!--                             v-bind:filterable="false"-->
<!--                             v-on:search="onSearch" :disabled="boardStatus.status === 'active' || boardStatus.status === 'expired' || boardStatus.status === 'suspended'">-->
<!--                    </vSelect>-->
                  <select v-model="selectedSegment" class="segment-dropdown-padding">
                    <option  value="Select Segment">Select Segment</option>
                    <option v-for="segment in segmentsList" v-bind:value="{ label: segment.label, value: segment.value }">{{ segment.label }}</option>
                  </select>
                    <p v-if="!segmentValidationStatus" class="error">{{errors.totalSegments.message}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import vSelect from 'vue-select';

    export default {
        name: "step3",
        props: ['hitApi', 'boardId', 'getBoardStep','boardStatus'],
        components: {
            vSelect,
        },
      mounted() {
        this.getSegmentsList();
      },
      data() {
            return {
                segment: [],
                selectedSegment: 'Select Segment',
                segmentsList: {},
                segmentObj: {
                    totalSelectedSegments: []
                },
                errors: {
                    totalSegments: {
                        message: '',
                    }
                },
              segmentValidationStatus: true
            }
        },
        methods: {
          getSegmentsList(){
            const payLoad = {
              resource: "company/presets/segmentList",
              action: "get",
            };
            this.api("post",
                this.constants.getUrl("backendApiUrl"),
                payLoad,
                this.authHeaders,
                true
            ).then((response) => {
              console.log('response')
              console.log(response)
              this.segmentsList = response.data.data;
            }).catch((error) => {

            });
          },
            onSearch(search, loading) {
                loading(true);
                const payLoad = {
                    resource: "company/presets/segments/" + search,
                    action: "get",
                };
                this.api("post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders
                ).then((response) => {
                    loading(false);
                    this.segment = response.data.data;
                }).catch((error) => {

                });

            },
            removeSegment(index) {
                this.segmentObj.totalSelectedSegments.splice(index, 1);
                this.validate();
            },
            validate() {

                let errors = {
                    totalSegments: {
                        message: '',
                    },
                    rateLimit: {
                        campaignRateLimit: {
                            message: ''
                        }
                    },
                    variantsDistribution: {
                        message: ''
                    }
                };
                this.errors = JSON.parse(JSON.stringify(errors));

                if (this.segmentObj.totalSelectedSegments.length == 0) {
                    this.segmentValidationStatus = false;
                    this.errors.totalSegments.message = "Please select segment(s)";
                }else{
                  this.segmentValidationStatus = true;
                }
                return this.segmentValidationStatus;
            },
            submitStep() {

                if (this.validate()) {

                    this.bus.$emit("disableNextBtn", true);
                    let segmentsArr = [];
                    for (var i = 0; i < this.segmentObj.totalSelectedSegments.length; i++) {
                        segmentsArr.push(this.segmentObj.totalSelectedSegments[i].value);
                    }

                    const payLoad = {
                        resource: "board",
                        action: "update",
                        id: this.boardId,
                        data: {
                            step: "target",
                            targetObj: {
                                segments: segmentsArr
                            }
                        }
                    };

                    this.api("post",
                        this.constants.getUrl("backendApiUrl"),
                        payLoad,
                        this.authHeaders,
                        true,
                    ).then((response) => {
                        this.bus.$emit("disableNextBtn", false);
                        if (response.data.meta.code === 200) {
                            this.$emit("goNext");
                        }
                    }).catch((error) => {

                    });
                }
            },
            updateRelevantStep(totalUsers) {
                this.bus.$emit("targetUsers", totalUsers);
            },
        },
        watch: {
            selectedSegment: {
                handler(currVal, oldVal) {
                  if(currVal == 'Select Segment'){
                    return;
                  }
                    if (JSON.stringify(currVal) != "{}") {
                        this.segmentValidationStatus = true;
                        for (var i = 0; i < this.segmentObj.totalSelectedSegments.length; i++) {
                            if (JSON.stringify(this.segmentObj.totalSelectedSegments[i]) == JSON.stringify(currVal)) {
                                break;
                            }
                        }

                        if (i >= this.segmentObj.totalSelectedSegments.length && currVal != null && currVal != {}) {
                            this.segmentObj.totalSelectedSegments.push(currVal);
                        }
                      this.selectedSegment = 'Select Segment';
                    }else{
                      this.segmentValidationStatus = false;
                    }

                },
                deep: true
            },
            hitApi: {
                handler(currVal, oldVal) {
                    if (currVal.step == 3) {
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
                        this.segmentObj = currVal;
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
    .append_div input {
        background: none !important;
        border: none !important;
    }

    .margin_class {
        margin-left: 15px;
    }

    .loop_elem {
        margin: 0 0 40px 0px;
    }

    .inner_tab_widget .txt_holder .segment-dropdown-padding{
      width:100% !important;
      background-position: 98% 50% !important;
    }

</style>