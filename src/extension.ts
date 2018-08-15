'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "java-class-generator" is now active!');

    let disposable = vscode.commands.registerCommand('extension.generateSkeletonJavaClass', () => {
        let editor = vscode.window.activeTextEditor;
        if(!editor) {
            return;
        }

        editor.edit(function(editBuilder: vscode.TextEditorEdit){

            if(!editor) {
                return;
            }

            if(editor.document.lineCount > 1) {
                vscode.window.showInformationMessage('Use this generator on empty files');
                return;
            }

            let fileName = editor.document.fileName;

            if(editor.document.isUntitled) {
                fileName = "JavaClass";
            } else {
                if(!fileName.endsWith('.java')) {
                    vscode.window.showInformationMessage('Use this generator on Java files');
                    return;
                }
                let lastIndexOfDirectorySlash = fileName.lastIndexOf("/");

                if(lastIndexOfDirectorySlash === -1) {
                    lastIndexOfDirectorySlash = fileName.lastIndexOf("\\");
                }

                lastIndexOfDirectorySlash++;

                let lastIndexOfFileExtensionPeriod = fileName.lastIndexOf(".java");

                vscode.window.showInformationMessage(`directory slash index -> ${lastIndexOfDirectorySlash}`);
                vscode.window.showInformationMessage(`period index -> ${lastIndexOfFileExtensionPeriod}`);

                fileName = fileName.slice(lastIndexOfDirectorySlash, lastIndexOfFileExtensionPeriod);
            }
            
            

            let javaClassText: string = 
                `public class ${ fileName } {\n\n}`;
            editBuilder.insert(new vscode.Position(0,0), javaClassText);
            return true;
        })
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}