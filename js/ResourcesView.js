import Adapt from 'core/js/adapt';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';

export default class ResourcesView extends Backbone.View {

  className() {
    return 'resources';
  }

  initialize() {
    this.onResourceItemClicked = this.onResourceItemClicked.bind(this);

    this.listenTo(Adapt, 'remove', this.remove);
    this.listenTo(Adapt, 'resources:showResource', this.showResource);
    this.render();
  }

  render() {
    const data = {
      ...this,
      model: this.model.toJSON(),
      resources: this.model.get('_resources'),
      resourceTypes: this.model.get('_resourceTypes'),
      _showFilters: this.model.get('_showFilters'),
      _filterColumnCount: this.model.get('_filterColumnCount'),
      _canDownload: this.model.get('_canDownload')
    };
    ReactDOM.render(<templates.resources {...data} />, this.el);

    _.defer(() => {
      Adapt.trigger('view:render', this);
      this.listenTo(Adapt, 'drawer:closed', this.remove);
    });

    return this;
  }

  onResourceItemClicked(e) {
    const index = $(e.currentTarget).attr('data-index');
    const resourceItemData = this.model.get('_resourcesItems')[index];
    Adapt.trigger('resources:itemClicked', resourceItemData);
  }

  showResource(id) {
    if (!id) return;

    this.model.get('_resourcesItems').forEach((item, index) => {
      if (item._id === id) {
        const $el = this.$('.resources__item').eq(index);
        $el.addClass('is-highlighted');
        $('.js-drawer-holder').animate({scrollTop: ($el.position().top - $('.drawer__toolbar').height())});
      }
    });
  }

}
