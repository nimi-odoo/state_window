{
    "name": "State Window MPS",
    "summary": """
        State Window MPS
    """,
    "description": """
        Task ID: 3682833
        State Window MPS
    """,
    "license": "OPL-1",
    "author": "Odoo, Inc.",
    "website": "https://www.odoo.com",
    "category": "Proof of Concept",
    "version": "1.0.0",
    "depends": ["mrp", "project", "web_grid"],
    "data": [
        "views/mrp_production_views.xml",
        "views/project_milestone_views.xml"
    ],
    "assets": {
        "web.assets_backend": [
            "state_window_mps_grid/static/src/**"
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "module_type": "official"
}
