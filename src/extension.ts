import { randomInt } from 'crypto';
import * as vscode from 'vscode';

const hasTheme = (extension: vscode.Extension<any>) => 
	'contributes' in extension.packageJSON && 'themes' in extension.packageJSON.contributes;

const isDefaultTheme = (extension: vscode.Extension<any>) => 
	'publisher' in extension.packageJSON && extension.packageJSON.publisher === 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('theme-roulette.roulette', () => {
		const configuration = vscode.workspace.getConfiguration();
		const includeDefaults = configuration.get<boolean>('themeroulette.includeDefaults');
		const themes = vscode.extensions.all
			.filter(ext => ext.extensionKind === vscode.ExtensionKind.UI)
			.filter(hasTheme)
			.filter(ext => includeDefaults || !isDefaultTheme(ext))
			.flatMap(ext => ext.packageJSON.contributes.themes)
			.map(t => {
				if (t.id) {
					return t.id;
				}
				return t.label;
			});

		const r = randomInt(themes.length - 1);
		let theme = themes[r];
		configuration.update('workbench.colorTheme', theme, true);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
