from odoo import api, fields, models, _

class ProjectMilestone(models.Model):
    _name = "project.milestone"
    _inherit = ["project.milestone", "state.window.mps.grid.mixin"]

    floor = fields.Integer()
    bom_id = fields.Many2one(comodel_name="mrp.bom")
    quantity_needed = fields.Float()

    def get_milestone_fields(self):
        return ["quantity_needed"]
