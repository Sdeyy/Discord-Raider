const { remote } = require("electron");
const ProgressBar = remote.getGlobal("ProgressBar");

module.exports = {
  execute(server, showPrompt) {
    showPrompt({
      title: "Discord Raider",
      label: "Server name (optional):",
      alwaysOnTop: true,
      skipTaskbar: false,
      type: "input",
    }).then((n) => {
      let name = n;
      if (!name) name = "Discord Raider rules!";

      if (name.length < 2 || name.length > 32) {
        remote.dialog.showMessageBox(null, {
          type: "error",
          title: "Discord Raider",
          message: "The server name must be between 2 and 32 characters long.",
        });
        return;
      }

      setTimeout(async () => {
        const progressBar = new ProgressBar({
          title: "Discord Raider",
          text: "Wait...",
          detail: `Changing server name to '${name}'.`,
        }).on("completed", () => {
          progressBar.text = "Completed";
          setTimeout(() => progressBar.close(), 1500);
        });

        await server
          .setName(name)
          .then(() => (progressBar.detail = `Changed server name to '${name}'`))
          .catch(
            () =>
              (progressBar.detail = `Failed to change server name to '${name}'`)
          )
          .finally(() => progressBar.setCompleted());
      }, 100);
    });
  },
};
