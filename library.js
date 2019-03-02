const async = require.main.require("async");
const meta = require.main.require('./src/meta');
const request = require.main.require('request');
const nconf = require.main.require("nconf");
const search = require.main.require("./src/search");
const topics = require.main.require('./src/topics');

const categoryIdRegex = /c-(\d)+/g;

const Publisher = {
    publishCategoryId: 0,
    discordWebHook: "change-me",
    init(params, callback) {
        let app = params.router;
        let middleware = params.middleware;

        app.get("/admin/plugins/mff-publisher", middleware.admin.buildHeader, renderAdmin);
        app.get("/api/admin/plugins/mff-publisher", renderAdmin);

        app.get("/publisherapi/topics", getPreviousTopics);

        meta.settings.get("mff-publisher", (error, options) => {
            if (error) {
                console.log(`[plugin/mff-publisher] Unable to retrieve settings, will keep defaults: ${error.message}`);
            } else {
                if (options.hasOwnProperty("publishcategoryid")) {
                    Publisher.publishCategoryId = options["publishcategoryid"];
                }
                if (options.hasOwnProperty("discordwebhook")) {
                    Publisher.discordWebHook = options["discordwebhook"];
                }
            }
        });

        callback();
    },
    addAdminToNav(header, callback) {
        header.plugins.push({
            route: "/plugins/mff-publisher",
            name: 'MFF Publisher'
        });
        callback(null, header);
    },
    getWidget(widgets, callback) {
        widgets.push({
            name: "MFF Publisher",
            widget: "",
            description: "",
            content: ""
        });
        callback(null, widgets);
    },
    renderWidget(widget, callback) {
        async.parallel({
            previous: async.apply(getPreviousTopics)
        }, (error, data) => {
            if (error) {
                callback(error);
            }

            //data.relative_path = nconf.get("relative_path");

            widget.req.app.render("widgets/publisher", data, (error, html) => {
                widget.html = html;
                callback(error, html);
            });
        });
    }
};

function renderAdmin(req, res) {
    res.render("admin/plugins/mff-publisher");
}


// TODO Change name
function getPreviousTopics(req, res) {
    searchInPost(req, res, [Publisher.publishCategoryId])
}

function searchInPost(req, res, categories) {
    const data = {
        query: '',
        searchIn: 'titles',
        matchWords: 'all',
        categories: categories,
        searchChildren: false,
        hasTags: req.query.hasTags,
        sortBy: '',
        qs: req.query
    };

    search.search(data, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({error: "Error while performing the search"});
        }
        let tids = results.posts.map(post => post && post.tid);
        topics.getTopicsTags(tids, (error2, postTags) => {
            if (error2) {
                console.log(error2);
                return res.status(500).json({error: "Error while getting topic tags"})
            }

            if (results.posts.length === 0) {
                return res.status(200).json({message: "No result"});
            }

            let response = {};
            for (let tags of postTags) {
                for (let tag of tags) {
                    if (tag.match(categoryIdRegex)) {
                        if (isTagInFilter(tag, req.query.hasTags)) {
                            response[tag] = [];
                        }
                    }
                }
            }

            for (let i in results.posts) {
                let post = {
                    title: results.posts[i].topic.title,
                    url: nconf.get('url') + '/topic/' + results.posts[i].topic.slug
                };
                if (postTags[i].length !== 0) {
                    for (let tag of postTags[i]) {
                        if (tag.match(categoryIdRegex)) {
                            if (isTagInFilter(tag, req.query.hasTags)) {
                                response[tag].push(post);
                            }
                        }
                    }
                }
            }
            return res.status(200).json(response);
        });
    });
}

function isTagInFilter(tag, tagsFilter) {
    return !tagsFilter || (tagsFilter && tagsFilter.indexOf(tag) >= 0);
}

module.exports = Publisher;
