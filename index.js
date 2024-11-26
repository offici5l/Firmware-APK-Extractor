const track = new Date().toISOString().replace(/[^\w]/g, '') + new Date().getSeconds() + Math.floor(Math.random() * 10000) + Date.now();

export default {
  async fetch(req, env) {
    const requestBody = await req.text();
    const parts = requestBody.split(" ");
    if (parts.length < 2) {
      return new Response("\nMissing parameters!\n\nUsage: \ncurl -d \"<get> <url>\" <worker-url>\n\nExample:\n curl -d \"boot_img https://example.com/file.zip\" fce.offici5l.workers.dev\n\n", { status: 400 });
    }

    const get = parts[0];
    const url = parts[1];
    if (get !== "boot_img" && get !== "settings_apk") {
      return new Response("\nOnly 'boot_img' and 'settings_apk' are allowed.\n", { status: 400 });
    }
    if (!url.endsWith(".zip")) {
      return new Response("\nOnly .zip URLs are supported.\n", { status: 400 });
    }

    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return new Response("\nThe provided URL is not accessible.\n", { status: 400 });
    }

    const fileName = url.split('/').pop();
    const combinedBasename = `${get}_${fileName}`;
    const finalUrl = `https://github.com/offici5l/Firmware-Content-Extractor/releases/download/${get}/${combinedBasename}`;
    const GTKK = env.GTKK;
    const GITHUB_ACTIONS_URL = env.GITHUB_ACTIONS_URL;

    try {
      const finalUrlResponse = await fetch(finalUrl, { method: 'HEAD' });
      if (finalUrlResponse.ok) {
        return new Response(`\nresult: available\nlink: ${finalUrl}\n`, { status: 200 });
      }
    } catch (error) {
      const data = { ref: "main", inputs: { get, url, track } };
      const githubResponse = await fetch(GITHUB_ACTIONS_URL, {
        method: "POST",
        headers: {
          "Authorization": `token ${GTKK}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Cloudflare Worker"
        },
        body: JSON.stringify(data)
      });

      if (githubResponse.ok) {
        return new Response("\nRequest was successfully sent to GitHub.\n", { status: 200 });
      } else {
        const githubResponseText = await githubResponse.text();
        return new Response(`GitHub Response Error: ${githubResponseText}`, { status: 500 });
      }
    }
  }
};