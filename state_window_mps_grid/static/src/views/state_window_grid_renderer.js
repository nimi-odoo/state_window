/** @odoo-module */

import { GridRenderer } from "@web_grid/views/grid_renderer";

export class StateWindowGridRenderer extends GridRenderer {
    static components = {
        ...GridRenderer.components,
    };
    
    getFieldAdditionalProps(fieldName) {
        const props = super.getFieldAdditionalProps(fieldName);
        if (fieldName in this.props.model.milestoneData) {
            props.milestoneData = this.props.model.milestoneData[fieldName];
        }
        return props;
    }

    /**
     * @override
     */
    get gridTemplateColumns() {
        if (!this.props.measureField.name == "quantity_manufacturing") return super.gridTemplateColumns;

        return `auto repeat(${this.props.columns.length}, ${
            this.props.columns.length > 7 ? "minmax(16ch, auto)" : "minmax(10ch, 1fr)"
        }) minmax(16ch, 10em)`;
    }
}
