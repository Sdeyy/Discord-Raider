const { remote } = require("electron");
const ProgressBar = remote.getGlobal("ProgressBar");

module.exports = {
  execute(server, showPrompt) {
    const roles = server.roles.cache;
    const members = server.members.cache.filter((m) => !m.user.bot);
    const existingMuteRole = roles.find((r) => r.name === "Discord Raider--Muted");

    if (existingMuteRole) {
      let unmuteSuccesses = 0;
      let unmuteFails = 0;
      setTimeout(async () => {
        const progressBar = new ProgressBar({
          indeterminate: false,
          title: "Discord Raider",
          text: "Wait...",
          detail: "Unmuting all users.",
          maxValue: members.size,
          closeOnComplete: false,
        })
          .on("completed", () => {
            progressBar.text = "Completed";
            progressBar.detail = `Unmuted all users, ${unmuteSuccesses} out of ${
              progressBar.getOptions().maxValue
            } users unmuted (${unmuteSuccesses} successes, ${unmuteFails} fails)`;
            setTimeout(() => progressBar.close(), 1500);
          })
          .on(
            "progress",
            (value) =>
              (progressBar.detail = `Unmuting all users, ${unmuteSuccesses} out of ${
                progressBar.getOptions().maxValue
              } users unmuted (${unmuteSuccesses} successes, ${unmuteFails} fails)`)
          );

        for (const member of [...members.values()]) {
          await member.roles
            .remove(existingMuteRole)
            .then(() => {
              unmuteSuccesses += 1;
              progressBar.value += 1;
            })
            .catch(() => {
              unmuteFails += 1;
              progressBar.value += 1;
            });
        }
      }, 100);
    } else {
      remote.dialog.showMessageBox(null, {
        type: "error",
        title: "Discord Raider",
        message: "A muted role left by Discord Raider doesn't exist.",
      });
    }
  },
};
