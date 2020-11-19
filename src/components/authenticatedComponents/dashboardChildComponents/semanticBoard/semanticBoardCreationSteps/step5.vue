<template>
    <div class="semantic_board">
        <div class="tab build_semantix active" id="tab5">
            <div class="entry_steps" v-if="isAllStepInfoReady">
                <div class="steps_cols">
                    <div class="step_col">
                        <div class="step_col_holder">
                            <strong>General:</strong>
                            <p>
                                Board Name:
                                <b>{{getAllBoardSteps[0].name}}</b>
                            </p>
                            <ul class="list_none custom_tags">
                                <span style="font-size: 13px;">Tags:</span>
                                <li v-for="(stepsTags, index) in getAllBoardSteps[0].tagsOriginal">
                                    <a href="javaScript:void(0)">{{stepsTags}}</a>
                                </li>
                            </ul>
                            <a href="javaScript:void(0)" class="step_editor" v-on:click="movetoStep(1)">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div class="step_col">
                        <div class="step_col_holder">
                            <strong>Entry Schedule:</strong>
                            <div class="new_div">
                                <p>
                                    Start date:
                                    <b>{{getAllBoardSteps[1].dateTime.start.date}}</b> &nbsp; <b>{{getAllBoardSteps[1].dateTime.start.hours}}
                                    : {{getAllBoardSteps[1].dateTime.start.mints}}</b>
                                </p>
                                <p>
                                    End date:
                                    <b>&nbsp;&nbsp;&nbsp;{{getAllBoardSteps[1].dateTime.end.date}}</b> &nbsp; <b>{{getAllBoardSteps[1].dateTime.end.hours}}
                                    : {{getAllBoardSteps[1].dateTime.end.mints}}</b>
                                </p>
                            </div>
                            <div class="new_div">
                                <p>
                                    Priority:
                                    <b>{{getAllBoardSteps[1].deliveryControl.selectedPriority.label}}</b>
                                </p>
                                <p>
                                    Schedule Type:
                                    <b>{{getAllBoardSteps[1].selectedScheduleType.label}}</b>
                                </p>
                            </div>
                            <a href="javaScript:void(0)" class="step_editor" v-on:click="movetoStep(2)">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div class="step_col">
                        <div class="step_col_holder">
                            <strong>Entry Audience:</strong>
                            <ul class="list_none custom_tags">
                                <span style="font-size: 13px;">Segments:</span>
                                <li v-for="(segments, index) in getAllBoardSteps[2].totalSelectedSegments">
                                    <a href="javaScript:void(0)">{{segments.label}}</a>
                                </li>
                            </ul>
                            <a href="javaScript:void(0)" class="step_editor" v-on:click="movetoStep(3)">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div class="step_col">
                        <div class="step_col_holder">
                            <strong>Send Settings:</strong>
                            <p>
                                Rate Limiting:
                                <b>{{getAllBoardSteps[3].rateLimit.boardRateLimit}} &nbsp;
                                    {{getAllBoardSteps[3].rateLimit.durationUnit}} &nbsp;
                                    {{getAllBoardSteps[3].rateLimit.durationValue}}</b>
                            </p>
                            <!--                            <p>-->
                            <!--                                Capping Value:-->
                            <!--                                <b>{{getAllBoardSteps[3].cappingValue}}</b>-->
                            <!--                            </p>-->
                            <a href="javaScript:void(0)" class="step_editor" v-on:click="movetoStep(4)">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <p v-if="!startDateExpiryValidationStatus" class="error">Start date & time should be greater than current date & time</p>
                <p v-if="!endDateExpiryValidationStatus" class="error">End date & time should be greater than current date & time</p>
            </div>

            <div class="twocolumns fixed_width_cols" v-show="isFromEmailValid == false">
                <p style="color: red"><strong style="font-size: 20px;">Note:</strong>&nbsp "From Email" provided in this
                    campaign is not <strong>Verified!</strong>
                    <br> Please enter a valid "From Email", otherwise "Target Users" will not receive this campaign.</p>
            </div>
            <div class="inner_tab_widget">
                <div class>
                    <div class="canvas_area">
                        <!-- <div class="canvas_sidebar">
                                        <div class="variant_button">
                                            <div class="d_table">
                                                <div class="v_middle">
                                                    <em class="edit_link">
                                                        <a href="#" class="cog_icon"><i class="fa fa-cog" aria-hidden="true"></i></a>
                                                    </em> Variant 1 <span>100 % <br> Type: Push <i class="fa fa-bell type_icon" aria-hidden="true"></i></span>
                                                </div>
                                            </div>
                                            <ul class="list_none actions_dropdown">
                                                <li><a href="#">Edit</a></li>
                                                <li><a href="#">Clone</a></li>
                                                <li><a href="#">Delete</a></li>
                                            </ul>
                                        </div>
                                        <a href="#" class="variant_button add_var"><i class="fa fa-plus" aria-hidden="true" style="margin-right:5px; font-size: 14px;"></i></a>
                        </div>-->
                        <div class="canvas_right_content new_design">
                            <div class="wid_post" v-for="(variant, index) in variants" v-if="variant.show">
                                <div class="variant_button">
                                    <em class="edit_link">
                                        <a href="javaScript:void(0)" class="cog_icon">
                                            <i class="fa fa-cog" aria-hidden="true"></i>
                                        </a>
                                    </em>
                                    <div class="d_table">
                                        <div class="v_middle">
                                            Variant {{index + 1}}
                                            <span>
                        {{calculatedPercentages(variant.percentage)}} %
                        <br/>
                        Type: {{variant.type}}
                        <img
                                v-if="variant.type ==='InApp' "
                                src="../../../../../assets/images/mobile-icon.png"
                                alt="#"
                                class="type_icon inapp"
                        />
                         <img
                                 v-if="variant.type ==='Push' "
                                 src="../../../../../assets/images/notice-icon.png"
                                 alt="#"
                                 class="type_icon push"
                         />
                        <i
                                v-if="variant.type ==='Email'"
                                class="far fa-envelope type_icon big_ico email"
                                aria-hidden="true"
                        ></i>
                      </span>
                                        </div>
                                    </div>
                                    <ul class="list_none actions_dropdown"
                                        v-if="isAllStepInfoReady && getAllBoardSteps[0].status === 'draft'">
                                        <li>
                                            <a
                                                    href="javaScript:void(0)"
                                                    data-target="#variantTypeandPercentageModal"
                                                    data-toggle="modal"
                                                    v-on:click="getVariantDistribution(variant,index)"
                                            >Edit</a>
                                        </li>
                                        <!-- <li>
                                          <a href="#">Clone</a>
                                        </li>-->
                                        <li>
                                            <a href="javaScript:void(0)"
                                               v-on:click="checkCOnditionsBeforeDeletingVariant(index)">Delete</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="widts_holder">
                                    <div class="canvas_widget" v-for="(step, stepIndex) in variant.steps">
                                        <div class="canvas_widget_holder">
                                            <div class="inner_wid">
                                                <div class="modal_trigger">
                                                    <em>
                                                        <b class="cog_icon edit_link">
                                                            <i class="fa fa-cog" aria-hidden="true"></i>
                                                        </b>
                                                    </em>
                                                    <span v-if="step.delayNo > 0">
                                                    <span
                                                            v-if="step.delayNo > 0"
                                                    >{{step.delayNo}} {{step.delayType}}</span>
                                                    <span v-else>{{step.delayType}}</span><br></span>
                                                    <span v-if="step.delayNo === 0"><br></span>
                                                    <span>Step {{stepIndex + 1}}</span>
                                                    <div class="indics"
                                                         v-if="getAllBoardSteps[0].status !== 'draft' && step.showStats">
                                                        <!--                                                    <div class="indics">-->
                                                        <div>
                                                            <div class="align-left"><em class="round_dot sent"></em> <i>Sent:</i>
                                                            </div>
                                                            <b>{{step.completed}}</b></div>
                                                        <div>
                                                            <div class="align-left"><em class="round_dot"></em> <i>Failed:</i>
                                                            </div>
                                                            <b>{{step.failed}}</b></div>
                                                    </div>
                                                    <ul class="list_none actions_dropdown"
                                                        v-if="isAllStepInfoReady && getAllBoardSteps[0].status === 'draft'">
                                                        <li v-if="checkIfLastStepDeleteFunctionality(index,stepIndex)">
                                                            <a
                                                                    href="javaScript:void(0)"
                                                                    v-on:click="checkConditionsBeforeDeletingVariantSteps(index,stepIndex)"
                                                            >Delete</a>
                                                        </li>
                                                        <li v-if="stepIndex > 0">
                                                            <a
                                                                    href="javaScript:void(0)"
                                                                    data-toggle="modal"
                                                                    data-target="#variantStepDelay"
                                                                    v-on:click="selectCurrentIndexes(index,stepIndex,step.delayNo)"
                                                            >Edit</a>
                                                        </li>
                                                        <li v-if="checkifSchduleIsOnce(index),hideCloningIfNotSaved(index,stepIndex)">
                                                            <a
                                                                    href="javaScript:void(0)"
                                                                    v-on:click="checkConditionsBeforeMakingClone(index,stepIndex)"
                                                            >Clone</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="inner_wid" v-if="step.delayType">
                                                <!-- <div class="inner_wid"> -->
                                                <div class="modal_trigger filled">
                                                    <a
                                                            href="javaScript:void(0)"
                                                            class="step_edit_btn"
                                                            v-on:click="selectCurrentVariantType(index,stepIndex,variant.type)"
                                                    >
                                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                                    </a>
                                                    <img
                                                            v-if="variant.type ==='InApp' "
                                                            src="../../../../../assets/images/mobile-icon.png"
                                                            alt="#"
                                                            class="type_icon inapp"
                                                    />
                                                    <img
                                                            v-if="variant.type ==='Push' "
                                                            src="../../../../../assets/images/notice-icon.png"
                                                            alt="#"
                                                            class="type_icon push"
                                                    />
                                                    <i
                                                            v-if="variant.type ==='Email' "
                                                            class="far fa-envelope type_icon big_ico"
                                                            aria-hidden="true email"
                                                    ></i>
                                                       <div v-if="step.sentAt !== null && step.sentAt" >
                                                            <div class="align-left"></div>
                                                            <p class="sent_msg">Sent On: {{step.sentAt}}</p>
                                                       </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                            class="canvas_widget add"
                                            v-if="checkIfLastStepAddFunctionality(index) && isAllStepInfoReady && getAllBoardSteps[0].status === 'draft'"
                                            v-on:click="addVariantSteps(index)"
                                    >
                                        <div class="canvas_widget_holder">
                                            <a href="javaScript:void(0)" v-bind:id="index+'id'" class="new_add_btn big">
                                                <i class="fas fa-plus-circle" v-if="checkifSchduleIsOnce(index)"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="wid_post"
                                 v-if="variants.length <=2 && isAllStepInfoReady && getAllBoardSteps[0].status === 'draft'">
                                <div class="variant_button">
                                    <a
                                            href="javaScript:void(0)"
                                            class="new_add_btn big white"
                                            v-on:click="currentVariantsIndex();checkIfPreviousVariantIsFilled()"
                                    >
                                        <i class="fas fa-plus-circle"></i>
                                    </a>
                                </div>
                                <div class="widts_holder">
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                    <div class="canvas_widget add">
                                        <div class="canvas_widget_holder"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for adding delay -->
        <div
                class="modal fade"
                id="variantStepDelay"
                role="dialog"
                data-backdrop="static"
                data-keyboard="false"
                v-if="isAllStepInfoReady"
        >
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button
                                type="button"
                                ref="delayModalCloseBtn"
                                class="close"
                                data-dismiss="modal"
                                v-on:click="clearRequiredMessagesDelays()"
                        >&times;
                        </button>
                        <h4 class="modal-title">Delays</h4>
                    </div>
                    <form>
                        <div class="modal-body">
                            <b>Every</b>
                            <div class="row big_inputs">
                                <div class="col-md-6">
                                    <input type="number" placeholder="1" v-model="delayNo" :min="1" required/>
                                    <span v-if="errors.delayNo.message" class="error">{{errors.delayNo.message}}</span>
                                </div>
                                <div class="col-md-6">
                                    <select class="fix_width" v-model="delayType" required>
                                        <!--                                        <option value="minute">Minute</option>-->
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                    </select>
                                    <span v-if="!delayType" class="error">{{errors.delayType.message}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                    style="background-color:#2a8689;color:white"
                                    type="button"
                                    class="btn btn-default"
                                    v-on:click="saveVariantStepsDelays()"
                            ><span v-if="!stepEditMode">Save</span><span v-if="stepEditMode">Update</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <button
                ref="typeAndPercentage"
                type="button"
                class="new_add_btn big white"
                data-target="#variantTypeandPercentageModal"
                data-toggle="modal"
                style="display:none"
        ></button>
        <!-- Modal for adding percentage and type for a specific variant -->
        <div

                class="modal fade"
                id="variantTypeandPercentageModal"
                role="dialog"
                data-backdrop="static"
                data-keyboard="false"
        >
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button
                                ref="channelCloseBtn"
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                v-on:click="revertVariantLimitPercentage()"
                        >&times;
                        </button>
                        <h4 class="modal-title">Messaging Channels</h4>
                    </div>
                    <div class="modal-body">
                        <!-- <div class="input_row">
                                                  <input type="text" placeholder="Campaign Title" v-model="campaign.name" />
                        </div>-->
                        <div class="input_row">
                            <select
                                    v-if="variantEditMode"
                                    class="add"
                                    v-model="selectedCampaignType"
                                    :disabled="variantEditMode"
                            >
                                <option
                                        v-for="(editVariantTypes, index) in editVariantTypes"
                                        :value="editVariantTypes"
                                        v-bind:key="index"
                                >{{ editVariantTypes }}
                                </option>
                                <!-- <option value="Push">Push</option>>
                                <option value="InApp">InApp</option>-->
                            </select>
                            <select
                                    v-if="!variantEditMode"
                                    class="add"
                                    v-model="selectedCampaignType"
                            >
                                <option value="" disabled selected hidden>Select Type</option>
                                <option
                                        v-for="(selectedVariantType, index) in selectedVariantType"
                                        :value="selectedVariantType"
                                        v-bind:key="index"
                                >{{ selectedVariantType }}
                                </option>
                                <!-- <option value="Push">Push</option>>
                                <option value="InApp">InApp</option>-->
                            </select>
                            <span
                                    v-if="!selectedCampaignType && !variantEditMode"
                                    class="error"
                            >{{channelErrors.type.message}}</span>
                        </div>
                        <!-- <div class="input_row">
                                                  <input-tag
                                                    placeholder="Enter Tags"
                                                    :add-tag-on-blur="true"
                                                    v-bind:key="campaign.tagsOriginal.length"
                                                    v-model="campaign.tagsOriginal"
                                                  ></input-tag>
                        </div>-->
                        <div class="input_row new_num">
                            <input
                                    type="number"
                                    placeholder="Allocate %"
                                    v-model="percentage"
                                    :max="percentageLimit"
                                    :min="0"
                                    hidden
                            />
                            <span class="error">{{channelErrors.percentage.message}}</span>
                        </div>
                        <div v-if="selectedCampaignType === 'Email'">
                            <div class="input_row">
                                <input v-bind:class="{invalid_email : !isFromEmailValid}"
                                       type="text"
                                       placeholder="From Email"
                                       v-model="emailContent.fromEmail"
                                />
                                <span style="color:red;"
                                      v-show="isFromEmailValid == false">Please Enter Valid Email!</span>
                                <span v-if="!emailContent.fromEmail"
                                      class="error">{{channelErrors.fromEmail.message}}</span>
                            </div>
                            <div class="input_row">
                                <input
                                        type="text"
                                        placeholder="From Name"
                                        v-model="emailContent.fromName"
                                />
                                <span v-if="!emailContent.fromName"
                                      class="error">{{channelErrors.fromName.message}}</span>
                            </div>
                            <div class="input_row">
                                <input
                                        type="text"
                                        placeholder="Subject"
                                        v-model="emailContent.subject"
                                />
                                <span v-if="!emailContent.subject"
                                      class="error">{{channelErrors.subject.message}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
                        <button
                                style="background-color:#2a8689;color:white"
                                type="button"
                                class="btn btn-default"
                                v-on:click="saveCurrentVariantValues()"
                                v-bind:disabled="saveDisableVariant"
                        ><span v-if="!variantDetailEditMode">Save</span><span v-if="variantDetailEditMode">Update</span>
                            <i
                                    class="fa fa-refresh fa-spin"
                                    v-bind:style="saveDisableVariant ? 'display: inline-block': 'display: none'"
                            ></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <button
                ref="composeModalBtn"
                type="button"
                class="new_add_btn big white"
                data-target="#composeModal"
                data-toggle="modal"
                style="display:none"
        ></button>
        <!-- Modal Compose -->
        <div
                class="modal fade"
                id="composeModal"
                role="dialog"
                data-backdrop="static"
                data-keyboard="false"
        >
            <div class="modal-dialog modal-lg" style="width:83%">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" ref="composeCloseBtn"
                                v-on:click="recallBoardStepIfEmail()">&times;
                        </button>
                        <h4 class="modal-title">Board</h4>
                    </div>
                    <div class="modal-body">
                        <compose
                                v-show="stepComponent == 'step2'"
                                v-bind:campaignType="campaignType"
                                v-bind:languages="campaignObj.languages"
                                v-bind:campaignTemplates="campaignObj.templates"
                                v-bind:inAppPushData="campaignObj.inAppPushData"
                                v-bind:hitApi="hitApi"
                                v-bind:campaignId="campaignId"
                                v-bind:getCampaignStep="getCampaignSteps[1]"
                                v-on:submitVariantStepsDetails="submitVariantStepsDetails"
                                v-bind:variantComposeDetails="getVariantComposeDetails"
                                v-bind:status="getAllBoardSteps[0].status"
                                v-bind:stepEditMode="stepEditMode"
                                :key="componentKey"
                        ></compose>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from "jquery";
    import InputTag from "vue-input-tag";
    import compose from "./compose";

    $(function () {
        $(document).on("click", ".edit_link", function (e) {
            e.preventDefault();
            $(this).closest('.canvas_widget').find('.actions_dropdown').slideToggle();
            $(this).closest('.canvas_widget').nextAll('.canvas_widget').find('.actions_dropdown').slideUp();
            $(this).closest('.canvas_widget').prevAll('.canvas_widget').find('.actions_dropdown').slideUp();
        });
    });
    $(function () {
        $(document).on("click", ".edit_link", function (e) {
            e.preventDefault();
            $(this).closest('.variant_button').find('.actions_dropdown').slideToggle();
            // setTimeout(function(){
            //     $(document).on('click', function (e) {
            //         if ($(e.target).is('.edit_link') === false) {
            //             $('.actions_dropdown').slideUp();
            //         }
            //     });
            // }, 500);
            // $(document).mouseup(function(e){
            //     var container = $(".actions_dropdown");
            //
            //     // If the target of the click isn't the container
            //     if(!container.is(e.target) && container.has(e.target).length === 0){
            //         container.hide();
            //     }
            // });
            $(document).mouseup(function (e) {
                if ($(e.target).closest(".edit_link").length
                    === 0) {
                    $(".actions_dropdown").hide();
                }
            });


        });
    });
    export default {
        name: "step5",
        props: [
            "hitApi",
            "boardId",
            "selectedScheduleType",
            "getBoardStep",
            "getAllBoardSteps"
        ],
        components: {
            InputTag,
            compose
        },
        data() {
            return {
                saveDisableVariant: false,
                emailCount: 0,
                componentKey: 0,
                emailContent: {
                    fromEmail: '',
                    fromName: '',
                    subject: ''
                },
                scheduleType: '',
                isAllStepInfoReady: false,
                selectedVariantType: ["InApp", "Push", "Email"],
                editVariantTypes: ["InApp", "Push", "Email"],
                currentBoardId: 0,
                stepComponent: "step2",
                getVariantComposeDetails: {},
                count: 0,
                variantPercentage: 0,
                currentVariantIndex: 0,
                currentVariantStepIndex: 0,
                calculatedPercentage: 100,
                percentageAdded: 0,
                percentage: 100,
                percentageLimit: 100,
                delayNo: 0,
                delayType: "",
                selectedCampaignType: "",
                totalUsers: -1,
                step: 1,
                campaignObj: {},
                campaignType: {name: "inapp", code: "InApp"},
                campaignId: -1,
                action: "update",
                getCampaignSteps: [{}, {}, {}, {}, {}, {}],
                totalVariants: [],
                disableNextButton: false,
                variants: [],
                typeModalShow: true,
                showComposeModal: true,
                variantEditMode: false,
                stepEditMode: false,
                variantDetailEditMode: false,
                isFromEmailValid: true,
                errors: {
                    delayType: {
                        message: ""
                    },
                    delayNo: {
                        message: ""
                    },
                    percentage: {
                        message: ""
                    }
                },
                channelErrors: {
                    type: {
                        message: ""
                    },
                    percentage: {
                        message: ""
                    },
                    fromEmail: {
                        message: ""
                    },
                    fromName: {
                        message: ""
                    },
                    subject: {
                        message: ""
                    }
                },
                copyVariants: [],
                stepDetails: {
                    totalLang: [],
                    platform: {},
                    messageType: {},
                    orientation: {},
                    position: {},
                    lang: [
                        {
                            language: "en",
                            templateInfo: {
                                imgUrl: "",
                                template: "",
                                title: "",
                                message: "",
                                action1: {
                                    label: "Yes",
                                    type: "",
                                    value: ""
                                },
                                action2: {
                                    label: "",
                                    type: "",
                                    value: ""
                                },
                                design: {
                                    header: {
                                        headingColor: "#000000",
                                        contentColor: "#000000"
                                    },
                                    button1: {
                                        color: "#0071bd",
                                        opacity: "1",
                                        textColor: "#fcfbfb"
                                    },
                                    button2: {
                                        color: "#cd2026",
                                        opacity: "1",
                                        textColor: "#fcfbfb"
                                    },
                                    background: {
                                        color: "#fafafa",
                                        opacity: "1"
                                    },
                                    frame: {
                                        color: "#791283"
                                    }
                                }
                            }
                        }
                    ]
                },

              startDateExpiryValidationStatus: true,
              endDateExpiryValidationStatus: true
            };
        },
        mounted() {
            this.getPreData();
            // this.currentBoardId = this.boardId;
            // console.log(this.boardId);
            if (this.boardId >= 0) {
                this.$emit("getBoardStepsData", this.boardId);
            }
            this.listenFromSemanticCreationStep();

        },
        methods: {
          checkExpireStartAndEndDates(){

            var currentIsoDate = new Date();
            currentIsoDate = currentIsoDate.toISOString();
            var currentHours = parseInt(currentIsoDate.split(":")[0].split("T")[1]);
            var currentMins = parseInt(currentIsoDate.split(":")[1]);

            var currentDate = currentIsoDate.split(":")[0].split("T")[0];
            var currentDateTime = currentDate + '-' + ('0' + currentHours).slice(-2) + '-' + ('0' + currentMins).slice(-2);

            var startDate = '';
            if(this.getAllBoardSteps[1] && this.getAllBoardSteps[1].dateTime && this.getAllBoardSteps[1].dateTime.start && this.getAllBoardSteps[1].dateTime.start.date) {
              var startDate = this.getAllBoardSteps[1].dateTime.start.date + '-' + ('0' + this.getAllBoardSteps[1].dateTime.start.hours).slice(-2) + '-' + ('0' + this.getAllBoardSteps[1].dateTime.start.mints).slice(-2);
            }

            if(this.getAllBoardSteps[1] && this.getAllBoardSteps[1].dateTime && this.getAllBoardSteps[1].dateTime.end && this.getAllBoardSteps[1].dateTime.end.date) {
              var endDate = this.getAllBoardSteps[1].dateTime.end.date + '-' + ('0' + this.getAllBoardSteps[1].dateTime.end.hours).slice(-2) + '-' + ('0' + this.getAllBoardSteps[1].dateTime.end.mints).slice(-2);
            }


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
            addVariant(variantId) {
                this.variants.length <= 2
                    ? this.variants.push({
                        variant_id: variantId,
                        steps: [],
                        count: this.count,
                        show: true,
                        percentage: this.variantPercentage,
                        type: this.selectedCampaignType,
                        from_email: this.emailContent.fromEmail,
                        from_name: this.emailContent.fromName,
                        subject: this.emailContent.subject
                    })
                    : null;
                this.variants.length <= 2 &&
                this.variants[this.currentVariantIndex].steps.length > 0
                    ? (this.typeModalShow = true)
                    : (this.typeModalShow = false);
                ++this.count;
            },
            checkCOnditionsBeforeDeletingVariant(index) {
                if (this.variants[index].steps.length > 0) {
                    this.$swal({
                        position: 'top-right',
                        type: 'warning',
                        title: 'Please Delete Variant Steps First',
                        showConfirmButton: false,
                        timer: 2500
                    });
                    return false;
                }
                this.$swal({
                    title: 'Are you sure? You want to delete Variant',
                    text: 'You can\'t revert your action',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes Delete it!',
                    cancelButtonText: 'Cancel it!',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        this.deleteVariant(index);
                    } else {
                        this.$swal('Cancelled', 'Your variant is still intact', 'info')
                    }
                })
            },
            deleteVariant(index) {
                this.selectedVariantType.push(this.variants[index].type);
                const payLoad = {
                    resource: "board",
                    action: this.action,
                    id: this.boardId,
                    data: {
                        step: "deleteVariant",
                        variant_id: this.variants[index].variant_id
                    }
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                )
                    .then(response => {
                        console.log("response", response);
                        if (response.data.meta.code === 200) {
                            if (this.variants[index].type == 'Email') {
                                this.bus.$emit("disableLaunchBtn", false);
                                this.isFromEmailValid = true;
                            }
                            --this.percentageAdded;
                            this.setPercentageLimit();
                            this.variants.splice(index, 1);
                        }
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },
            move(array, fromIndex, toIndex) {
                array.splice(toIndex, 1, array.splice(fromIndex, 1)[0]);
                return array;
            },
            checkConditionsBeforeDeletingVariantSteps(variantIndex, stepIndex) {
                this.$swal({
                    title: 'Are you sure? You want to delete Variant Step',
                    text: 'You can\'t revert your action',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes Delete it!',
                    cancelButtonText: 'Cancel it!',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        this.deleteVariantSteps(variantIndex, stepIndex);
                    } else {
                        this.$swal('Cancelled', 'Your variant step is still intact', 'info')
                    }
                })
            },
            deleteVariantSteps(variantIndex, stepIndex) {
                let stepDetail = this.variants[variantIndex].steps[stepIndex];
                if (!stepDetail.variant_step_id > 0) {
                    this.variants[variantIndex].steps.splice(stepIndex, 1);
                    $("#" + variantIndex + "id").removeClass("disabled");
                    return false;
                }
                const payLoad = {
                    resource: "board",
                    action: this.action,
                    id: this.boardId,
                    data: {
                        step: "deleteVariantSteps",
                        variant_step_id: stepDetail.variant_step_id
                    }
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                )
                    .then(response => {
                        console.log("response", response);
                        if (response.data.meta.code === 200) {
                            this.variants[variantIndex].steps.splice(stepIndex, 1);
                            $("#" + variantIndex + "id").removeClass("disabled");
                        }
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },
            showSteps(index) {
                let variant = this.variants[index];
                variant.show = true;
                this.variants[index] = variant;
            },
            currentVariantsIndex(index) {
                if (index) {
                    this.currentVariantIndex = index;
                    let variant = this.variants[this.currentVariantIndex];
                } else {
                    this.currentVariantIndex = this.variants.length;
                }
                this.variantEditMode = false;
                this.selectedCampaignType = "";
            },
            checkIfPreviousVariantIsFilled() {
                let index = this.currentVariantIndex;
                let checkPrevious;
                this.setPercentageLimit();
                this.percentage = this.percentageLimit;
                this.channelErrors.type.message = "";
                this.variantDetailEditMode = false;
                // if percentage limit reached to 100 %, user cannot be able to make new variant until you adjust percentage
                if (this.percentageLimit <= 0) {
                    this.$swal({
                        position: 'top-right',
                        type: 'warning',
                        title: 'Please adjust your percentage first',
                        showConfirmButton: false,
                        timer: 2500
                    });
                    return false;
                }
                // check for the variant,if user wants to create new variant without creating any step for previously created variant
                if (index > 0) {
                    checkPrevious = this.variants[index - 1].steps.length;
                    let variantLastStep = this.variants[index - 1].steps[0];
                    if (checkPrevious > 0) {
                        // check if variants limits has been reached which is 3, user cannot create more than 3 variants
                        if (this.variants.length === 3) {
                            this.$swal({
                                position: 'top-right',
                                type: 'warning',
                                title: 'You cannot create more than 3 Variants',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            return false;
                            // check if user has created step of previously created variant but not saved it yet, needs to saved step if wants to create new variant
                        } else if (!variantLastStep.variant_step_id > 0) {
                            this.$swal({
                                position: 'top-right',
                                type: 'warning',
                                title: 'You have to save atleast one step of previous variant to make more variant',
                                showConfirmButton: false,
                                timer: 2500
                            });
                            return false;
                            // if all check passes then it wil continue user to create new variant
                        } else {
                            if (this.variants.length > 0) {
                                this.percentageLimit = 100;
                                this.variants.forEach((variant) => {
                                    this.percentageLimit -= variant.percentage;
                                })
                            } else {
                                this.percentageLimit = 100;
                            }
                            let elem = this.$refs.typeAndPercentage;
                            elem.click();
                            this.variantEditMode = false;
                        }
                        // check for the variant,if user wants to create new variant without creating any step for previously created variant
                    } else {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'Please add atleast one step of previous Variant',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        return false;
                    }
                    // if all check passes then it wil continue user to create new variant
                } else {
                    if (this.variants.length > 0) {
                        this.percentageLimit = 100;
                        this.variants.forEach((variant) => {
                            this.percentageLimit -= variant.percentage;
                        })
                    } else {
                        this.percentageLimit = 100;
                    }
                    let elem = this.$refs.typeAndPercentage;
                    elem.click();
                    this.variantEditMode = false;
                }
            },
            saveCurrentVariantValues() {
                if (this.selectedCampaignType === 'Email') {
                    if (!this.emailContent.fromEmail) {
                        this.channelErrors.fromEmail.message = "From Email is required";
                        return false;
                    }
                    if (!this.emailContent.fromName) {
                        this.channelErrors.fromName.message = "From Name is required";
                        return false;
                    }
                    if (!this.emailContent.subject) {
                        this.channelErrors.subject.message = "Subject is required";
                        return false;
                    }
                }
                if (!this.selectedCampaignType) {
                    this.channelErrors.type.message = "Variant type is required";
                    return false;
                }
                if (this.percentage === "0" || this.percentage === 0 || !this.percentage) {
                    this.channelErrors.percentage.message = "Percentage is required";
                    return false;
                }
                if (this.percentage > this.percentageLimit) {
                    this.channelErrors.percentage.message =
                        "Please enter the limit which is" + ' ' + this.percentageLimit + "";
                    return false;
                }
                if (this.percentage < 0) {
                    this.channelErrors.percentage.message =
                        "Percentage must be a positive value";
                    return false;
                }
                this.variantPercentage = parseInt(this.percentage);
                ++this.percentageAdded;
                let variantDetails;
                if (this.currentVariantIndex >= 0 && this.variantEditMode) {
                    variantDetails = this.variants[this.currentVariantIndex];
                    this.setPercentageLimit();
                }
                //  else {
                //     this.percentageLimit -= this.percentage;
                //     setTimeout(() => {
                //         this.selectedVariantType = this.selectedVariantType.filter(e => e !== this.selectedCampaignType);
                //     }, 2000);
                // }
                this.saveDisableVariant = true;

                const payLoad = {
                    resource: "board",
                    action: this.action,
                    id: this.boardId,
                    data: {
                        step: "variant",
                        variant_id: this.variantEditMode ? variantDetails.variant_id : 0,
                        variantNo: this.currentVariantIndex + 1,
                        variantType: this.selectedCampaignType,
                        variantPercentage: this.variantPercentage,
                        from_email: this.emailContent.fromEmail,
                        from_name: this.emailContent.fromName,
                        subject: this.emailContent.subject
                    }
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                )
                    .then(response => {
                        console.log("response", response);
                        if (response.status === 200) {
                            this.isFromEmailValid = response.data.data.isFromEmailValid;
                            if (response.data.data.isFromEmailValid == true) {
                                this.bus.$emit("disableLaunchBtn", false);
                            } else {
                                this.bus.$emit("disableLaunchBtn", true);
                            }
                        }
                        if (response.status === 200 && !this.variantEditMode) {
                            this.addVariant(response.data.data.id);
                            !!this.variantEditMode;
                            this.saveDisableVariant = false;
                        } else {
                            this.saveDisableVariant = false;
                            this.variants[
                                this.currentVariantIndex
                                ].percentage = this.variantPercentage;
                            this.variants[
                                this.currentVariantIndex
                                ].from_email = this.emailContent.fromEmail;
                            this.variants[
                                this.currentVariantIndex
                                ].from_name = this.emailContent.fromName;
                            this.variants[
                                this.currentVariantIndex
                                ].subject = this.emailContent.subject;
                        }
                   if (!this.currentVariantIndex >= 0 && !this.variantEditMode) {
                    this.percentageLimit -= this.percentage;
                    setTimeout(() => {
                        this.selectedVariantType = this.selectedVariantType.filter(e => e !== this.selectedCampaignType);
                    }, 1000);
                   }
                        
                        this.typeModalShow = true;
                        this.variantEditMode = false;
                        let btn = this.$refs.channelCloseBtn;
                        btn.click();
                        this.emailContent.fromEmail = '';
                        this.emailContent.fromName = '';
                        this.emailContent.subject = '';
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },
            setPercentageLimit() {
                this.percentageLimit = 100;
                if (this.variants.length > 0) {
                    this.variants.forEach((variant) => {
                        this.percentageLimit -= variant.percentage;
                    })
                }
            },
            addVariantSteps(index) {
                this.currentVariantIndex = index;
                let variant = this.variants[index];
                let variantLastStep = this.variants[index].steps[this.variants[index].steps.length - 1];
                if (variant.steps.length > 0) {
                    // if (variant.steps.length > 0 && this.scheduleType === 'Once') {
                    //     this.$swal({
                    //         position: 'top-right',
                    //         type: 'warning',
                    //         title: 'Can only create one step per variant in Schedule Type is equal to once case',
                    //         showConfirmButton: false,
                    //         timer: 2500
                    //     });
                    //     return false;
                    // } else 
                    if (!variantLastStep.variant_step_id > 0) {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'Please Save Previous Variant Step First',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        return false;
                    }
                }
                variant.steps.length <= 4
                    ? this.variants[this.currentVariantIndex].steps.push({
                        step: this.variants[index].steps.length + 1,
                        variant_step_id: 0,
                        stepDetails: this.stepDetails,
                        delayNo: this.delayNo,
                        delayType:
                            this.variants[index].steps.length === 0 ? "Day" : this.delayType
                    })
                    : null;
                this.variants.length <= 2 &&
                this.variants[this.currentVariantIndex].steps.length > 0
                    ? (this.typeModalShow = true)
                    : (this.typeModalShow = false);

                // for making add variant step button greyed out when not filled up
                $("#" + index + "id").addClass("disabled");
            },
            calculatedPercentages(variantPercentage) {
                if (parseInt(variantPercentage) > 0) {
                    return parseInt(variantPercentage);
                } else {
                    let variantLenght = this.variants.filter(e => e.show === true).length;
                    return (
                        this.calculatedPercentage /
                        (variantLenght - this.percentageAdded)
                    ).toFixed(0);
                }
            },
            getPreData() {
                const payLoad = {
                    resource: "company/presets/campaign",
                    action: "get"
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders
                )
                    .then(response => {
                        this.campaignObj = response.data.data;
                        console.log(this.campaignObj);

                    })
                    .catch(error => {
                    });
            },
            submitVariantStepsDetails(stepDetails) {
                this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ].stepDetails = stepDetails[0];
                let variantStepDetails = this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ].stepDetails;
                let variantStepDelays = this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ];
                let variantStepId = this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ];
                let variantDetails = this.variants[this.currentVariantIndex];
                // if (!variantStepDelays.delayType || !variantStepDelays.delayNo) {
                //     this.$swal({
                //         position: 'top-right',
                //         type: 'warning',
                //         title: 'Please add Step delays first',
                //         showConfirmButton: false,
                //         timer: 2500
                //     });
                //     return false;
                // }
                const payLoad = {
                    resource: "board",
                    action: this.action,
                    id: this.boardId,
                    data: {
                        step: "compose",
                        variant_id: variantDetails.variant_id,
                        variant_step_id: variantStepId.variant_step_id,
                        delayType: variantDetails.steps[this.currentVariantStepIndex].delayType,
                        delayNo: variantDetails.steps[this.currentVariantStepIndex].delayNo,
                        variantNo: this.currentVariantIndex + 1,
                        stepNo: this.currentVariantStepIndex + 1,
                        variants: btoa(
                            unescape(encodeURIComponent(JSON.stringify(variantStepDetails)))
                        )
                    }
                };
                this.api(
                    "post",
                    this.constants.getUrl("backendApiUrl"),
                    payLoad,
                    this.authHeaders,
                    true
                )
                    .then(response => {
                        console.log("response", response);
                        if (response.data.meta.code === 200) {
                            variantStepId.variant_step_id = response.data.data.variant_step_id;
                            let elem = this.$refs.composeCloseBtn;
                            elem.click();
                            this.$emit("getBoardStepsData", this.boardId);
                            this.bus.$emit('successCallAfterSavingStep');
                            this.initializeDefaultDelay()
                            // setTimeout(function(){
                            //     this.componentKey += 1;
                            //     }, 3000);

                            // for making add variant step button enable to create another variant step
                            $("#" + this.currentVariantIndex + "id").removeClass("disabled");
                        }
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },
            selectCurrentVariantType(index, stepIndex, campaignType) {
                // setTimeout(function () {
                if (campaignType === 'Email') {
                    this.emailCount += 1;
                }
                this.bus.$emit("switchLanguage", {type: campaignType, count: this.emailCount});
                // }, 500);
                console.log(index + "  " + stepIndex + "  " + campaignType);
                this.currentVariantIndex = index;
                this.currentVariantStepIndex = stepIndex;
                if (campaignType === "InApp" || campaignType === "inapp") {
                    this.campaignType = {
                        code: "inapp",
                        name: "InApp"
                    };
                } else if (campaignType === "Push" || campaignType === "push") {
                    this.campaignType = {
                        code: "push",
                        name: "Push"
                    };
                } else {
                    this.campaignType = {
                        code: "email",
                        name: "Email"
                    };
                }
                let isStepsaved = [];
                console.log(this.variants);
                isStepsaved.push(this.variants[index].steps[stepIndex].stepDetails);
                if (isStepsaved[0].totalLang.length > 0) {
                    this.getVariantComposeDetails = isStepsaved;
                } else {
                    // isStepsaved = [];
                    // isStepsaved.push(this.stepDetails);
                    this.getVariantComposeDetails = this.stepDetails;
                }
                // setTimeout(() => {
                let composeBtn = this.$refs.composeModalBtn;
                composeBtn.click();
                // }, 500);
                this.checkIfStepIsInEditMode();
            },
            movetoStep(step) {
                this.bus.$emit("jumpToStep", step);
            },
            checkIfLastStepAddFunctionality(variantIndex) {
                let check = this.variants[variantIndex].steps.length;
                if (check <= 4) {
                    return true;
                } else {
                    return false;
                }
            },
            checkifSchduleIsOnce(variantIndex) {
                let check = this.variants[variantIndex].steps.length;
                // if (check === 1 && this.getAllBoardSteps[1].selectedScheduleType.label === 'Once') {
                //     return false;
                // } else {

                return true;
                // }
            },
            hideCloningIfNotSaved(variantIndex, stepIndex) {
                if (this.variants[variantIndex].steps[stepIndex].variant_step_id === 0) {
                    return false;
                } else {
                    return true;
                }
            },
            checkIfLastStepDeleteFunctionality(variantIndex, stepIndex) {
                let check = this.variants[variantIndex].steps.length - 1;
                if (check === stepIndex) {
                    return true;
                }
            },
            selectCurrentIndexes(index, stepIndex, stepDelay) {
                this.currentVariantIndex = index;
                this.currentVariantStepIndex = stepIndex;
                let variantStepDetails = this.variants[this.currentVariantIndex].steps[
                    stepIndex
                    ];
                if (variantStepDetails.delayNo) {
                    this.delayType = variantStepDetails.delayType;
                    this.delayNo = variantStepDetails.delayNo;
                }
                if (stepDelay === 0) {
                    this.delayNo = 1;
                    this.delayType = 'day';
                }
                this.checkIfStepIsInEditMode();
            },
            checkIfStepIsInEditMode() {
                let stepId = this.variants[this.currentVariantIndex].steps[this.currentVariantStepIndex].variant_step_id;
                if (stepId > 0) {
                    this.stepEditMode = true;
                } else {
                    this.stepEditMode = false;
                }
            },
            checkIfVariantIsInEditMode() {
                let variantId = this.variants[this.currentVariantIndex].variant_id;
                if (variantId > 0) {
                    this.variantDetailEditMode = true;
                } else {
                    this.variantDetailEditMode = false;
                }
            },
            saveVariantStepsDelays() {
                if (!this.delayNo) {
                    this.errors.delayNo.message = "Delay duration is required";
                    return false;
                }
                if (!this.delayType) {
                    this.errors.delayType.message = "Delay type is required";
                    return false;
                }
                if (this.delayNo < 0) {
                    this.errors.delayNo.message = "Delay should be a positive integer";
                    return false;
                }
                this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ].delayNo = this.delayNo;
                this.variants[this.currentVariantIndex].steps[
                    this.currentVariantStepIndex
                    ].delayType = this.delayType;

                let btn = this.$refs.delayModalCloseBtn;
                btn.click();
                this.errors.delayType.message = "";
                this.errors.delayNo.message = "";
                if (this.stepEditMode) {
                    this.updateStepDelay();
                } else {
                    this.initializeDefaultDelay()
                }
            },
            initializeDefaultDelay() {
                setTimeout(() => {
                    this.delayNo = 0;
                    this.delayType = "";
                }, 200);
            },
            getVariantDistribution(variant, index) {
                this.channelErrors.percentage.message = '';
                this.currentVariantIndex = index;
                this.variantEditMode = true;
                this.selectedCampaignType = variant.type;
                this.percentage = variant.percentage;
                this.emailContent.fromEmail = variant.from_email;
                this.emailContent.fromName = variant.from_name;
                this.emailContent.subject = variant.subject;
                this.setPercentageLimit();
                // if first variant sets to be 100 % and user needs to add more variant , so the percentage limit needs to be set to 100 in case of a first variant is added with 100%
                if (this.percentage === 100) {
                    this.percentageLimit = 100;
                } else {
                    this.percentageLimit += this.percentage;
                }
                this.checkIfVariantIsInEditMode();
            },
            revertVariantLimitPercentage() {
                this.channelErrors.percentage.message = '';
                let variant = this.variants[this.currentVariantIndex];
                if (variant) {
                    this.percentage = variant.percentage;
                    this.setPercentageLimit();
                }
                // revert calculated percentage if edit mode of variant is true else if after editing percentage of variant edit mode turns into false.
                if (this.variantEditMode) {
                    this.percentageLimit -= this.percentage;
                }
            },
            checkConditionsBeforeMakingClone(variantIndex, stepIndex) {
                this.currentVariantStepIndex = this.variants[variantIndex].steps.length;
                let variant = this.variants[variantIndex];
                let variantLastStep = this.variants[variantIndex].steps[this.variants[variantIndex].steps.length - 1];
                if (variant.steps.length > 0) {
                    // if (variant.steps.length > 0 && this.scheduleType === 'Once') {
                    //     this.$swal({
                    //         position: 'top-right',
                    //         type: 'warning',
                    //         title: 'Can only create one step per variant in Schedule Type is equal to once case',
                    //         showConfirmButton: false,
                    //         timer: 2500
                    //     });
                    //     return false;
                    // } else
                    if (!variantLastStep.variant_step_id > 0) {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'Please Save Current Variant Step First',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        return false;
                    } else if (variant.steps.length === 5) {
                        this.$swal({
                            position: 'top-right',
                            type: 'warning',
                            title: 'You cannot create more than 5 steps',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        return false;
                    }
                }
                this.$swal({
                    title: 'Are you sure? You want to Clone this Variant Step',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes Clone it!',
                    cancelButtonText: 'Cancel it!',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                }).then((result) => {
                    if (result.value) {
                        this.cloneVariantStep(variantIndex, stepIndex);
                    } else {
                        this.$swal('Cancelled', '', 'info')
                    }
                })
            },
            cloneVariantStep(variantIndex, stepIndex) {
                this.currentVariantStepIndex = this.variants[variantIndex].steps.length;
                this.currentVariantIndex = variantIndex;
                let clonedStep = this.variants[variantIndex].steps[stepIndex];
                // let stepToClone = this.variants[stepIndex].steps.length - 1;
                this.variants[variantIndex].steps.length <= 4
                    ? this.variants[variantIndex].steps.push({
                        step: this.variants[variantIndex].steps.length + 1,
                        variant_step_id: 0,
                        stepDetails: clonedStep.stepDetails,
                        delayNo: stepIndex === 0 ? 1 : clonedStep.delayNo,
                        delayType: clonedStep.delayType
                    })
                    : null;
                this.variants.length <= 2 &&
                this.variants[variantIndex].steps.length > 0
                    ? (this.typeModalShow = true)
                    : (this.typeModalShow = false);
                let stepDetail = [];
                stepDetail.push(clonedStep.stepDetails);
                this.submitVariantStepsDetails(stepDetail)
            },
            listenFromSemanticCreationStep() {
                this.bus.$on("getVariantArray", (data) => {
                    let payLoad = {
                        variants: this.variants,
                        scheduleType: this.scheduleType,
                        percentageLimit: this.percentageLimit
                    };
                    this.bus.$emit("receiveVariantsFromStep5", payLoad);
                });
            },
            maintainSavedState(currVal) {
                this.variants = [];
                this.percentageLimit = 100;
                if (currVal[0]) {
                    // this.$emit("getBoardStepsData", this.boardId);
                    currVal.forEach((val, index) => {
                        if (val.variant_type == 'Email') {
                            this.isFromEmailValid = val.isFromEmailValid;
                            if (val.isFromEmailValid == true) {
                                this.bus.$emit("disableLaunchBtn", false);
                            } else {
                                this.bus.$emit("disableLaunchBtn", true);
                            }
                        }
                        this.percentageLimit -= val.distribution;
                        this.selectedVariantType = this.selectedVariantType.filter(
                            e => e !== val.variant_type
                        );
                        this.percentage -= val.distribution;
                        this.variants.push({
                            percentage: val.distribution,
                            variant_id: val.variant_id,
                            type: val.variant_type,
                            count: index + 1,
                            show: true,
                            steps: val.variant_steps.length > 0 ? val.variant_steps : [],
                            from_email: val.from_email,
                            from_name: val.from_name,
                            subject: val.subject,
                        });
                    });
                    // this.copyVariants = this.variants;
                    // $("#"+index+"id").removeClass("disabled");
                }

            },
            clearRequiredMessagesDelays() {
                this.errors.delayNo.message = "";
                this.errors.delayType.message = "";
                this.initializeDefaultDelay()
            },
            recallBoardStepIfEmail() {
                if (this.campaignType.code === 'email' || this.campaignType.code === 'Email') {
                    // this.bus.$emit("switchLanguage");
                    // this.$emit("getBoardStepsData", this.boardId);
                    // this.variants = this.copyVariants;
                }
                // this.bus.$emit("switchLanguage");
            },
            updateStepDelay() {
                let clonedStep = this.variants[this.currentVariantIndex].steps[this.currentVariantStepIndex];
                let stepDetail = [];
                stepDetail.push(clonedStep.stepDetails);
                this.submitVariantStepsDetails(stepDetail)
            }
        },
        watch: {
            hitApi: {
                handler(currVal, oldVal) {

                }
            },
            boardId(currVal, oldVal) {
                this.action = "update";
                console.log(currVal)
                if (currVal) {
                    this.boardId = currVal;
                } else if (oldVal) {
                    this.boardId = oldVal;
                }
            },
            getBoardStep: {
                handler(currVal, oldVal) {
                    this.maintainSavedState(currVal);
                }
            },
            getAllBoardSteps: {
                handler(currVal, oldVal) {
                    if (currVal.length > 0) {
                        console.log(currVal)
                        this.isAllStepInfoReady = true;
                        this.scheduleType = currVal[1].selectedScheduleType.label;
                    }
                  if(this.$route.params.action != "view") {
                    if (!this.checkExpireStartAndEndDates()) {
                      this.bus.$emit("startEndDateExpiredEvent", true);
                    }
                  }
                },
            }
        }
    };
</script>

<style scoped>
    a.disabled {
        color: #e4e5e6;
    }

    .twocolumns.fixed_width_cols {
        max-width: 666px;
        margin: 5px auto 0px;
    }

    .invalid_email {
        border: 1px solid red !important;
    }
</style>