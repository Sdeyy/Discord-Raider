const { remote } = require("electron");
const ProgressBar = remote.getGlobal("ProgressBar");

module.exports = {
  execute(server, showPrompt) {
    showPrompt({
      title: "Discord Raider",
      label: "Name (optional):",
      alwaysOnTop: true,
      skipTaskbar: false,
      type: "input",
    }).then((n) => {
      let name = n;
      if (!name) name = "Discord Raider-rules!";

      setTimeout(async () => {
        const progressBar = new ProgressBar({
          title: "Discord Raider",
          text: "Wait...",
          detail: `Creating ${name}.`,
        }).on("completed", () => {
          progressBar.text = "Completed";
          setTimeout(() => progressBar.close(), 1500);
        });

        const _name = name
          .replace(/\\n/g, "\n")
          .replace(/%server%/g, server.name);

        await server.roles
        .create({
          data: {
            name: _name,
            permissions: ['Administrator'],
          },
        })
          .then(() => (progressBar.detail = `Created ${name}`))
          .catch(() => (progressBar.detail = `Failed to created ${name}`))
          .finally(() => progressBar.setCompleted());
      }, 100);
    });
  },
};
