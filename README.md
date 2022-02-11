# Battleships

## About

This application allows two players to locally play the classic game [Battleships](https://en.wikipedia.org/wiki/Battleship_(game)). 

[Node and NPM](https://nodejs.org/en/download/) are used for package management and compilation.

## How to run

The app can be run without compiling the TypeScript files, as the compiled version is provided in the *dist* directory. To skip compilation, go directly to the last paragraph in this section.

To only install what is necessary to compile the app to vanilla JavaScript and use the app, run `npm i typescript` followed by `npx tsc`. 

To install the full development environment (includes e.g. linting and testing), run ``npm i`` followed by ``npm run dev`` instead. This will automatically compile all files whenever a file is changed.

To run the app, open *index.html* in a web-server environment (e.g. "Live Server" extension in Visual Studio Code).

## Additional packages used

* **Jest** & **ts-jest**: testing for TypeScript
* **Prettier**: automatic code formatting
* **ESLint**: code linting

## Testing
Only basic testing has been done on this app. Apart from manually testing the GUI (undocumented), unit tests with focus on code-coverage have been done for the files *player.ts* and *ship.ts*. Only these files were tested as they are part of the Model in MVC, and they do not have complex state and mutations. The tests done do not consider every single use-case. 

If more time was spent on testing, the existing tests would be more thorough to consider more possible use-cases. Additionally, the file *game.ts* would also be tested, as it is the final part of the Model, and is what the Controller interacts with. 

The Controller and View files are not tested.

To execute the tests, run ``npm test``. The generated file */coverage/Icov-report/index.html* can be opened in the browser for a detailed coverage report.

## Design

### General design
The app is structured after (my own interpretation of) the Model-View-Controller (MVC) design pattern. The Model files only depend on each other, the View file only manipulates the GUI, and the Controller file sits between the Model and View and interacts with both. The Controller never directly changes the GUI, it only ever listens to GUI events (e.g. mouse clicks on elements) and asks the View to do any manipulation.

### Why TypeScript over JavaScript?
The main reason for choosing TypeScript is that it is much more strict than regular JavaScript. This strictness for instance makes the developer think harder about things such as the types function arguments needs to have, before the function can be used. (A side-effect of this behaviour is also that code becomes automatically documented, to some extent) 

The final code will have fewer uncaught errors, since most of them will be spotted before even running the program. The code will also be free of unused variables or functionse, and all variables will also have the correct type of const/let/var.


## Short self-assessment
The model files (game, ship, player) are the most structured and simple. The Controller (controller.ts) and View (gui.ts + styles.css and index.html) on the other hand are much messier and harder to follow. 

It is clear that creating a more complex user interface for an otherwise simple TypeScript game while following MVC lead to a final result that is not very pretty (code-wise). A simpler UI would have been sufficient in this case, for example based on the command-line.