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

      if (!member) {
        remote.dialog.showMessageBox(null, {
          type: "error",
          title: "Discord Raider",
          message: "An error occurred while trying to fetch the user.",
        });
        return;
      }

      setTimeout(async () => {
        const progressBar = new ProgressBar({
          title: "Discord Raider",
          text: "Wait...",
          detail: `Unnicknaming ${member.user.tag}.`,
        }).on("completed", () => {
          progressBar.text = "Completed";
          setTimeout(() => progressBar.close(), 1500);
        });

        await member
          .setNickname("")
          .then(
            () => (progressBar.detail = `Unnicknamed ${member.user.username}`)
          )
          .catch(
            () =>
              (progressBar.detail = `Failed to unnickname ${member.user.username}`)
          )
          .finally(() => progressBar.setCompleted());
      }, 100);
    });
  },
};
