<template>
    <div>
        <img style="display: none" id="attribute" src="../../../assets/images/attribute_icon.png">
        <img style="display: none" id="gallery" src="../../../assets/images/addImage.png">
        <textarea name="content" id="editor"></textarea>
    </div>
</template>

<script>

    export default {
        props: ['editorObj'],
        data() {
            return {
                editor: {},
                content: this.editorObj.content,
                key: this.editorObj.key,
                passCode: false,
                contentOnchange: false
            };
        },
        mounted() {
            this.appendScriptFilesToHead();
            setTimeout(() => {
                this.initializeCkEditor();
            }, 500);
            this.listenForEvent();
            if(!this.content){
            this.content = this.emailTemplate;
            }
        },
        beforeDestroy() {
            this.bus.$off("passContent");
        },
        methods: {
            appendScriptFilesToHead() {
                let filePath = "https://cdn.ckeditor.com/4.10.0/full/ckeditor.js";
                if ($('head script[src="' + filePath + '"]').length <= 0) {
                    var plugin = document.createElement("script");
                    plugin.setAttribute(
                        "src",
                        filePath
                    );
                    plugin.async = true;
                    document.head.appendChild(plugin);
                }
            },
            initializeCkEditor() {
                try {
                    this.editor = CKEDITOR.replace('editor', {
                        fullPage: true,
                        toolbar: [['Source', 'Bold', 'Italic', 'Underline', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'Link', 'Image', 'Font', 'FontSize', 'TextColor', 'BGColor', 'galleryButton', 'insertAttributeButton']],
                        allowedContent: true,
                        language: this.editorObj.lang,
                        height: 500,
                        /*contentsCss: '.helloworld { background-color:red;}.helloworld2 { background-color:#5555C0;}',
                        stylesSet: [
                            {name: 'Paragraph', element: 'p', attributes: {'class': 'helloworld'}},
                            { element: 'p', attributes: { 'class': 'helloworld2' } },
                            { element: 'pre', attributes: { 'class': 'helloworld2' } }
                        ]*/
                    });
                } catch (e) {
                    console.log(e);
                    this.appendScriptFilesToHead();
                    setTimeout(() => {
                    this.initializeCkEditor();
                    }, 500);
                }


                //this.editor.addCss('pre {background: red}')

                /*CKEDITOR.stylesSet.add('my_styles', [
                    // Block-level styles
                    {name: 'Blue Title', element: 'h2', styles: {'color': 'Blue'}},
                    {name: 'Red Title', element: 'h3', styles: {'color': 'Red'}},

                    // Inline styles
                    {name: 'CSS Style', element: 'span', attributes: {'class': 'my_style'}},
                    {name: 'Marker: Yellow', element: 'span', styles: {'background-color': 'Yellow'}}
                ]);

                config.stylesSet = 'my_styles';*/

                this.editor.ui.addButton('galleryButton', {
                    label: "Media Gallery",
                    command: 'openGalleryModal',
                    icon: $("#gallery").attr("src")
                });

                this.editor.addCommand("openGalleryModal", {
                    exec: (edt) => {
                        this.$emit("openGalleryModal");
                    }
                });

                this.editor.ui.addButton('insertAttributeButton', {
                    label: "Insert Attribute",
                    command: 'insertAttributeCommand',
                    icon: $("#attribute").attr("src")
                });

                this.editor.addCommand("insertAttributeCommand", {
                    exec: (edt) => {
                        this.$emit("openAttributeModal");
                    }
                });

                if (!this.content.includes("pre {")) {

                    this.content = this.content.split("<style>");
                    this.content = "<style>" + "pre {\n" +
                        "    white-space: pre-wrap;\n" +
                        "    white-space: -moz-pre-wrap;\n" +
                        "    white-space: -o-pre-wrap;\n" +
                        "    word-wrap: break-word;\n" +
                        "    white-space: -pre-wrap;\n" +
                        "}" + this.content[1];
                }

                this.editor.setData(this.content);

                this.editor.on('change', (e) => {
                    this.content = this.editor.document.getBody().getHtml();
                    this.bus.$emit('updateEditorContent', this.content);
                    this.contentOnchange = true;
                });
                this.bus.$on("saveEmailContent", (data) => {
                    // this.bus.$emit('updateEditorContent', this.content);
                    this.editor.content = '';
                    this.contentOnchange = true;
                });

                this.bus.$on("makeContentToFalse", (data) => {
                    this.contentOnchange = false;
                });

                if (!this.editor) {
                    this.initializeCkEditor();
                }
            },
            listenForEvent() {
                this.bus.$on("passContent", (data) => {
                    let content = '';
                    if (data.type == 'code') {
                        content = '&lrm;[[$' + data.content + ']]&lrm;';
                    } else {
                        content = '<image src="' + data.content + '"/>';
                    }
                    this.editor.insertHtml(content);
                    this.passCode = true;
                });
            }
        },
        watch: {
            editorObj: {
                handler(currVal, oldVal) {
                    // if(this.passCode) {
                    //     if(!currVal.content && !this.content) {
                    //         this.content = this.emailTemplate;
                    //         this.key = currVal.key;
                    //         this.key = this.editorObj.key;
                    //         this.editor.destroy();
                    //         this.initializeCkEditor();
                    //         this.passCode  = false;
                    //     }
                    // else if(currVal.content && currVal.content !== this.emailTemplate && currVal.content !== oldVal.content) {
                    //      this.content = currVal.content;
                    //      this.key = currVal.key;
                    //      this.key = this.editorObj.key;
                    //      this.editor.destroy();
                    //      this.initializeCkEditor();
                    //      this.passCode  = false;
                    //  }
                    // else if (currVal.content !== oldVal.content) {
                    //      this.content = this.emailTemplate;
                    //      this.key = currVal.key;
                    //      this.key = this.editorObj.key;
                    //      this.editor.destroy();
                    //      this.initializeCkEditor();
                    //      this.passCode  = false;
                    //
                    //  }

                    // else if (!currVal.content) {
                    //     this.content = this.emailTemplate;
                    //     this.editor.destroy();
                    //     this.initializeCkEditor();
                    //     this.passCode  = false;
                    // }

                    // }
                    // if (currVal.content === oldVal.content) {
                    //     this.content = this.emailTemplate;
                    //     this.editor.destroy();
                    //     this.key = this.editorObj.key;
                    //     this.initializeCkEditor();
                    // } else

// debugger
                    if (this.editorObj.key != this.key) {
                        this.contentOnchange = false;
                    }
                    if (!this.contentOnchange) { // just change && condition and remove " && currVal.content "
                        if (this.editorObj.key != this.key) {
                            this.content = this.editorObj.content;
                            this.editor.destroy();
                            this.key = this.editorObj.key;
                            this.initializeCkEditor();
                            this.contentOnchange = false;
                        } else if (this.editorObj.key === this.key) {
                            this.content = this.editorObj.content;
                            if (!currVal.content) {
                                this.content = this.emailTemplate;
                            }
                            this.editor.destroy();
                            this.initializeCkEditor();
                            this.contentOnchange = false;
                        }
                    }
                    if (!currVal.content) {
                        this.content = this.emailTemplate;
                        this.editor.destroy();
                        this.initializeCkEditor();
                    }


                    // this.content = this.editorObj.content;
                    // if (this.editorObj.key != this.key) {
                    //     this.editor.destroy();
                    //     this.key = this.editorObj.key;
                    //     this.initializeCkEditor();
                    // }


                    // }
                    // if(currVal.content === oldVal.content || currVal.content !== oldVal.content){
                    //     this.content = currVal.content;
                    //     this.editor.destroy();
                    //     this.initializeCkEditor();
                    // }


                    // if (this.editorObj.key != this.key) {
                    //     this.content = currVal.content;
                    //     this.editor.destroy();
                    //     this.key = this.editorObj.key;
                    //     this.initializeCkEditor();
                    // }
                    //
                    // if (this.emailTemplate === currVal.content) {
                    //     this.content = currVal.content;
                    //     this.editor.destroy();
                    //     this.initializeCkEditor();
                    // }


                    // this.content = this.editorObj.content;
                    // if (this.editorObj.key != this.key) {
                    //     this.editor.destroy();
                    //     this.key = this.editorObj.key;
                    //     this.initializeCkEditor();
                    // }

                }
            }
        }
    }
</script>

<style scoped>

</style>