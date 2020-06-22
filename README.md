<div align="center">
	<img width="500" height="200" src="./logo.svg" alt="Project Timer Manager logo">
	<br>
	<br>
</div>

# Project Timer Manager - API

Project Timer Manager is a `` web application to log passed time by project`` that allow users `to manage its projects, teams and logged times`.

This part concerns the Backend of the web application. In other words, the API.

Manage your projects easily with Project Timer Manager(PTM) by creating an account then teams and projects and logging all your tasks to top it all off.

## Prerequisites

Before you begin, ensure you have met the following requirements:
<!--- These are just example requirements. Add, duplicate or remove as required --->
* If you have a `Windows`, `Linux` or a `Mac` machine, that's fine, you're good to go.


## Installing Project Timer Manager

Rename the `.env.example` file in the root folder and put the correct values in the respective variables.

### Here are values to put in `.env.example`
```sh
PORT=8080
# To use on localhost
MONGO_LOCAL_URI=mongodb://localhost:27017/ipssi_timer
# To use when you use MongoDB Atlas cloud Database services
# To use on localhost with Docker

# Cloudinary env vars
CLOUDINARY_CLOUD_NAME=almorisson
CLOUDINARY_API_KEY=279468386239394
CLOUDINARY_API_SECRET=zKAmTy6RYYOqk28qnrc5StBLSyM

```
## Using Project Timer Manager

To use **Project Timer Manager** , follow these steps:


To install Project Timer Manager, follow these steps:

```sh

docker-compose up --build

```
Now the API is ready to communicate with the front.

You can play with the API without the front if you wish by going on: `http://localhost:8080/graphql`.

**Note**: You must know how to make [GraphQL](https://graphql.org/) queries and mutations


## Contributing to Project Timer Manager
<!--- If your README is long or you have some specific process or steps you want contributors to follow, consider creating a separate CONTRIBUTING.md file--->
To contribute to Project Timer Manager, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin Project Timer Manager/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contributors

Here are the people who actively contributed to this project:

* [@almorisson](https://github.com/almorisson) 📖

You might want to consider using something like the [All Contributors](https://github.com/all-contributors/all-contributors) specification and its [emoji key](https://allcontributors.org/docs/en/emoji-key) if you want to contribute to the project.

## Contact

If you want to contact me you can reach me at <mo.ndiaye@ecole-ipssi.net>.

## License
<!--- If you're not sure which open license to use see https://choosealicense.com/--->

This project uses the following license: [The MIT License (MIT)](./LICENSE.md).
