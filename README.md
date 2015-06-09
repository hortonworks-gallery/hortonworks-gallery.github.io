# Hortonworks Community Gallery

## Dependencies

* Install Ruby
* Install Sass (`sudo gem install sass`)
* Install NPM
* Install Grunt (`npm install -g grunt-cli`)

## Building

    cd { project_home }
    npm install
    npm install grunt-contrib-sass --save-dev
    grunt build

### Adding Projects to the list
Edit the `src/projects/projects.json` file.  Example contribution:

    {
        "categories": [
            {
                "name": "ambari views"
            },
            {
                "name": "featured"
            }
        ],
        "linkToGithub": "https://github.com/jpplayer/amstore-view",
        "projectDescription": "Allows users to easily browse, search, and install Ambari Views from the Hortonworks Community Gallery from withing Ambari.  Requires minimal effort to install.",
        "projectTitle": "Ambari Store View"
    }

* Categories drive which contributions will show up when clicked from the main nav
* The rest are self-explanatory
