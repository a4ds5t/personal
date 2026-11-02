const LOCALES = ["en", "nl", "es", "zh"] as const;
type Locale = (typeof LOCALES)[number];

/** Old regional path / cookie / ?lang= values → short language codes. */
const LEGACY_ALIASES: Record<string, Locale> = {
  "nl-NL": "nl",
  "es-419": "es",
  "zh-Hans": "zh",
};

const COOKIE = "locale";
const FALLBACK: Locale = "en";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Locale resolution (documented for maintainers):
 * 1. `?lang=` query (manual switch) → that locale + Set-Cookie
 *    (accepts short codes and legacy regional aliases)
 * 2. else `locale` cookie if it is a supported or legacy value
 * 3. else first matching Accept-Language tag:
 *    zh* → zh, es* → es, nl* → nl, en* → en
 * 4. else FALLBACK (`en`) — live page is English; unmatched browsers get English
 *
 * Cookie is written only on manual switch (`?lang=`), not on Accept-Language detect.
 * Legacy paths `/nl-NL/`, `/es-419/`, `/zh-Hans/` permanently redirect to `/nl/`, `/es/`, `/zh/`.
 */

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function normalizeLocale(value: string): Locale | null {
  if (isLocale(value)) return value;
  return LEGACY_ALIASES[value] ?? null;
}

function localeFromCookie(header: string | null): Locale | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE) {
      const value = decodeURIComponent(rest.join("=").trim());
      return normalizeLocale(value);
    }
  }
  return null;
}

function mapTag(tag: string): Locale | null {
  const primary = tag.trim().toLowerCase().split(",")[0]?.split(";")[0]?.trim();
  if (!primary) return null;
  if (primary === "zh-hans" || primary.startsWith("zh")) return "zh";
  if (primary === "es-419" || primary.startsWith("es")) return "es";
  if (primary === "nl-nl" || primary.startsWith("nl")) return "nl";
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
  if (forced) {
    const locale = normalizeLocale(forced);
    if (locale) return { locale, persist: true };
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

/** `/nl-NL` / `/es-419` / `/zh-Hans` (+ optional suffix) → short language path. */
function legacyPathTarget(pathname: string): string | null {
  const match = pathname.match(/^\/(nl-NL|es-419|zh-Hans)(\/.*)?$/);
  if (!match) return null;
  const locale = LEGACY_ALIASES[match[1]];
  if (!locale) return null;
  const rest = match[2];
  if (rest === undefined) return `/${locale}/`;
  return `/${locale}${rest}`;
}

function redirectLegacyPath(pathname: string): Response | null {
  const target = legacyPathTarget(pathname);
  if (!target) return null;
  return new Response(null, {
    status: 301,
    headers: {
      Location: target,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/" || pathname === "") {
      return redirectToLocale(request);
    }
    const legacy = redirectLegacyPath(pathname);
    if (legacy) return legacy;
    return env.ASSETS.fetch(request);
  },
};

interface Env {
  ASSETS: Fetcher;
}
