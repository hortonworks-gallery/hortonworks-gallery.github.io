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
        "title": "Hadoop Sandbox ",
        "description": "Hortonworks Sandbox is the easiest way to get started with Enterprise Hadoop: a free single-node cluster in a virtual machine complete with step-by-step tutorials.",
        "cta_1_text": "Get Sandbox",
        "cta_1_url": "http://hortonworks.com/products/hortonworks-sandbox/",
        "cta_2_text": "",
        "cta_2_url": "",
        "repo_account": "",
        "repo_name": "",
        "categories": [{
            "name": "Featured"
        }, {
            "name": "General"
        }]
    }

* Categories drive which contributions will show up when clicked from the main nav
* Categories should be listed in the same order as the navigation bar so that they display in the tile in the same order
* Any category not listed in the navbar can be accessed/filtered by clicking on it in the tile
* if 'cta_a_url' is a link to a github repository (ie. 'https://github.com/...') the script will grab additional repo data and attach it to the object 
* The rest are self-explanatory
