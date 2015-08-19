/*global define */

define([
        "jquery",
        'chaplin',
        'fx-d-m/config/events',
        'fx-d-m/components/resource-manager',
        "text!fx-cat-br/html/fx_catalog_structure.html",
        'fx-cat-br/config/config',
        'fx-cat-br/config/config-default',
        'handlebars',
        'amplify'
],
    function ($, Chaplin, Events, ResourceManager, searchTreeViewHTML, C, DC, Handlebars) {

        'use strict';

        function SearchTreeView(o) {
            this.$cnt;
        }

        SearchTreeView.prototype.init = function (cnt) {
            this.$cnt = cnt;

            this.$cnt.html('<button type="button" id="btnDomainSelect">Select</button>');
            var btnDomSel = this.$cnt.find('#btnDomainSelect');

            //var me = this;

            btnDomSel.on('click', function () {
                amplify.publish('searchTreeView_resourceSelected', { metadata: { uid: 'FAOSTAT_test1' } });
            });
        };

        return SearchTreeView;

    });
