"""myPaisaa blog teaser — latest posts from the blog's RSS feed, cached in memory."""

import html
import logging
import re
import time
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

import httpx
from fastapi import APIRouter

from models.blog import BlogPost

router = APIRouter()

FEED_URL = "https://blog.mypaisaa.com/feed/"
TTL_SECONDS = 1800
MAX_POSTS = 3

logger = logging.getLogger(__name__)

_cache: dict = {"posts": [], "fetched_at": 0.0}


def _clean_html(raw: str) -> str:
    return " ".join(re.sub(r"<[^>]+>", " ", raw).split())


def _excerpt(raw: str) -> str:
    """Tag-strip, decode entities, drop the feed's 'The post … appeared first' tail."""
    text = html.unescape(_clean_html(raw))
    marker = text.find("The post")
    if marker > 0:
        text = text[:marker]
    return text[:160] + ("…" if len(text) > 160 else "")


def _parse_feed(feed_xml: bytes) -> list[BlogPost]:
    root = ET.fromstring(feed_xml)
    posts: list[BlogPost] = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        if not title or not link:
            continue

        published = None
        raw_date = item.findtext("pubDate")
        if raw_date:
            try:
                published = parsedate_to_datetime(raw_date).strftime("%d %b %Y")
            except Exception:
                published = None

        image = None
        media = item.find("{http://search.yahoo.com/mrss/}content")
        if media is not None and media.get("url"):
            image = media.get("url")
        if image is None:
            encoded = item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or ""
            match = re.search(r'<img[^>]+src="([^"]+)"', encoded)
            if match:
                image = match.group(1)

        body = item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or ""
        excerpt = _excerpt(body or (item.findtext("description") or ""))

        posts.append(
            BlogPost(title=title, link=link, excerpt=excerpt, image=image, published=published)
        )
        if len(posts) >= MAX_POSTS:
            break
    return posts


@router.get("/blog/posts", response_model=list[BlogPost])
async def blog_posts():
    now = time.time()
    if _cache["posts"] and now - _cache["fetched_at"] < TTL_SECONDS:
        return _cache["posts"]
    try:
        async with httpx.AsyncClient(
            timeout=10, follow_redirects=True, headers={"User-Agent": "mypaisaa-homepage/1.0"}
        ) as client:
            resp = await client.get(FEED_URL)
            resp.raise_for_status()
        posts = _parse_feed(resp.content)
        if posts:
            _cache["posts"] = posts
            _cache["fetched_at"] = now
        return posts
    except Exception as exc:
        # Never fail the section: serve the last-known posts (or an empty list).
        logger.warning("blog feed fetch failed: %s", exc)
        return _cache["posts"]
