# Introduction

## Content
This code structure contains both the web and web.api projects of the Capstone Project.


## Prerequisites

1. [.NET SDK](https://dotnet.microsoft.com/en-us/download) 8.0 LTS


2. [Node JS](https://nodejs.org/en/download/package-manager) 20.13.1 LTS


3. [Git CLI](https://git-scm.com/download/)


4. [Visual Studio Code](https://code.visualstudio.com/Download)

   4.1. Optional [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)

   4.2. Optional [Remote Repositories](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-repositories)

   4.3. Optional [Azure Repos extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-repos)

   4.4. Optional [GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub)


5. [Visual Studio](https://visualstudio.microsoft.com/downloads)

   5.1. [Entity Framework](https://learn.microsoft.com/en-us/ef/ef6/fundamentals/install)




## Development Environment

1. capstone.web.api

   1.1. Open `capstone.web.api\capstone.web.api.sln` in Visual Studio

   1.2. Build the solution (ctrl+shift+b)

   1.3. Run the solution in https mode (f5)

   1.4. Access the [Swagger UI](https://localhost:7197/swagger/)


2. capstone.web.db

   2.1. Open `capstone.web.api\capstone.web.api.sln` in Visual Studio

   2.2. Open a developer terminal (ctrl + `)

   2.3. Create database and schema `dotnet ef database update`


3. capstone.web

   3.1. Open `capstone.web` folder in Visual Studio Code

   3.2. Open Terminal

   3.3. Install Angular `npm install --global @angular/cli`

   3.4. Install project dependancies `npm install`

   3.5. Run the application `ng serve`

   3.6. Access the [To Do UI](http://localhost:4200/)




## Getting Started
To run this project, you will need to do the following:

1.	Installation process
    You'll need to do a 'database-update' to create the database locally
    When you run the system, the admin username and password is:

       email : admin@example.com
       pass  : admin-password


2.	Software dependencies


3.	Latest releases


4.	API references


## Build and Test
TODO: Describe and show how to build your code and run the tests. 


## Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
