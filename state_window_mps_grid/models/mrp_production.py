from odoo import api, fields, models

class MrpProduction(models.Model):
    _inherit = "mrp.production"

    project_id = fields.Many2one(comodel_name="project.project")
    date = fields.Date(string="Date", required=True, index=True, default=fields.Date.context_today)
    mrp_production_ids = fields.Many2one(comodel_name="mrp.production")

    milestone_id = fields.Many2one(comodel_name="project.milestone")
    floor = fields.Integer(related="milestone_id.floor", readonly=False)
    quantity_needed = fields.Float(related="milestone_id.quantity_needed", string="Needed Quantity", readonly=False)
    deadline = fields.Date(related="milestone_id.deadline", store=True, index=True, readonly=False)

    _sql_constraints = [
        ('name_uniq', 'unique(name, company_id)', 'Reference must be unique per Company!'),
        ('qty_positive', 'check (product_qty >= 0)', 'The quantity to produce must be positive!'),
    ]

    @api.model
    def grid_update_cell(self, domain, measure_field_name, value):
        if value == 0: return
        if order := self.search(domain, limit=2):
            # TODO: if value == 0: cancel mo
            if order[measure_field_name] + value == 0:
                order.action_cancel()
            # else:
            order[measure_field_name] += value

        else:
            # terrible implementation incoming...
            project_id, milestone_id, bom_id, date = None, None, None, None
            for leaf in domain:
                if leaf[0] == "project_id":
                    project_id = leaf[2]
                elif leaf[0] == "milestone_id":
                    milestone_id = leaf[2]
                elif leaf[0] == "bom_id":
                    bom_id = leaf[2]
                elif leaf[0] == "date" and not date:
                    date = leaf[2]
            self.create({
                "project_id": project_id,
                "milestone_id": milestone_id,
                "bom_id": bom_id,
                "date": date,
                measure_field_name: value,
            }).action_confirm()
