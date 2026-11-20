# Downloads setup (.video / .ig / .apk)

- `.video <name|link> [480]` - searches YouTube, sends thumbnail + title + views, then the FULL video (up to 2 GB).
  Default quality 720p; add 360/480/1080 at the end. Files over 100 MB arrive as an .mp4 file (tap to download).
- `.ig <link>` - Instagram reel/post/carousel.
- `.apk <app name | package id>` - real APK file from Aptoide, up to 2000 MB.

yt-dlp is downloaded automatically into `./bin` on first use (needs internet access to github.com).

## If YouTube says "Sign in to confirm you're not a bot" / Instagram says "login required"
Datacenter IPs get blocked. Export cookies from a browser where you are logged in
(extension "Get cookies.txt LOCALLY"), save as Netscape `cookies.txt` and put it in the project root
(or `cookies_youtube.txt` / `cookies_instagram.txt`). Optional env: `YT_COOKIES_FILE`, `IG_COOKIES_FILE`, `YT_DLP_PROXY`.
