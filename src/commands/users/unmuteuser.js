const { remote } = require("electron");
const ProgressBar = remote.getGlobal("ProgressBar");

module.exports = {
  execute(server, showPrompt) {
    showPrompt(
      {
        title: "Discord Raider",
        label: "Select a user:",
        alwaysOnTop: true,
        skipTaskbar: false,
        type: "select",
        selectOptions: server.members.cache
          .filter((m) => !m.user.bot)
          .reduce(function (result, item) {
            result[item.user.id] = item.user.tag;
            return result;
          }, {}),
      },
      {
        type: "warning",
        title: "Discord Raider",
        message: "You didn't select a user.",
      }
    ).then((userid) => {
      const member = server.members.cache.get(userid);
      const roles = server.roles.cache;
      const existingMuteRole = roles.find((r) => r.name === "Discord Raider--Muted");

      if (!member) {
        remote.dialog.showMessageBox(null, {
          type: "error",
          title: "Discord Raider",
          message: "An error occurred while trying to fetch the user.",
        });
        return;
      }

      if (existingMuteRole) {
        setTimeout(async () => {
          const progressBar = new ProgressBar({
            title: "Discord Raider",
            text: "Wait...",
            detail: `Unmuting ${member.user.tag}.`,
          }).on("completed", () => {
            progressBar.text = "Completed";
            setTimeout(() => progressBar.close(), 1500);
          });

          await member.roles
            .remove(existingMuteRole)
            .then(
              () => (progressBar.detail = `Unmuted ${member.user.username}`)
            )
            .catch(
              () =>
                (progressBar.detail = `Failed to unmute ${member.user.username}`)
            )
            .finally(() => progressBar.setCompleted());
        }, 100);
      } else {
        remote.dialog.showMessageBox(null, {
          type: "error",
          title: "Discord Raider",
          message: "A muted role left by Discord Raider doesn't exist.",
        });
      }
    });
  },
};
