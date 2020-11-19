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
            };
        },
        mounted() {
            this.appendScriptFilesToHead();
            setTimeout(() => {
                this.initializeCkEditor();
            }, 500);
            this.listenForEvent();
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
                this.editor = CKEDITOR.replace('editor', {
                    fullPage: true,
                    toolbar: [['Source', 'Bold', 'Italic', 'Underline', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'Link', 'Image', 'Font', 'FontSize', 'TextColor', 'BGColor', 'galleryButton', 'insertAttributeButton']],
                    allowedContent: true,
                    language: this.editorObj.lang,
                    height: 500,

                    contentsCss: '.templete{ padding: 20px; border: none !important; box-shadow: 0 0px 6px #e6e6e6 inset;}.top_header img{ width:60%; margin-top:12px; height:150px; display:block;object-fit:scale-down;}.templete_sec img{ width:100%; height:150px; display:block;}',
                    /* stylesSet: [
                         {name: 'Paragraph', element: 'p', attributes: {'class': 'helloworld'}},
                         { element: 'p', attributes: { 'class': 'helloworld2' } },
                         { element: 'pre', attributes: { 'class': 'helloworld2' } }
                     ]*/
                });
                this.editor.config.font_names = 'montserrat;roboto;' + this.editor.config.font_names;
                this.editor.config.enterMode = CKEDITOR.ENTER_BR;
                // CKEDITOR.addCss('.templete{ padding: 20px; border: none !important; box-shadow: 0 0px 6px #e6e6e6 inset;}');
                CKEDITOR.addCss('.top_header img{ width:60%; margin-top:12px; height:150px; display:block;object-fit:scale-down;}');
                CKEDITOR.addCss('.templete_sec img{ width:100%; height:150px; display:block;}');
                //this.editor.addCss('pre {background: red}')


                this.editor.on('instanceReady', function (ev) {
                    ev.editor.dataProcessor.writer.setRules('br',
                        {
                            indent: false,
                            breakBeforeOpen: false,
                            breakAfterOpen: false,
                            breakBeforeClose: false,
                            breakAfterClose: false
                        });
                });
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
                    console.log('content', this.content);

                    this.bus.$emit('updateEditorContent', this.content);
                });

            },
            listenForEvent() {
                this.bus.$on("passContent", (data) => {
                    let content = '';
                    if (data.type == 'code') {
                        content = '&lrm;[[$' + data.content + ']]&lrm;';
                    } else {
                        content = '<image src="' + data.content + '" style="max-width:100%;height: auto;"/>';
                    }
                    this.editor.insertHtml(content);
                });
            }
        },
        watch: {
            editorObj: {
                handler(currVal, oldVal) {
                    this.content = this.editorObj.content;
                    if (this.editorObj.key != this.key) {
                        this.editor.destroy();
                        this.key = this.editorObj.key;
                        this.initializeCkEditor();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>