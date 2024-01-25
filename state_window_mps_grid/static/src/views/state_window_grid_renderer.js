/** @odoo-module */

import { GridRenderer } from "@web_grid/views/grid_renderer";
import { parseDate, formatDate } from "@web/core/l10n/dates";

export class StateWindowGridRenderer extends GridRenderer {
    static components = {
        ...GridRenderer.components,
    };
    static template = "state_window_mps_grid.StateWindowRenderer";
    
    getFieldAdditionalProps(fieldName) {
        const props = super.getFieldAdditionalProps(fieldName);
        if (fieldName in this.props.model.milestoneData) {
            props.milestoneData = this.props.model.milestoneData[fieldName];
        }
        if (fieldName in this.props.model.earliestDate) {
            props.earliestDate = this.props.model.earliestDate[fieldName];
        }
        return props;
    }

    getMoPossibleStatus(row, column) {
        let earliestDate = ""
        if (this.row.valuePerFieldName["bom_id"][0] in this.props.model.earliestDate["bom_id"]) {
            earliestDate = this.props.model.earliestDate["bom_id"][this.row.valuePerFieldName["bom_id"][0]]["earliest_date"]
        }
        const columnDate = column.dateEnd;
        if (!(earliestDate && columnDate)) return 0;
        console.log(`${formatDate(parseDate(earliestDate))} < ${formatDate(parseDate(columnDate))} ? ${parseDate(columnDate).startOf("day") < parseDate(earliestDate).startOf("day")}`)
        if (parseDate(columnDate).startOf("day") < parseDate(earliestDate).startOf("day")) {
            return 1;
        }
        return 0;
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
