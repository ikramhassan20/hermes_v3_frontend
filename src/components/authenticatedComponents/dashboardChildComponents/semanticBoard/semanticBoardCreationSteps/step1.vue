<template>
    <div class="tab active" id="basics_tab">
        <div class="inner_tab_content">
            <div class="inner_tab_text active" id="schedule1">
                <div class="inner_tab_widget">
                    <div class="heading_holder">
                        <h2>Board Name</h2>
                    </div>
                    <div class="txt_holder">
                        <div class="input_row fluid">
                            <input type="text" :readonly="board.status === 'active' || board.status === 'expired' || board.status === 'suspended'" placeholder="Board Name" v-model="board.name">
                            <p class="error">{{errors.name.message}}</p>
                        </div>
                        <header class="table_header">
                            <div class="table_header_holder no_border semantix_tabs">
                                <div class="semantix_tags">
                                    <input-tag placeholder="Enter Tags" :add-tag-on-blur="true"
                                               v-bind:key="board.tagsOriginal.length"
                                               v-model="board.tagsOriginal" :read-only="board.status === 'active' || board.status === 'expired' || board.status === 'suspended'"></input-tag>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import InputTag from 'vue-input-tag';

    export default {
        name: "step1",
        props: ['hitApi', 'boardId', 'getBoardStep'],
        components: {
            InputTag,
        },
        data() {
            return {
                board: {
                    name: "",
                    tagsOriginal: [],
                    step: "general",
                },
                action: "create",
                errors: {
                    name: {
                        message: ''
                    }
                },
            }
        },
        methods: {
            validate() {
                let success = true;
                if (this.board.name == '') {
                    this.errors.name.message = 'Board Name is required';
                    success = false;
                } else {
                    this.errors.name.message = '';
                    success = true;
                }
                return success;
            },
            submitStep() {
                if (this.validate()) {
                    this.bus.$emit("disableNextBtn", true);
                    let payLoad = {
                        resource: "board",
                        action: this.action,
                        data: this.board
                    };

                    if (this.boardId != -1) {
                        payLoad.id = this.boardId;
                    }

                    this.api("post",
                        this.constants.getUrl("backendApiUrl"),
                        payLoad,
                        this.authHeaders,
                        true,
                    ).then((response) => {
                        console.log('response', response);
                        this.bus.$emit("disableNextBtn", false);
                        if (response.data.meta.code === 200) {
                            if (response.data.data.status != undefined && !response.data.data.status && response.data.data.dialogueOpen) {
                                this.$swal({
                                    position: 'top-right',
                                    type: 'warning',
                                    title: response.data.data.message,
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                            } else {
                                this.$emit("goNext", response.data.data.id);
                                this.updateStep();
                            }
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
            updateStep() {
                this.bus.$emit("step1", {
                    name: this.board.name,
                    tagsOriginal: this.board.tagsOriginal
                });
            },
        },
        watch: {
            hitApi: {
                handler(currVal, oldVal) {
                    console.log('currVal', currVal);
                    if (currVal.step == 1) {
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
                        this.board = currVal;
                        this.updateStep();
                    }
                },
                deep: true
            }

        }
    }
</script>

<style scoped>
    .input_row.fluid input {
        width: 100% !important;
    }

</style>