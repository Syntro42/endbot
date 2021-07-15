import { Command, RestType, UnquotedStringType } from "@samipourquoi/commander";
import { MessageEmbed } from "discord.js";
import { command, discord, DiscordContext } from "../dispatcher";
import { Colors } from "../../utils/theme";

@command(discord)
class ListCommand
  extends Command {

  constructor() {
    super();

    this.register
      .with.literal("list").run(roles)
      .__.with.arg("<role>", new RestType(new UnquotedStringType())).run(roles);
  }
}

async function roles(ctx: DiscordContext) {
  const chosenRole = (ctx.args[1]) ? ctx.arg.join(" ").toLowerCase() : false;
  let validRole = false;
  const members = await ctx.message.guild!.members.fetch();
  let allRoles: string[] = [];

  ctx.message.guild!.roles.cache.forEach(async (role) => {
    if (role.name != "@everyone") {
      if (!chosenRole) {
        allRoles.push(role.name);
        validRole = true;
      } 
      else if (role.name.toLowerCase() === chosenRole) {
        validRole = true;
        let membersWithRole: string[] = [];

        members.forEach(member => {
          if (member.roles.cache.find(role => role.name.toLowerCase() === chosenRole)) membersWithRole.push(member.user.toString());
        });

        const embed = new MessageEmbed()
          .setColor(Colors.RESULT)
          .setTitle(`There are ${membersWithRole.length} people with ${chosenRole}`)
          .setDescription(membersWithRole)

        await ctx.message.channel.send(embed);
      }
    }
  });

  if (allRoles.length) {
    const embed = new MessageEmbed()
      .setColor(Colors.RESULT)
      .setTitle(`There are ${allRoles.length} roles on this server`)
      .setDescription(allRoles)
    await ctx.message.channel.send(embed);
  }

  if (!validRole) ctx.message.channel.send("That role doesn't exist");
}
