"""
===============================================================
SHAURYA MITTAL
PERSONAL DEVELOPER IDENTITY API
===============================================================

File        : app.py
Application : Shaurya Developer Profile API
Version     : 1.0.0
Framework   : Flask
Language    : Python 3

Description:
A lightweight REST API for publishing and accessing structured
developer profile information, projects, interests and links.

Run:
    pip install flask
    python app.py

Local address:
    http://127.0.0.1:5000

===============================================================
"""

from __future__ import annotations

import json
import logging
import os
import re

from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from flask import Flask, jsonify, request, make_response


# ===============================================================
# 01. APPLICATION CONFIGURATION
# ===============================================================

APP_NAME = "Shaurya Developer Profile API"
APP_VERSION = "1.0.0"

BASE_DIR = Path(__file__).resolve().parent

MAX_REQUEST_SIZE = 16 * 1024

PROFILE_FILE = BASE_DIR / "profile.json"
SOCIAL_FILE = BASE_DIR / "social-links.json"
INTERESTS_FILE = BASE_DIR / "interests.json"

GITHUB_USERNAME = "shaurya1233"

GITHUB_PROFILE = (
    "https://github.com/shaurya1233"
)

PORT = int(os.environ.get("PORT", "5000"))

DEBUG = os.environ.get("FLASK_DEBUG", "false").lower() == "true"


# ===============================================================
# 02. FLASK APPLICATION
# ===============================================================

app = Flask(__name__)

app.config.update(
    MAX_CONTENT_LENGTH=MAX_REQUEST_SIZE,
    JSON_SORT_KEYS=False,
    JSONIFY_PRETTYPRINT_REGULAR=True,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(APP_NAME)


# ===============================================================
# 03. DEFAULT PROFILE DATA
# ===============================================================

DEFAULT_PROFILE = {
    "identity": {
        "name": "Shaurya Mittal",
        "username": GITHUB_USERNAME,
        "title": "Student Developer · AI-Assisted Digital Creator",
        "location": "Lucknow, Uttar Pradesh, India",
    },

    "professional_summary": (
        "An aspiring developer interested in web development, "
        "software creation, artificial intelligence and digital products."
    ),

    "interests": [
        "Web Development",
        "Software Development",
        "Artificial Intelligence",
        "Frontend Development",
        "UI and UX Design",
        "Creative Technology",
        "Digital Product Creation",
    ],

    "platforms": {
        "github": GITHUB_PROFILE,
        "portfolio": (
            "https://shaurya1233.github.io/NOUMEN/"
        ),
    },

    "metadata": {
        "version": APP_VERSION,
        "created_by": "Shaurya Mittal",
    },
}


# ===============================================================
# 04. DEFAULT PROJECT DIRECTORY
# ===============================================================

DEFAULT_PROJECTS = [
    {
        "id": "noumen",
        "name": "NOUMEN",
        "category": "portfolio",
        "url": "https://shaurya1233.github.io/NOUMEN/",
        "description": (
            "Personal portfolio and digital development showcase."
        ),
    },

    {
        "id": "mittal-reserve",
        "name": "Mittal Reserve",
        "category": "web-development",
        "url": "https://mittal-reserve.vercel.app/",
        "description": (
            "A premium digital property and hospitality concept."
        ),
    },

    {
        "id": "aurex",
        "name": "AUREX Calculator",
        "category": "software",
        "url": (
            "https://shaurya1233.github.io/AUREX-MITTAL-CALCULATOR/"
        ),
        "description": (
            "A browser-based calculator project."
        ),
    },

    {
        "id": "obsidian-developers",
        "name": "Obsidian Developers",
        "category": "business",
        "url": "https://obsidian-developers.vercel.app/",
        "description": (
            "A digital development and website creation initiative."
        ),
    },

    {
        "id": "windows-11",
        "name": "Windows 11 SHAURYA OS",
        "category": "web-experiment",
        "url": (
            "https://shaurya1233.github.io/WINDOWS-11-Ultimate/"
        ),
        "description": (
            "A browser-based desktop interface experiment."
        ),
    },
]


# ===============================================================
# 05. DEFAULT SOCIAL LINKS
# ===============================================================

DEFAULT_SOCIAL_LINKS = {
    "github": GITHUB_PROFILE,

    "linkedin": None,

    "instagram": (
        "https://www.instagram.com/shaurya_mittal31/"
    ),

    "leetcode": (
        "https://leetcode.com/u/Qlk0uRwuTh/"
    ),

    "codepen": (
        "https://codepen.io/SHAURYA-MITTAL-the-bashful"
    ),

    "mastodon": (
        "https://mastodon.social/@shaurya_dev"
    ),

    "bluesky": (
        "https://bsky.app/profile/"
        "mittalshaurya66-06.bsky.social"
    ),
}


# ===============================================================
# 06. DEFAULT INTERESTS
# ===============================================================

DEFAULT_INTERESTS = {
    "development": [
        "Web Development",
        "Software Development",
        "Frontend Development",
        "Backend Development",
    ],

    "technology": [
        "Artificial Intelligence",
        "Creative Technology",
        "Web Infrastructure",
        "Performance Optimization",
    ],

    "design": [
        "Interface Design",
        "User Experience",
        "Typography",
        "Digital Branding",
    ],

    "exploration": [
        "Digital Entrepreneurship",
        "Product Development",
        "Emerging Technologies",
    ],
}


# ===============================================================
# 07. JSON FILE LOADER
# ===============================================================

def load_json_file(
    file_path: Path,
    fallback: Any,
) -> Any:
    """
    Read a JSON file safely.

    If the file is missing or invalid, use the supplied
    fallback data without stopping the application.
    """

    if not file_path.exists():
        logger.info(
            "Data file not found: %s",
            file_path.name,
        )

        return fallback

    try:
        with file_path.open(
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(file)

    except json.JSONDecodeError as error:

        logger.error(
            "Invalid JSON in %s: %s",
            file_path.name,
            error,
        )

    except OSError as error:

        logger.error(
            "Unable to read %s: %s",
            file_path.name,
            error,
        )

    return fallback


# ===============================================================
# 08. DATA ACCESS FUNCTIONS
# ===============================================================

def get_profile() -> dict:
    data = load_json_file(
        PROFILE_FILE,
        DEFAULT_PROFILE,
    )

    return data if isinstance(data, dict) else DEFAULT_PROFILE


def get_projects() -> list:
    data = get_profile()

    projects = data.get("projects")

    if isinstance(projects, list):
        return projects

    return DEFAULT_PROJECTS


def get_social_links() -> dict:
    data = load_json_file(
        SOCIAL_FILE,
        DEFAULT_SOCIAL_LINKS,
    )

    if not isinstance(data, dict):
        return DEFAULT_SOCIAL_LINKS

    return data


def get_interests() -> dict:
    data = load_json_file(
        INTERESTS_FILE,
        DEFAULT_INTERESTS,
    )

    if not isinstance(data, (dict, list)):
        return DEFAULT_INTERESTS

    return data


# ===============================================================
# 09. RESPONSE UTILITIES
# ===============================================================

def success_response(
    data: Any,
    message: str = "Request successful.",
    status: int = 200,
):
    return jsonify({
        "success": True,
        "message": message,
        "data": data,
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }), status


def error_response(
    message: str,
    status: int = 400,
):
    return jsonify({
        "success": False,
        "error": {
            "message": message,
            "status": status,
        },
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }), status


# ===============================================================
# 10. SECURITY HEADERS
# ===============================================================

@app.after_request
def apply_security_headers(response):

    response.headers["X-Content-Type-Options"] = "nosniff"

    response.headers["X-Frame-Options"] = "DENY"

    response.headers["Referrer-Policy"] = (
        "strict-origin-when-cross-origin"
    )

    response.headers["Cache-Control"] = (
        "public, max-age=60"
    )

    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )

    return response


# ===============================================================
# 11. ROOT ENDPOINT
# ===============================================================

@app.route("/", methods=["GET"])
def home():

    return success_response({
        "application": APP_NAME,
        "version": APP_VERSION,
        "developer": "Shaurya Mittal",

        "documentation": "/api/docs",

        "endpoints": [
            "/api/profile",
            "/api/projects",
            "/api/social",
            "/api/interests",
            "/api/health",
            "/api/search?q=web",
        ],

    }, "Welcome to the developer profile API.")


# ===============================================================
# 12. PROFILE ENDPOINT
# ===============================================================

@app.route("/api/profile", methods=["GET"])
def profile():

    return success_response(
        get_profile(),
        "Developer profile retrieved.",
    )


# ===============================================================
# 13. PROJECT DIRECTORY ENDPOINT
# ===============================================================

@app.route("/api/projects", methods=["GET"])
def projects():

    all_projects = get_projects()

    category = request.args.get(
        "category",
        default=None,
        type=str,
    )

    if category:
        category = category.strip().lower()

        all_projects = [
            project
            for project in all_projects
            if isinstance(project, dict)
            and str(
                project.get("category", "")
            ).lower() == category
        ]

    return success_response({
        "count": len(all_projects),
        "projects": all_projects,
    }, "Project directory retrieved.")


# ===============================================================
# 14. SINGLE PROJECT ENDPOINT
# ===============================================================

@app.route("/api/projects/<project_id>", methods=["GET"])
def single_project(project_id):

    if not re.fullmatch(
        r"[a-zA-Z0-9_-]{1,80}",
        project_id,
    ):
        return error_response(
            "Invalid project identifier.",
            400,
        )

    for project in get_projects():

        if not isinstance(project, dict):
            continue

        if project.get("id") == project_id:

            return success_response(
                project,
                "Project retrieved.",
            )

    return error_response(
        "Project not found.",
        404,
    )


# ===============================================================
# 15. SOCIAL LINKS ENDPOINT
# ===============================================================

@app.route("/api/social", methods=["GET"])
def social():

    return success_response(
        get_social_links(),
        "Social links retrieved.",
    )


# ===============================================================
# 16. INTERESTS ENDPOINT
# ===============================================================

@app.route("/api/interests", methods=["GET"])
def interests():

    return success_response(
        get_interests(),
        "Developer interests retrieved.",
    )


# ===============================================================
# 17. SEARCH ENDPOINT
# ===============================================================

@app.route("/api/search", methods=["GET"])
def search():

    query = request.args.get(
        "q",
        default="",
        type=str,
    ).strip()

    if not query:
        return error_response(
            "Search query parameter 'q' is required.",
            400,
        )

    if len(query) > 100:
        return error_response(
            "Search query is too long.",
            400,
        )

    search_term = query.casefold()

    searchable_projects = get_projects()

    matches = []

    for project in searchable_projects:

        if not isinstance(project, dict):
            continue

        searchable_text = " ".join(
            str(value)
            for value in project.values()
        ).casefold()

        if search_term in searchable_text:
            matches.append(project)

    return success_response({
        "query": query,
        "count": len(matches),
        "results": matches,
    }, "Search completed.")


# ===============================================================
# 18. HEALTH CHECK ENDPOINT
# ===============================================================

@app.route("/api/health", methods=["GET"])
def health():

    return success_response({
        "status": "operational",
        "application": APP_NAME,
        "version": APP_VERSION,
        "python": "3",
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }, "Application health check completed.")


# ===============================================================
# 19. API DOCUMENTATION
# ===============================================================

@app.route("/api/docs", methods=["GET"])
def documentation():

    endpoints = [
        {
            "method": "GET",
            "path": "/",
            "description": "API introduction.",
        },
        {
            "method": "GET",
            "path": "/api/profile",
            "description": "Retrieve developer profile.",
        },
        {
            "method": "GET",
            "path": "/api/projects",
            "description": "Retrieve all projects.",
        },
        {
            "method": "GET",
            "path": "/api/projects/<project_id>",
            "description": "Retrieve one project.",
        },
        {
            "method": "GET",
            "path": "/api/social",
            "description": "Retrieve social links.",
        },
        {
            "method": "GET",
            "path": "/api/interests",
            "description": "Retrieve developer interests.",
        },
        {
            "method": "GET",
            "path": "/api/search?q=web",
            "description": "Search the project directory.",
        },
        {
            "method": "GET",
            "path": "/api/health",
            "description": "Check application status.",
        },
    ]

    return success_response({
        "title": APP_NAME,
        "version": APP_VERSION,
        "base_url": request.host_url,
        "endpoints": endpoints,
    }, "API documentation retrieved.")


# ===============================================================
# 20. ERROR HANDLERS
# ===============================================================

@app.errorhandler(400)
def bad_request(error):

    return error_response(
        "The request could not be understood.",
        400,
    )


@app.errorhandler(404)
def not_found(error):

    return error_response(
        "The requested resource does not exist.",
        404,
    )


@app.errorhandler(405)
def method_not_allowed(error):

    return error_response(
        "This HTTP method is not supported.",
        405,
    )


@app.errorhandler(413)
def request_too_large(error):

    return error_response(
        "Request payload exceeds the permitted size.",
        413,
    )


@app.errorhandler(500)
def internal_server_error(error):

    logger.exception(
        "Unexpected application error."
    )

    return error_response(
        "An internal server error occurred.",
        500,
    )


# ===============================================================
# 21. APPLICATION ENTRY POINT
# ===============================================================

if __name__ == "__main__":

    logger.info(
        "Starting %s v%s",
        APP_NAME,
        APP_VERSION,
    )

    app.run(
        host="127.0.0.1",
        port=PORT,
        debug=DEBUG,
    )
