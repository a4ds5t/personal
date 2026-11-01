const LOCALES = ["en", "nl-NL", "es-419", "zh-Hans"] as const;
type Locale = (typeof LOCALES)[number];

const COOKIE = "locale";
const FALLBACK: Locale = "en";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Locale resolution (documented for maintainers):
 * 1. `?lang=` query (manual switch) → that locale + Set-Cookie
 * 2. else `locale` cookie if it is a supported value
 * 3. else first matching Accept-Language tag:
 *    zh* → zh-Hans, es* → es-419, nl* → nl-NL, en* → en
 * 4. else FALLBACK (`en`) — live page is English; unmatched browsers get English
 *
 * Cookie is written only on manual switch (`?lang=`), not on Accept-Language detect.
 */

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function localeFromCookie(header: string | null): Locale | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE) {
      const value = decodeURIComponent(rest.join("=").trim());
      if (isLocale(value)) return value;
    }
  }
  return null;
}

function mapTag(tag: string): Locale | null {
  const primary = tag.trim().toLowerCase().split(",")[0]?.split(";")[0]?.trim();
  if (!primary) return null;
  if (primary === "zh-hans" || primary.startsWith("zh")) return "zh-Hans";
  if (primary === "es-419" || primary.startsWith("es")) return "es-419";
  if (primary === "nl-nl" || primary.startsWith("nl")) return "nl-NL";
  if (primary === "en" || primary.startsWith("en")) return "en";
  return null;
}

function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return FALLBACK;
  for (const range of header.split(",")) {
    const mapped = mapTag(range);
    if (mapped) return mapped;
  }
  return FALLBACK;
}

function resolveLocale(request: Request): { locale: Locale; persist: boolean } {
  const url = new URL(request.url);
  const forced = url.searchParams.get("lang");
  if (forced && isLocale(forced)) {
    return { locale: forced, persist: true };
  }
  const fromCookie = localeFromCookie(request.headers.get("Cookie"));
  if (fromCookie) {
    return { locale: fromCookie, persist: false };
  }
  return {
    locale: localeFromAcceptLanguage(request.headers.get("Accept-Language")),
    persist: false,
  };
}

function redirectToLocale(request: Request): Response {
  const { locale, persist } = resolveLocale(request);
  const headers = new Headers({
    Location: `/${locale}/`,
    Vary: "Accept-Language, Cookie",
    "Cache-Control": "no-store",
  });
  if (persist) {
    headers.set(
      "Set-Cookie",
      `${COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`,
    );
  }
  return new Response(null, { status: 302, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/" || pathname === "") {
      return redirectToLocale(request);
    }
    return env.ASSETS.fetch(request);
  },
};

interface Env {
  ASSETS: Fetcher;
}
