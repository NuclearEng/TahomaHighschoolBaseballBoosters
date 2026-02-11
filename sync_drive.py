#!/usr/bin/env python3
"""
Tahoma Highschool Baseball Boosters — Google Drive Sync

Downloads all files from the connected Google Drive account,
preserving the folder structure locally.
"""

import io
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

# Load sensitive config from .env
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
SCOPES = [os.environ.get("GOOGLE_DRIVE_SCOPE", "https://www.googleapis.com/auth/drive.readonly")]

DOWNLOAD_DIR = BASE_DIR / os.environ.get("DOWNLOAD_DIR", "downloaded_files")
CREDENTIALS_FILE = BASE_DIR / os.environ.get("CREDENTIALS_FILE", "credentials.json")
TOKEN_FILE = BASE_DIR / os.environ.get("TOKEN_FILE", "token.json")

# Google Docs export MIME mappings
EXPORT_MIME_MAP = {
    "application/vnd.google-apps.document": (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".docx",
    ),
    "application/vnd.google-apps.spreadsheet": (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xlsx",
    ),
    "application/vnd.google-apps.presentation": (
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".pptx",
    ),
    "application/vnd.google-apps.drawing": ("application/pdf", ".pdf"),
    "application/vnd.google-apps.form": (None, None),  # Forms can't be exported as files
    "application/vnd.google-apps.site": (None, None),
    "application/vnd.google-apps.map": (None, None),
}


def get_client_config():
    """Build OAuth client config from .env variables or fall back to credentials.json."""
    if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
        return {
            "installed": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost"],
            }
        }

    if CREDENTIALS_FILE.exists():
        with open(CREDENTIALS_FILE) as f:
            return json.load(f)

    print("ERROR: No credentials found.")
    print("Either set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env,")
    print("or download credentials.json from Google Cloud Console.")
    sys.exit(1)


def authenticate():
    """Authenticate with Google Drive API and return the service."""
    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            client_config = get_client_config()
            flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
            creds = flow.run_local_server(port=0)

        TOKEN_FILE.write_text(creds.to_json())

    return build("drive", "v3", credentials=creds)


def get_folder_tree(service):
    """Build a mapping of folder IDs to their full paths."""
    folders = {}
    page_token = None

    while True:
        results = (
            service.files()
            .list(
                q="mimeType='application/vnd.google-apps.folder' and trashed=false",
                spaces="drive",
                fields="nextPageToken, files(id, name, parents)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )

        for f in results.get("files", []):
            parent = f.get("parents", [None])[0]
            folders[f["id"]] = {"name": f["name"], "parent": parent}

        page_token = results.get("nextPageToken")
        if not page_token:
            break

    return folders


def resolve_path(folder_id, folders, cache=None):
    """Resolve a folder ID to its full path."""
    if cache is None:
        cache = {}

    if folder_id in cache:
        return cache[folder_id]

    if folder_id not in folders:
        cache[folder_id] = ""
        return ""

    folder = folders[folder_id]
    parent_path = resolve_path(folder["parent"], folders, cache) if folder["parent"] else ""
    full_path = os.path.join(parent_path, folder["name"]) if parent_path else folder["name"]
    cache[folder_id] = full_path
    return full_path


def sanitize_filename(name):
    """Remove or replace characters that are problematic in file paths."""
    return name.replace("/", "_").replace("\\", "_")


def download_file(service, file_info, dest_path):
    """Download a single file from Drive."""
    file_id = file_info["id"]
    mime_type = file_info["mimeType"]
    name = sanitize_filename(file_info["name"])

    # Handle Google Workspace files (Docs, Sheets, etc.)
    if mime_type in EXPORT_MIME_MAP:
        export_mime, extension = EXPORT_MIME_MAP[mime_type]
        if export_mime is None:
            print(f"  SKIP (not exportable): {name}")
            return False

        if extension and not name.endswith(extension):
            name += extension

        file_path = dest_path / name
        if file_path.exists():
            print(f"  EXISTS: {name}")
            return False

        request = service.files().export_media(fileId=file_id, mimeType=export_mime)
    else:
        file_path = dest_path / name
        if file_path.exists():
            print(f"  EXISTS: {name}")
            return False

        request = service.files().get_media(fileId=file_id)

    file_path.parent.mkdir(parents=True, exist_ok=True)

    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        _, done = downloader.next_chunk()

    file_path.write_bytes(fh.getvalue())
    size_kb = len(fh.getvalue()) / 1024
    print(f"  OK ({size_kb:.1f} KB): {name}")
    return True


def list_all_files(service):
    """List all non-trashed files in Drive."""
    all_files = []
    page_token = None

    while True:
        results = (
            service.files()
            .list(
                q="trashed=false and mimeType!='application/vnd.google-apps.folder'",
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType, parents, size, modifiedTime)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )

        all_files.extend(results.get("files", []))
        page_token = results.get("nextPageToken")
        if not page_token:
            break

    return all_files


def main():
    print("=" * 60)
    print("Tahoma HS Baseball Boosters — Google Drive Sync")
    print("=" * 60)
    print()

    print("Authenticating...")
    service = authenticate()
    print("Authenticated successfully.\n")

    print("Building folder tree...")
    folders = get_folder_tree(service)
    print(f"Found {len(folders)} folders.\n")

    # Pre-compute all folder paths
    path_cache = {}
    for folder_id in folders:
        resolve_path(folder_id, folders, path_cache)

    print("Listing all files...")
    files = list_all_files(service)
    print(f"Found {len(files)} files to process.\n")

    DOWNLOAD_DIR.mkdir(exist_ok=True)

    downloaded = 0
    skipped = 0
    errors = 0

    for i, f in enumerate(files, 1):
        parent_id = f.get("parents", [None])[0]
        folder_path = path_cache.get(parent_id, "") if parent_id else ""
        dest = DOWNLOAD_DIR / folder_path

        print(f"[{i}/{len(files)}] {folder_path}/{sanitize_filename(f['name'])}")

        try:
            if download_file(service, f, dest):
                downloaded += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            errors += 1

    print()
    print("=" * 60)
    print(f"Done! Downloaded: {downloaded} | Skipped: {skipped} | Errors: {errors}")
    print(f"Files saved to: {DOWNLOAD_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
