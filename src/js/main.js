$(document).ready(async () => {
  const { remote } = require("electron");
  const moment = require("moment");
  const settings = require("electron-settings");
  const prompt = require("electron-prompt");
  const Discord = require("discord.js");
  const client = new Discord.Client({
    ws: {
      intents: Discord.Intents.ALL,
    },
  });
  const globby = require("globby");

  /* Global Error Handling */
  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
  });

  /* Settings */
  resetSettings = async () => {
    const reset = ["token", "server"];
    reset.forEach((s) => settings.unsetSync(s));
    if (client.user !== null) client.destroy();
    window.location.href = "index.html";
  };

  /* Header */
  $(".headertitle").on("click", async (e) => {
    if (e.detail === 5) resetSettings();
  });

  $(".minimizebtn").on("click", () =>
    remote.BrowserWindow.getFocusedWindow().minimize()
  );

  $(".closebtn").on("click", () =>
    remote.BrowserWindow.getFocusedWindow().close()
  );

  const path = window.location.pathname.split("/").pop();
  if (path === "index.html") {
    /* Login */
    const token = await settings.get("token");
    if (token) $(".tokeninpt").val(token);

    $(".loginbtn").on("click", () => {
      $(".loginbtn").attr("disabled", true);
      $(".createbotbtn").attr("disabled", true);

      $(".loginbtn").html(`
			<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
		`);

      client
        .login($(".tokeninpt").val())
        .then(() => {
          $(".tokendiv").addClass("hidden");
          $(".botdiv .boticon").attr("src", client.user.displayAvatarURL());
          $(".botdiv .bottitle").html(client.user.tag);
          $(".botdiv .botcreateddate").html(
            moment(client.user.createdAt).format("MMMM Do, YYYY [at] h:mm A")
          );
          $(".sidebar .active").html("Continue");
          $(".botinfo").removeClass("hidden");
        })
        .catch(() => {
          $(".loginbtn").attr("disabled", false);
          $(".createbotbtn").attr("disabled", false);
          $(".loginbtn").html(`
					<i class="fas fa-sign-in-alt mr-1"></i>
					Login
				`);

          $(".tokeninvalidtxt").removeClass("hidden");
        });
    });

    $(".createbotbtn").on("click", () => {
      require("electron").shell.openExternal("https://www.writebots.com/discord-bot-token/");
    });

    $(".joindiscordbtn").on("click", () => {
      require("electron").shell.openExternal("https://discord.ktana.wtf/");
    });

    $(".githubbtn").on("click", () => {
      require("electron").shell.openExternal("https://github.com/sdeyy/discord-raider");
    });

    /* Bot Info */
    $(".continuebotbtn").on("click", async function () {
      $(".botinfo").addClass("hidden");
      client.guilds.cache.forEach((guild) => {
        $(".serverslist").html(`
				${$(".serverslist").html()}
				<option value="${guild.id}">${guild.name}</option>
      `);
      });
      $(".sidebar .active").html("Select server");
      $(".serverdiv").removeClass("hidden");
      await settings.set("token", $(".tokeninpt").val());
    });

    $(".cancelbotbtn").on("click", function () {
      client.destroy();
      remote.BrowserWindow.getFocusedWindow().reload();
    });

    /* Select Server */
    $(".continueserverbtn").on("click", async () => {
      await settings.set("server", $(".serverslist").val());
      if (client.user !== null) client.destroy();
      window.location.href = "raid.html";
    });

    $(".serverslist").on("change", function () {
      const firstclass = $(this).find(":selected").attr("class");
      !firstclass || (firstclass && firstclass.split(" ")[0] !== "selectserver")
        ? $(".continueserverbtn").attr("disabled", false)
        : $(".continueserverbtn").attr("disabled", true);
    });
  } else if (path === "raid.html") {
    /* Header */
    $(".backtologinbtn").on("click", () => {
      if (client.user !== null) client.destroy();
      window.location.href = "index.html";
    });

    /* Login */
    client.login(settings.getSync("token")).catch(() => {
      remote.dialog.showMessageBox(null, {
        type: "error",
        title: "Discord Raider",
        message: "An error occurred while trying to log into the bot.",
      });

      if (client.user !== null) client.destroy();
      window.location.href = "index.html";
    });

    /* Ready */
    client.on("ready", async () => {
      /* Server */
      let server = client.guilds.cache.get(settings.getSync("server"));

      if (server) {
        /* Header */
        $(".headertitle").html(`Discord Raider - ${server.name}`);

        /* Sidebar */
        $(".sidebar").removeClass("hidden");

        /* Content */
        $(".content").removeClass("hidden");
      } else {
        remote.dialog.showMessageBox(null, {
          type: "error",
          title: "Discord Raider",
          message: "An error occurred while trying to fetch the select server.",
        });
        if (client.user !== null) client.destroy();
        window.location.href = "index.html";
      }

      /* Show Prompt Function */
      const showPrompt = (options, emptyOptions = null) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            prompt(options)
              .then((message) => {
                if (message === null) return; // User cancelled
                if (emptyOptions !== null && message === "")
                  remote.dialog.showMessageBox(null, emptyOptions);
                else resolve(message);
              })
              .catch((error) => reject(Error(error)));
          }, 100);
        });
      };

      /* Command Handler */
      const commandFiles = await globby(
        __dirname.replace(/\\/g, "/") + "/commands/**/*.js"
      );
      client.commands = new Discord.Collection();

      commandFiles.forEach((file) => {
        const directory = file.split("/").reverse()[1];
        const filename = file
          .replace(".js", "")
          .split("\\")
          .pop()
          .split("/")
          .pop();
        const button = $(`.${directory}`).find(`.${filename}`);
        const command = require(file);
        button.on("click", () => command.execute(server, showPrompt));
      });
    });
  } else if (path === "alert.html") {
    /* Animations */
    setTimeout(() => {
      $(".intro").fadeOut("slow", "linear", () =>
        $(".warning").css("display", "flex").hide().fadeIn("slow", "linear")
      );
    }, 3000);

    /* Alert Buttons */
    $(".agreebtn").on("click", () =>
      setTimeout(() => (window.location.href = "index.html"), 75)
    );

    $(".disagreebtn").on("click", () =>
      setTimeout(() => remote.BrowserWindow.getFocusedWindow().close(), 75)
    );
  }
});
