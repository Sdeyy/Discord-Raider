const { remote } = require("electron");
const ProgressBar = remote.getGlobal("ProgressBar");

module.exports = {
  execute(server, showPrompt) {
    showPrompt({
      title: "Discord Raider",
      label: "Nickname (optional):",
      alwaysOnTop: true,
      skipTaskbar: false,
      type: "input",
    }).then((n) => {
      let nickname = n;
      if (!nickname) nickname = "Discord Raider rules!";

      let nicknameSuccesses = 0;
      let nicknameFails = 0;
      const members = server.members.cache.filter((m) => !m.user.bot);
      setTimeout(async () => {
        const progressBar = new ProgressBar({
          indeterminate: false,
          title: "Discord Raider",
          text: "Wait...",
          detail: "Nicknaming all users.",
          maxValue: members.size,
          closeOnComplete: false,
        })
          .on("completed", () => {
            progressBar.text = "Completed";
            progressBar.detail = `Nicknamed all users, ${nicknameSuccesses} out of ${
              progressBar.getOptions().maxValue
            } users nicknamed (${nicknameSuccesses} successes, ${nicknameFails} fails)`;
            setTimeout(() => progressBar.close(), 1500);
          })
          .on(
            "progress",
            (value) =>
              (progressBar.detail = `Nicknaming all users, ${nicknameSuccesses} out of ${
                progressBar.getOptions().maxValue
              } users nicknamed (${nicknameSuccesses} successes, ${nicknameFails} fails)`)
          );

        for (const member of [...members.values()]) {
          const nick = nickname
            .replace(/\\n/g, "\n")
            .replace(/%username%/g, member.user.username)
            .replace(/%userid%/g, member.user.id)
            .replace(/%usertag%/g, member.user.tag)
            .replace(/%server%/g, server.name);

          await member
            .setNickname(nick)
            .then(() => {
              nicknameSuccesses += 1;
              progressBar.value += 1;
            })
            .catch(() => {
              nicknameFails += 1;
              progressBar.value += 1;
            });
        }
      }, 100);
    });
  },
};
