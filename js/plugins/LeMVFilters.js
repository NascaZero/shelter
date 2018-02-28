/*
#=============================================================================
# MV Filters
# LeMVFilters.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# This plugin is under the MIT License.
# (http://choosealicense.com/licenses/mit/)
# In addition, you should keep this header and credit Lecode.
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeMVFilters"] = true;

var Lecode = Lecode || {};
Lecode.S_MVFilters = {};



Lecode.S_MVFilters.getEventSprite = function (id) {
    var scene = SceneManager._scene;
    if (scene instanceof Scene_Map) {
        var spriteset = scene._spriteset;
        var charas = spriteset._characterSprites;
        for (var i = 0; i < charas.length; i++) {
            var chara = charas[i];
            if (chara._character instanceof Game_Event) {
                if (chara._character.eventId() === id)
                    return chara;
            }
        }
    }
    return null;
};

Lecode.S_MVFilters.getScreenSprite = function () {
    var scene = SceneManager._scene;
    return scene;
};

Lecode.S_MVFilters.getParallaxSprite = function () {
    var scene = SceneManager._scene;
    var spriteset = scene._spriteset;
    return spriteset._tilemap.upperLayer.children[0]; //_parallax;
};

Lecode.S_MVFilters.applyFilterToTarget = function (data, filter, skipIfSame) {
    if (!Graphics.isWebGL()) {
        console.error("WebGL not supported !! MV Filter will not work.");
        return;
    }
    var target = Lecode.S_MVFilters.getFilterTarget(data);
    console.log("target: ", target);
    console.log("filter: ", filter);
    if (target) {
        if (target.filters) {
            if (skipIfSame) {
                for (var i = 0; i < target.filters.length; i++) {
                    if (target.filters[i] instanceof(typeof filter))
                        return target.filters[i];
                }
            }
            target.filters.push(filter);
        } else {
            target.filters = [filter];
        }
    }
    return filter;
};

Lecode.S_MVFilters.getFilterTarget = function (data) {
    var target = null;
    switch (data.targetType) {
        case "chara":
            target = Lecode.S_MVFilters.getEventSprite(data.id);
            break;
        case "screen":
            target = Lecode.S_MVFilters.getScreenSprite();
            break;
        case "parallax":
            target = Lecode.S_MVFilters.getParallaxSprite();
            break;
    }
    return target;
};


/*-------------------------------------------------------------------------
* Game_Interpreter
-------------------------------------------------------------------------*/
Lecode.S_MVFilters.oldGameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    Lecode.S_MVFilters.oldGameInterpreter_pluginCommand.call(this, command, args);
    if (command === 'Filter') {
        switch (args[0]) {
            case "clearAll":
                break;
            case 'add':
                var type = String(args[1]);
                var target = String(args[2]);
                if (target === "screen" || target === "parallax") {
                    args.splice(3, 0, -1);
                }
                var id = Number(args[3]);
                //-
                var strength;
                var quality;
                var resolution;
                var multiply;
                var value;
                var desaturation;
                var toned;
                var lightColor;
                var darkColor;
                var filter;
                var data = {
                    targetType: target,
                    id: id
                };
                //-
                if (type === "blur") {
                    strength = Number(args[4]);
                    quality = Number(args[5]);
                    resolution = Number(args[6]);
                    filter = new PIXI.filters.BlurFilter(strength, quality, resolution);
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                } else if (type === "blurX") {
                    strength = Number(args[4]);
                    quality = Number(args[5]);
                    resolution = Number(args[6]);
                    filter = new PIXI.filters.BlurXFilter(strength, quality, resolution);
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                } else if (type === "blurY") {
                    strength = Number(args[4]);
                    quality = Number(args[5]);
                    resolution = Number(args[6]);
                    filter = new PIXI.filters.BlurYFilter(strength, quality, resolution);
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                } else if (type === "blackAndWhite") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.blackAndWhite(multiply);
                } else if (type === "brightness") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.brightness(value, multiply);
                } else if (type === "browni") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.browni(multiply);
                } else if (type === "colorTone") {
                    desaturation = Number(args[4]);
                    toned = Number(args[5]);
                    lightColor = Number(args[6]);
                    darkColor = Number(args[7]);
                    multiply = String(args[8]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.colorTone(desaturation, toned, lightColor, darkColor, multiply);
                } else if (type === "contrast") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.contrast(value, multiply);
                } else if (type === "desaturate") {
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.desaturate();
                } else if (type === "greyscale") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.greyscale(value, multiply);
                } else if (type === "hue") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.hue(value, multiply);
                } else if (type === "kodachrome") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.kodachrome(multiply);
                } else if (type === "lsd") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.lsd(multiply);
                } else if (type === "negative") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.negative(multiply);
                } else if (type === "night") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.night(value, multiply);
                } else if (type === "polaroid") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.polaroid(multiply);
                } else if (type === "predator") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.predator(value, multiply);
                } else if (type === "saturate") {
                    value = Number(args[4]);
                    multiply = String(args[5]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.saturate(value, multiply);
                } else if (type === "sepia") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.sepia(multiply);
                } else if (type === "technicolor") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.technicolor(multiply);
                } else if (type === "toBGR") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.toBGR(multiply);
                } else if (type === "vintage") {
                    multiply = String(args[4]) === "true";
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.vintage(multiply);
                } else if (type === "reset") {
                    filter = new PIXI.filters.ColorMatrixFilter();
                    filter = Lecode.S_MVFilters.applyFilterToTarget(data, filter, true);
                    filter.reset();
                } else if (type === "displacement") {
                    value = Number(args[4]);
                    sprite = Lecode.S_MVFilters.getFilterTarget({
                        targetType: target,
                        id: 11
                    });
                    filter = new PIXI.filters.DisplacementFilter(sprite, value);
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                } else if (type === "fxaa") {
                    filter = new PIXI.filters.FXAAFilter();
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                } else if (type === "noise") {
                    value = Number(args[4]);
                    filter = new PIXI.filters.NoiseFilter();
                    filter.noise = value;
                    Lecode.S_MVFilters.applyFilterToTarget(data, filter);
                }
                break;
            case 'OFF':
                Lecode.S_TBS.commandOn = false;
                break;
        }
    }
};