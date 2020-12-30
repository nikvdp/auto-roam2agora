const {
  openBrowser,
  goto,
  into,
  click,
  near,
  textBox,
  write,
  button,
  waitFor,
  $,
  client,
  closeBrowser,
} = require("taiko");
const process = require("process");
const path = require("path");
const fs = require("fs");

const database = process.env.ROAM_DATABASE;
const username = process.env.ROAM_USERNAME;
const password = process.env.ROAM_PASSWORD;
const downloadPath = path.resolve(__dirname, "roam_downloads");

if (!database || !username || !password) {
  console.log("Please make sure all env vars are set before running!");
  process.exit(1);
}

(async () => {
  try {
    try {
      fs.mkdirSync(downloadPath);
    } catch (e) {}
    await openBrowser();
    await client().send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });
    await goto(`https://stable.roamresearch.com/#/app/${database}`);
    // roam does a very weird refresh after things have already loaded, so just
    // wait it out
    await waitFor(10000);
    await write(username, into(textBox(near("Email"))));
    await write(password, into(textBox(near("Password"))));
    await click(button("Sign In"));
    // wait up to 60 seconds cause roam can take forever to load
    await waitFor(textBox("Find or Create Page"), 60000);
    await click($(".bp3-icon-more"));
    await click("Export All");
    await click("Markdown");
    await click("JSON");
    await click(button("Export All"));
    console.log(
      "Download should now be initialized, waiting for zip file to be present",
    );
    // wait for the download to take place.
    // TODO: find a better way to do this, perhaps as described here:
    //   https://spectrum.chat/taiko/general/awaiting-for-a-file-to-download~bcb1f29b-08c7-4a9b-b458-690662a56790
    // await waitFor(120 * 1000);
    await waitForZipFile(downloadPath);
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();

async function waitForZipFile(dir, maxTime = 10 * 60 * 1000) {
  let checkInterval = 500;
  let checkZipFilePresent = (dir) => {
    let files = fs.readdirSync(dir);
    let filtered = files
      .filter((f) => f.toLowerCase().endsWith(".zip"));

    return filtered.length > 0;
  };

  return new Promise((resolve, reject) => {
    if (checkZipFilePresent(dir)) {
      resolve(true);
    } else {
      let interval = setInterval(() => {
        console.log("Will wait for %s seconds...", maxTime);
        maxTime -= checkInterval;
        if (maxTime <= checkInterval) {
          clearInterval(interval);
          resolve(false);
        }
        if (checkZipFilePresent(dir)) {
          clearInterval(interval);
          resolve(true);
        }
      }, checkInterval);
    }
  });
}
