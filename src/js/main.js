var githubToken = '3c0b397bd4e5bdb5c58e5c14126136a1e79b67f8',
    jsonObjects = [],
    filteredObjects = [],
    deferreds = [],
    sortParam, filterParam, endpointUri;

function getURLParameter(name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1];
}

function removeHTMLChars(str) {
    if (str && typeof str === 'string') {
        return str.replace(/(<([^>]+)>)/ig, "");
    } else {
        return null;
    }
}

function initDeafult() {
    // get sorting and filtering parameter from URI
    sortParam = getURLParameter('sort');
    filterParam = getURLParameter('filter');

    // if params not set, assign default values
    if (!sortParam) {
        // sorting is ascending by default
        sortParam = "asc";
    }

    if (!filterParam) {
        // filter for featured projects by default
        filterParam = "featured";
    }
}


function setURLParameter() {
    //set the URL accordingly
    if (getURLParameter('sort') !== sortParam || getURLParameter('filter') !== filterParam) {
        history.pushState(null, null, "index.html?sort=" + sortParam + "&filter=" + filterParam);
    }
}

initDeafult();

function setSwitchState() {
    // get URL parameters and set for display
    if (sortParam === 'asc') {
        $("#sortAsc").addClass("active");
        $("#sortNewest").removeClass("active");
    } else if (sortParam === 'newest') {
        $("#sortNewest").addClass("active");
        $("#sortAsc").removeClass("active");
    }
}

//set the URL accordingly
history.replaceState(null, null, "index.html?sort=" + sortParam + "&filter=" + filterParam);

window.addEventListener('popstate', function() {
    initDeafult();
    setSwitchState();
    filterJSON(filterParam);
    displayObjects();
});

// format updatedAt for outpuf in project card (using locale string)
function formatDate(date) {
    if (date) {
        var formattedDate = new Date(date);
        return formattedDate.toLocaleDateString();
    } else {
        return null;
    }
}

// set the active category in the navbar
function setCategoryActive(cat) {
    $(".nav-category").each(function(i, obj) {
        if (cat.toLowerCase() === $(obj).text().toLowerCase()) {
            $(obj).parent().addClass('active');
        } else {
            $(obj).parent().removeClass('active');
        }
    });
}

// filter JSON by category
function filterJSON(cat) {
    filterParam = cat.toLowerCase();
    // reset search input field
    $('#searchTxt').val('');

    if (cat.toLowerCase() === "all") {
        filteredObjects = jsonObjects;
    } else {
        filteredObjects = [];

        $.each(jsonObjects, function(i, item) {
            // for each category
            var isPartOfCategory = false;

            $.each(item.categories, function(c, category) {
                if (category.name.toLowerCase() === cat.toLowerCase()) {
                    isPartOfCategory = true;
                }
            });

            if (isPartOfCategory) {
                filteredObjects.push(item);
            }
        });
    }

    //set the URL accordingly
    setURLParameter();
    setCategoryActive(filterParam);
}

// search JSON for specific input
function searchJSON(input) {
    var searchStr = input.toLowerCase();

    filteredObjects = [];

    $.each(jsonObjects, function(i, item) {
        var project = item.title.toLowerCase(),
            description = item.description.toLowerCase();

        if ((project.indexOf(searchStr) >= 0) || (description.indexOf(searchStr) >= 0)) {
            filteredObjects.push(item);
        }
    });
}

// sort filtered projects by param
function sortJSON() {
    filteredObjects.sort(function(a, b) {
        var valueA, valueB;

        switch (sortParam) {
            // ascending by project name
            case 'asc':
                valueA = a.title.toLowerCase();
                valueB = b.title.toLowerCase();
                break;
                // newest by creation date (b and a is changed on purpose)
            case 'newest':
                valueA = new Date(b.updatedAt);
                valueB = new Date(a.updatedAt);
                break;
        }

        if (valueA < valueB) {
            return -1;
        } else if (valueA > valueB) {
            return 1;
        } else {
            return 0;
        }
    });

    //set the URL accordingly
    setURLParameter();
}

function displayObjects() {
    // TODO: search & onLoad & URL
    if (filteredObjects.length > 0) {
        sortJSON();
        $(".Container").empty();
        $.each(filteredObjects, function(i, item) {
            var str = '<div class="col-md-4"><div class="mix">';

            // open header div
            str+= '<div class="row header">';

            if(item.categories) {
              str += '<div class="col-sm-12"><span class="categories">';
              // add all categories as labels
              $.each(item.categories, function(c, category) {
                    var catName = removeHTMLChars(category.name),
                        catNameURLSafe = catName.replace(' ', '%20');
                  str += '<a class="filter" href="index.html?sort=asc&filter=' + catNameURLSafe + '">' + 
                        removeHTMLChars(category.name) + '</a>';
                  if(c < item.categories.length-1) {
                    str += ', ';
                  }
              });
              str += '</span></div>';
            }

            if(item.title) {
              str += '<div class="col-sm-12">';
              str += '<span class="title">';
              str += '<a target="_blank" href="' + removeHTMLChars(item.cta_1_url) + '">' + removeHTMLChars(item.title.substring(0, 29));
              // if title is to long, indicate it
              if(item.title.length > 30) {
                str +=  '...';
              }
              str += '</a></span></div>';
            }

            // if(item.stargazers_count) {
            //   str += '<div class="col-md-2 col-xs-2 text-right"><span class="stars"><i class="fa fa-star"></i> ' + item.stargazers_count + '</span></div>';
            // } else {
            //     // generate placeholder
            //     str += '<div class="col-md-2 col-xs-2 text-right"><span class="stars"></span></div>';
            // }

            // if(item.forks_count) {
            //   str += '<div class="col-md-2 col-xs-2 text-right"><span class="forks"><i class="fa fa-code-fork"></i> ' + item.forks_count + '</span></div>';
            // } else {
            //     // generate placeholder
            //     str += '<div class="col-md-2 col-xs-2 text-right"><span class="forks"></span></div>';
            // }

            // close header div
            str += '</div>';



            // if(item.updatedAt) {
            //   str += '<div class="row details"><div class="col-md-6 col-sm-6 hidden-xs"><span class="updatedAt">Last updated on ' + formatDate(removeHTMLChars(item.updatedAt)) + '</span></div>';
            // }

            // if(item.subscribers_count) {
            //     str += '<div class="col-md-6 col-sm-6 hidden-xs text-right"><span class="watchers"><i class="fa fa-eye"></i> ' + item.subscribers_count + ' people watching</span></div>';
            // }

            // // close details div
            // str += '</div>';

            if(item.description) {
              str += '<div class="row description">';
              str += '<div class="col-sm-12">';
              str += '<p class="desc-text">' + removeHTMLChars(item.description.substring(0, 279));
              // if title is to long, indicate it
              if(item.description.length > 280) {
                str +=  '...';
              }
              str += '</p></div></div>';
            }

            if (item.cta_1_url || item.cta_2_url) {
              str += '<div class="row actions">';
            }

            if (item.cta_1_url) {
              str += '<div class="col-sm-6">' +
                '<a target="_blank" class="btn btn-info btn-bottom-left"' +
                ' href="' + removeHTMLChars(item.cta_1_url) + '" role="button">';

                if(item.cta_1_url.indexOf('github') >= 0) {
                    str += '<i class="fa fa-github"></i> ';
                }
                
                str += item.cta_1_text + '</a>' +
                '</div>';
            }

            if (item.cta_2_url) {
              str += '<div class="col-sm-6">' +
                '<a target="_blank" class="btn btn-info btn-bottom-left"' +
                ' href="' + removeHTMLChars(item.cta_2_url) + '" role="button">' +
                '<i class="fa fa-external-link"></i> ' + item.cta_2_text + '</a>' +
                '</div>';
            }

            if (item.cta_1_url || item.cta_2_url) {
                // closing row actions
              str += '</div>';
            }

            // add horizontal line and placeholder for language - even if not received by the API
            // str += '<hr />';
            str += '<div class="row more-details">';
            // str += '<div class="col-md-6 col-sm-6"><span class="language">Language: ' + removeHTMLChars(item.language) + '</span></div>';
            if (item.contributors) {
              str += '<div class="col-sm-12"><div class="contributors">Contributors: ' + item.contributors + '</div></div>';
            } else {
              str += '<div class="col-sm-12"><div class="contributors">&nbsp;</div></div>';
            }

            // close more-details div
            str += '</div>';

            // close actions, max and col-md-6 div
            str += '</div></div></div>';

            $(".Container").append(str);
        });
    } else {
        // filtered objects is empty - show info
        $(".Container").empty().append('<div class="col-md-12" id="noResults">No results to display</div');
    }
}

function appendAPIData(data) {
    // find the json object that will be extended
    $.each(jsonObjects, function(i, item) {
        // ID is the link to GitHub
        if (item.cta_1_url === data.html_url) {

            console.log(data);
            // set updatedAt attribute for later usage like sort
            item.updatedAt = data.updated_at;

            // TODO: potentially attributes name and description could be used - less effort but would require people to maintain/update existing descriptions and names
            // attributes that could be used for enhancements: language, stargazers_count, forks_count, homepage
            if (data.language) {
                item.language = data.language;
            }
            if (data.homepage) {
                // will override the JSON url if maintained on GitHub on purpose
                item.linkToProject = data.homepage;
            }
            item.forks_count = data.forks_count;
            item.open_issues_count = data.open_issues_count;
            item.stargazers_count = data.stargazers_count;
            item.subscribers_count = data.subscribers_count;
        }
    });
}

$(document).ready(function() {
    // word rotation in header
    $(function() {
        var words = ['Give', 'Take', 'Solve'],
            index = 0,
            $el = $('#rotate-word')
        setInterval(function() {
            index++ < words.length - 1 || (index = 0);
            $el.fadeOut(function() {
                $el.text(words[index]).fadeIn();
            });
        }, 3000);
    });


    // sticky navbar on top
    // $(window).scroll(function(e) {
    //     // let logo scroll with content
    //     var top = $(window).scrollTop();
    //     if (top >= 250 && ($(window).width() > 768)) {
    //         $(".navbar").css('transform', 'translateY(' + (top - 250) + 'px)');
    //     } else {
    //         $(".navbar").css('transform', 'translateY(0px)');
    //     }

    //     if ($("#nav").position().top - top < 453) {
    //         $(".stack-bottomright").css('bottom', 453 + 'px');
    //     }

    //     // back to top button
    //     if ($(this).scrollTop() > 250) {
    //         $('#back-to-top').fadeIn();
    //     } else {
    //         $('#back-to-top').fadeOut();
    //     }
    // });

    // scroll body to 0px on click
    $('#back-to-top').click(function() {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('#back-to-top').tooltip('show');

    $('#sortAsc').click(function() {
        sortParam = 'asc';
        setSwitchState();
        sortJSON();
        displayObjects();
    });

    $('#sortNewest').click(function() {
        sortParam = 'newest';
        setSwitchState();
        sortJSON();
        displayObjects();
    });

    $(".filter").on("click", function(event) {
        $(".nav-category").parent().removeClass('active');

        filterJSON($(event.target).text());
        setCategoryActive($(event.target).text());
        displayObjects();
    });

    // load project details via ajax
    $.getJSON("projects/repos.json", function(data) {
        jsonObjects = data;

        // use GitHub API to get updatedAt per project
        $.each(jsonObjects, function(key, value) {

            if (value.cta_1_url.indexOf('https://github.com') >= 0) {
            
                // use link to GitHub project in order to generate API endpoint uri
                value.APIUri = value.cta_1_url.replace("https://github.com", "https://api.github.com/repos");

                // collect all deffereds from calls to figure when all AJAX calls are complete
                deferreds.push(
                    // get repo details from GitHub API
                    $.ajax({
                        headers: {
                          "Accept" : "application/vnd.github.v3+json",  
                          // set authorization header to get 5000 requests/hr per IP for the GitHub API
                          "Authorization": "token " + githubToken
                        },
                        url: value.APIUri,
                        success: appendAPIData
                    })
                );
            }
        });

        $.when.apply($, deferreds).done(function() {
            // every ajax call has been completed
            setSwitchState();
            filterJSON(filterParam);
            displayObjects();
        }).fail(function() {
            // even if GitHub API not reachable, show plain JSON data
            setSwitchState();
            filterJSON(filterParam);
            displayObjects();
        });
    });

    $('#searchTxt').on("keyup", function(event) {
        // if search is empty, reset to show all objects
        if (!$('#searchTxt').val()) {
            filteredObjects = jsonObjects;
            filterParam = 'all';
            setCategoryActive("all");
            //set the URL accordingly
            setURLParameter();
        } else {
            $(".nav-category").parent().removeClass('active');
            var search = $('#searchTxt').val();
            searchJSON(search);
        }
        displayObjects();
    });
});
