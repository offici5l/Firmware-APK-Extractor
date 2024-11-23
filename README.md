### Firmware-Content-Extractor
___
**to extract files from the firmware without needing to download the full firmware (using GitHub Actions).**
___

- Extract Settings_APK from the firmware.zip

- Extract boot.img from the firmware.zip

```
curl -sX POST https://fce.offici5l.workers.dev -d '{"url": "her url .zip", "get": "her boot_img or settings_apk"}'
```