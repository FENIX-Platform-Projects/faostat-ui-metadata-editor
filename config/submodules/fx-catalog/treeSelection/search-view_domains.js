/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/views/search-template',
    'fx-cat-br/config/SearchTreeView',
    'fx-d-m/config/events',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'fx-d-m/components/resource-manager',
    'amplify',
    'pnotify',
    'jstree'
], function ($, Chaplin, C, DC, View, template, searchTreeView, Events, MLRes, ResourceManager) {

    'use strict';

    var s = {
        TREE_CONTAINER: "#domain-tree"
    };

    var c = {
        FAOSTAT_URL: "http://faostat3.fao.org/wds/rest/groupsanddomains/faostatdb/E",
        FAOSTAT_PREFIX_UID: "FAOSTAT_"
    }

    var SearchView = View.extend({

        initialize: function (o) {
            $.extend(true, this, o);
            View.prototype.initialize.call(this, arguments);
        },

        // Automatically render after initialize
        autoRender: true,

        className: 'search-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this._initTree();

        },

        _initTree: function () {

            $.get(c.FAOSTAT_URL, function (data) {

                /* Buffer. */
                var buffer = [];
                var payload = [];
                var json = data;

                /* Iterate over domains. */
                for (var i = 0; i < json.length; i++) {

                    /* Create group node. */
                    if ($.inArray(json[i][0], buffer) < 0) {
                        buffer.push(json[i][0]);
                        payload.push({
                            id: json[i][0],
                            text: json[i][1],
                            parent: '#'
                        });
                    }

                    /* Add domain node. */
                    payload.push({
                        id: json[i][2],
                        text: json[i][3],
                        parent: json[i][0]
                    });
                }

                /* Init JSTree. */
                $(s.TREE_CONTAINER).jstree({

                    'plugins': ['unique', 'search', 'types', 'wholerow'],

                    'core': {
                        'data': payload,
                        'themes': {
                            'icons': false,
                            'responsive': true
                        }
                    },

                    'search': {
                        'show_only_matches': true,
                        'close_opened_onclear': false
                    }

                }).on('select_node.jstree', function (e, data) {

                    amplify.publish('searchTreeView_resourceSelected', { metadata: { uid: c.FAOSTAT_PREFIX_UID + data.node.id } });

                });
            });

        },

        bindEventListeners: function () {
            amplify.subscribe('searchTreeView_resourceSelected', this, this.selectResource);
        },

        selectResource: function (res) {
            var succ = null;
            var err = function () {
                new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
            }
            var noData = function () {
                var defResource = {
                    metadata: {
                        dsd: {
                            contextSystem: "FAOSTAT"
                        },
                        meContent: {
                            resourceRepresentationTypeLabel: { EN: "Dataset" },
                            resourceRepresentationType: "dataset"
                        }
                    }
                };

                defResource.metadata.uid = res.metadata.uid;
                if (res.metadata.version)
                    dedefResourcefDSD.metadata.version = res.metadata.version;
                var success = function () {
                    amplify.publish('searchTreeView_resourceSelected', defResource);
                };
                var complete = null;
                var err = function () {
                    new PNotify({ title: '', text: "Error creating resource", type: 'error' });
                };
                ResourceManager.createMeta(defResource, success, complete, err);
            }

            Chaplin.mediator.publish(Events.RESOURCE_SELECT, res, succ, err, noData);
        },

        dispose: function () {
            amplify.unsubscribe('searchTreeView_resourceSelected', this.selectResource);
            View.prototype.dispose.call(this, arguments);
        }
    });

    return SearchView;
});
