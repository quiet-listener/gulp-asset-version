"use strict";

var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-asset-rev';

var ASSET_REG = {
    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
    "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig,
    "IMAGE": /(<img[^>]+src=)['"]([^'"]+)["']/ig,
    "BACKGROUND": /(url\()(?!data:|about:)([^)]*)/ig
};

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        options = options || {};

        var version = options["version"] || "";

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();

        var filePath = path.dirname(file.path);
        console.log(file.path)
        for (var type in ASSET_REG) {
            if (type === "BACKGROUND" && !/\.(css|scss|less)$/.test(file.path)) {

            } else {
                content = content.replace(ASSET_REG[type], function (str, tag, src) {
                    src = src.replace(/(^['"]|['"]$)/g, '');

                    if (!/\.[^\.]+$/.test(src)) {
                        return str;
                    }
                
                    // remote resource
                    if (/^https?:\/\//.test(src)) {
                        return str;
                    }
                    
                    if (/\?v=+/.test(src)){
                        console.log(src);
                        src = src.replace(/(&rand=)\w{7}/, '');
                        src=src+"&rand="+version;
                    }
                    else{
                        src = src.replace(/(\?rand=)\w{7}/, '');
                        src=src+"?rand="+version;
                    }                           
                    return tag + '"' + src + '"';
                });
            }
        }

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
};
