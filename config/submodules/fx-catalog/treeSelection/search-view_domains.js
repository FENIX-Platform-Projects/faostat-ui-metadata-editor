/*global define, amplify*/
define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/search.hbs',
    'fx-cat-br/config/SearchTreeView',
    'fx-d-m/config/events',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'amplify',
    'pnotify'
], function (Chaplin, C, DC, View, template, searchTreeView, Events, MLRes) {

    'use strict';

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

            this.searchTW = new searchTreeView();
            this.searchTW.init($('#catalog-container'));
        },

        bindEventListeners: function () {
            amplify.subscribe('searchTreeView_resourceSelected', this, this.selectResource);
        },

        selectResource: function (res) {
            var succ = null;
            var err = function () {
                new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
            }

            Chaplin.mediator.publish(Events.RESOURCE_SELECT, res, succ, err);
        },

        dispose: function () {

            amplify.unsubscribe('searchTreeView_resourceSelected', this.selectResource);

            View.prototype.dispose.call(this, arguments);
        }
    });

    return SearchView;
});
