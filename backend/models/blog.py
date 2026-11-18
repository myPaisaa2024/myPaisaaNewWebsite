"""Latest posts from the myPaisaa blog — powers the savings-guide teaser section."""

from pydantic import BaseModel


class BlogPost(BaseModel):
    title: str
    link: str
    excerpt: str = ""
    image: str | None = None
    published: str | None = None  # formatted date label, e.g. "12 Oct 2026"
