/** @odoo-module */

import { serializeDate } from "@web/core/l10n/dates";
import { GridDataPoint, GridModel } from "@web_grid/views/grid_model";
import { Domain } from "@web/core/domain";

export class StateWindowGridDataPoint extends GridDataPoint {
    async load() {
        await super.load();
        if (!this.orm.isSample) {
            await Promise.all(this.stateWindowMilestonePromises);
        }
    }

    async _initialiseData() {
        await super._initialiseData();
        this.data.milestoneData = {};
        this.data.earliestDate = {};
    }

    get stateWindowMilestonePromises() {
        return [
            this._fetchMilestoneData("milestone_id"),
            this._fetchEarliestDate("bom_id"),
        ];
    }

    get columnGroupByFieldName() {
        return this.columnFieldIsDate
            ? this.navigationInfo.range.name === 'year' ? `${this.columnFieldName}:week` : `${this.columnFieldName}:day`
            : this.columnFieldName;
    }

    async _fetchMilestoneData(fieldName) {
        const field = this.fieldsInfo[fieldName];
        if (!field) return [];

        const fieldValues = this._getFieldValuesInSectionAndRows(field);
        if (!fieldValues.length) return fieldValues;

        const result = await this.orm.call(field.relation, "get_floor_and_quantity_needed", [
            fieldValues,
        ]);

        this.data.milestoneData[fieldName] = result;
    }

    async _fetchEarliestDate(fieldName) {
        console.log("woooooah break here") 
        const field = this.fieldsInfo["bom_id"]
        const fieldValues = this._getFieldValuesInSectionAndRows(field);
        const result = await this.orm.call(field.relation, "get_earliest_date", [
            fieldValues,
        ]); 
        this.data.earliestDate[fieldName] = result;
    }

    _getFieldValuesInSectionAndRows(field) {
        const fieldName = field.name;
        const isMany2oneField = field.type === "many2one";
        const values = new Set();
        if (this.sectionField && this.sectionField.name === fieldName) {
            for (const section of this.sectionsArray) {
                values.add(section.value && isMany2oneField ? section.value[0] : section.value);
            }
        } else if (this.rowFields.some((row) => row.name === fieldName)) {
            for (const row of this.rowsArray) {
                if (!row.isSection) {
                    const value =
                        row.valuePerFieldName[fieldName] && isMany2oneField
                            ? row.valuePerFieldName[fieldName][0]
                            : row.valuePerFieldName[fieldName];
                    values.add(value);
                }
            }
        }
        return [...values];
    }

    /**
     * @override
     */
    async _generateData(readGroupResults) {
        // There are certainly MUCH better ways of handling this!
        let section;
        for (const readGroupResult of readGroupResults.groups) {
            if (!this.orm.isSample) {
                this.record.resIds.push(...readGroupResult.ids);
            }
            const rowKey = this._generateRowKey(readGroupResult);
            if (this.sectionField) {
                const sectionKey = this._generateSectionKey(readGroupResult);
                if (!(sectionKey in this.data.sectionsKeyToIdMapping)) {
                    const newSection = new this.Section(
                        null,
                        { [this.sectionField.name]: readGroupResult[this.sectionField.name] },
                        this,
                        null
                    );
                    this.data.sections[newSection.id] = newSection;
                    this.data.sectionsKeyToIdMapping[sectionKey] = newSection.id;
                    this.data.rows[newSection.id] = newSection;
                    this.data.rowsKeyToIdMapping[sectionKey] = newSection.id;
                }
                section = this.data.sections[this.data.sectionsKeyToIdMapping[sectionKey]];
            } else if (Object.keys(this.data.sections).length === 0) {
                section = this._generateFakeSection();
            }
            let row;
            if (!(rowKey in this.data.rowsKeyToIdMapping)) {
                const { domain, values } = this._generateRowDomainAndValues(readGroupResult);
                row = new this.Row(domain, values, this, section);
                this.data.rows[row.id] = row;
                this.data.rowsKeyToIdMapping[rowKey] = row.id;
            } else {
                row = this.data.rows[this.data.rowsKeyToIdMapping[rowKey]];
            }
            let columnKey;
            if (this.columnFieldIsDate) {
                columnKey = readGroupResult["__range"][this.columnGroupByFieldName].from;
            } else {
                const columnField = this.fieldsInfo[this.columnFieldName];
                if (columnField.type === "selection") {
                    columnKey = readGroupResult[this.columnFieldName];
                } else if (columnField.type === "many2one") {
                    columnKey = readGroupResult[this.columnFieldName][0];
                } else {
                    throw new Error(
                        "Unmanaged column type. Supported types are date, selection and many2one."
                    );
                }
            }
            /* Custom Code Start */
            // Starting the week on Monday to match the column naming convention
            if (readGroupResult?.__range[`${this.columnFieldName}:week`])
                columnKey = `${columnKey.slice(0, -1)}${parseInt(columnKey.slice(-1))+1}`;
            /* Custom Code End */
            if (this.data.columnsKeyToIdMapping[columnKey] in this.data.columns) {
                const column = this.data.columns[this.data.columnsKeyToIdMapping[columnKey]];
                row.updateCell(column, readGroupResult[this.model.measureFieldName]);
                if (this.readonlyField && this.readonlyField.name in readGroupResult) {
                    row.setReadonlyCell(column, readGroupResult[this.readonlyField.name]);
                }
            }
        }
    }
}

export class StateWindowGridModel extends GridModel {
    static DataPoint = StateWindowGridDataPoint;

    get milestoneData() {
        return this.data.milestoneData;
    }
    get earliestDate() {
        return this.data.earliestDate;
    }

}
