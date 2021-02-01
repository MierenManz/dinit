const args: string[] = Deno.args;
const files: string[] = ["mod.ts", "deps.ts", "README.md", "license.md", "src"];
let IDE = "null";
let IDESettings = "";
let useGIT = false;
if (args.includes("--vsc")) {
    IDE = "vsc";
    IDESettings = '{\n    "deno.enable": true,\n    "deno.lint": true,\n    "deno.unstable": false\n}';
    files.push(".vscode", ".vscode/settings.json");
}

if (args.includes("--git")) {
    files.push(".gitignore");
    useGIT = true;
    Deno.run({
        cmd: ["git", "init"],
        stdout: "null",
        stdin: "null",
        stderr: "null"
    });
}

files.forEach(async(element) => {
    try {
        if (element.match(/\.[a-zA-Z]{1,4}$/) || element === ".gitignore") {
            await Deno.create(element);
        } else {
            await Deno.mkdir(element);
        }
    } catch (e) {
        console.warn(e);
    }
});

if (IDE === "vsc") {
    await Deno.writeTextFile("./.vscode/settings.json", IDESettings);
}

if (useGIT) {
    const settings = ".vscode\n.vscode/*\n.idea\n.idea/*";
    await Deno.writeTextFile("./.gitignore", settings);
}