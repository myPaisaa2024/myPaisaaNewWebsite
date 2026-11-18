# Personal Chit Advisor

Personal Chit Advisor: chat-style welcome (route /v6).

This branch contains the full runnable app (backend included). The folder you
are reading holds an isolated copy of the files UNIQUE to this version, with
paths preserved from the repository root. Everything else (routing in
frontend/src/App.tsx, shared libs under frontend/src/lib/, the UI kit,
backend/) is shared across all versions — see VERSIONS.md on any branch.

Run it: `cd frontend && yarn dev` (backend: `cd backend && uvicorn server:app --port 8001`), then open the version's route.
