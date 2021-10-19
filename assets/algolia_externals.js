(function (algolia) {
    "use strict";
    algolia.externals = {
      // Export the required librarires
      Hogan: window.Hogan,
      instantsearch: window.instantsearch,
      algoliasearch: window.algoliasearch,
      autocomplete: window.autocomplete,
      aa: window.AlgoliaAnalytics.default,
  
      // Export the required widgets
      widgets: {
        rangeSlider: window.instantsearch.widgets.rangeSlider,
        menu: window.instantsearch.widgets.menu,
        refinementList: window.instantsearch.widgets.refinementList,
        searchBox: window.instantsearch.widgets.searchBox,
        stats: window.instantsearch.widgets.stats,
        sortBy: window.instantsearch.widgets.sortBy,
        clearRefinements: window.instantsearch.widgets.clearRefinements,
        panel: window.instantsearch.widgets.panel,
        configure: window.instantsearch.widgets.configure,
        // Define any new widgets here...
        infiniteHits: window.instantsearch.widgets.infiniteHits,
        queryRuleCustomData: window.instantsearch.widgets.queryRuleCustomData,
      },
  
      // Export InstantSearch connectors
      connectors: {
        connectCurrentRefinements: instantsearch.connectors.connectCurrentRefinements,
        connectStats: instantsearch.connectors.connectStats,
        connectHierarchicalMenu: instantsearch.connectors.connectHierarchicalMenu
      },
    };
  })(window.algoliaShopify);
  