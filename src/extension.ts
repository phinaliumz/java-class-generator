'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "java-class-generator" is now active!');


    let disposableSkeletonJavaInterfaceCommand = vscode.commands.registerCommand('extension.generateSkeletonJavaInterface', () => {
        addPublicJavaKeyWordToDocument("interface");
    });

    let disposableSkeletonJavaClassCommand = vscode.commands.registerCommand('extension.generateSkeletonJavaClass', () => {
        addPublicJavaKeyWordToDocument("class");
    });

    context.subscriptions.push(disposableSkeletonJavaClassCommand);
    context.subscriptions.push(disposableSkeletonJavaInterfaceCommand);
}

function addPublicJavaKeyWordToDocument(javaKeyWord: string) {
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
        let javaPackageName = extractPackageNameFromFileName(fileName);

        if(editor.document.isUntitled) {
            fileName = `Java${javaKeyWord}`;
            javaPackageName = "";
        } else {
            if(!fileName.endsWith('.java')) {
                vscode.window.showInformationMessage('Use this generator on Java files');
                return;
            }

            let lastIndexOfDirectorySlash = fileName.lastIndexOf(path.sep);

            lastIndexOfDirectorySlash++;

            let lastIndexOfFileExtensionPeriod = fileName.lastIndexOf(".java");
            fileName = fileName.slice(lastIndexOfDirectorySlash, lastIndexOfFileExtensionPeriod);
        }
        
        if(javaPackageName.length > 0) {
            let javaPackageText: string = `package ${ javaPackageName }; \n\n`;
            editBuilder.insert(new vscode.Position(0,0), javaPackageText);
        }

        let javaClassText: string = 
            `public ${ javaKeyWord } ${ fileName } {\n\n}`;
        editBuilder.insert(new vscode.Position(0,0), javaClassText);
        return true;
    });
}

function extractPackageNameFromFileName(fileName: string) :string {
    let splitFilenameBySeparator :string[] = fileName.split(path.sep);
    let packageName = "";

    if(splitFilenameBySeparator.length < 0) {
        return packageName;
    }

    let srcFolderCandidate = splitFilenameBySeparator[0];
    let elementCounter = 1;

    while(srcFolderCandidate !== "src" && elementCounter <= splitFilenameBySeparator.length) {
        srcFolderCandidate = splitFilenameBySeparator[elementCounter];
        elementCounter++;
    }

    if(srcFolderCandidate !== "src") {
        return packageName;
    }

    let srcElementIndex = splitFilenameBySeparator.indexOf(srcFolderCandidate);
    let mainFolderCandidate = splitFilenameBySeparator[srcElementIndex];
    elementCounter = srcElementIndex + 1;

    while(mainFolderCandidate !== "main" && elementCounter <= splitFilenameBySeparator.length) {
        mainFolderCandidate = splitFilenameBySeparator[elementCounter];
        elementCounter++
    }

    if(mainFolderCandidate !== "main") {
        return packageName;
    }

    let mainElementIndex = splitFilenameBySeparator.indexOf(mainFolderCandidate);
    let javaFolderCandidate = splitFilenameBySeparator[mainElementIndex];
    elementCounter = mainElementIndex + 1;

    while(javaFolderCandidate !== "java" && elementCounter <= splitFilenameBySeparator.length) {
        javaFolderCandidate = splitFilenameBySeparator[elementCounter];
        elementCounter++;
    }

    if(javaFolderCandidate !== "java") {
        return packageName;
    }

    let javaIndex = elementCounter;

    for(let i = javaIndex; i <= splitFilenameBySeparator.length - 2; i++) {
        packageName += splitFilenameBySeparator[i];
        if(i < splitFilenameBySeparator.length -2) {
            packageName += '.';
        }
    }

    return packageName;
}

export function deactivate() {
}