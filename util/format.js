module.exports = {
    footer: {
        text: "© Sap#5703",
        image: "https://i.imgur.com/wbFToRX.png"
    },
    server: {
        text: "Join Us!",
        link: "https://discord.gg/HrAR8z3 \"Join the Spiral Scholars Discord Server!\""
    },
    bot: {
        text: "Invite Zander!",
        link: "https://discord.com/api/oauth2/authorize?client_id=756886650843299892&permissions=8&scope=bot \"Invite Link for Zander!\""
    },
    support: {
        text: "Support Server",
        link: "https://discord.gg/GhUtkny \"Head to our Support Server for help!\""
    },
    emptyChar: " ‎",
    space(amt) {
        let whitespace = "";

        let i;
        for (i = 0; i < amt; i++) {
            whitespace += "\u00A0";
        }

        return whitespace;
    }
}