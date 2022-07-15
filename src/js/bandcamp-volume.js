function BandcampVolume() {
    this.activeplayer = null;
    this.currentWidget = null;
    this.cookiejs = typeof Cookie != 'undefined';
    this.hasSetVolume = false;
    this.widgetRange = null;

    this.generateWidget = function () {
        // Create Elements
        const newElContainer = document.createElement("div");
        const elTextLabel = document.createElement("label")
        const elRange = document.createElement("input");
        const elText = document.createElement("strong");
        // Set up elements
        elTextLabel.innerHTML = 'Volume:';
        elTextLabel.appendChild(elText);
        newElContainer.appendChild(elTextLabel);
        newElContainer.appendChild(elRange);

        newElContainer.setAttribute("id", "bandcamp-volume-container");
        elText.setAttribute("id", "volumeText");
        elRange.setAttribute("id", "volumeRange");
        elRange.setAttribute('type', 'range');
        elTextLabel.setAttribute('id', 'volumeLabel');

        const currentVolume = this.getVolume() * 100;
        elText.innerText = currentVolume + "%";
        elRange.setAttribute('value', currentVolume);
        elRange.oninput = function onVolumeChange(e) {
            const val = e.target.valueAsNumber;
            let newVolume = val / 100;
            this.setVolume(newVolume);
            elText.innerText = val + "%";
        }.bind(this);
        this.widgetRange = elRange;
        return newElContainer;
    };

    this.attachWidget = function (target) {
        var widget = this.generateWidget();
        this.currentWidget = widget;
        target.prepend(widget);
        if (this.cookiejs) {
            var savedVolume = Cookie.get('volume');
            if (savedVolume) {
                this.log("Detected Volume cookie.  Setting volume to ", savedVolume);
                this.setVolume(savedVolume, true);
            } else {
                this.log("Volume cookie is unset.  It is probably not ready and will be refreshed when the player starts.");
            }
        }
    };
    this.log = function () {
        let prefix = "[Bandcamp Volume Extension]";
        var args = Array.prototype.slice.call(arguments);
        args.unshift(prefix);
        console.log.apply(console, args);
    }

    this.getMiniplayer = function (target) {
        if (!target) {
            target = document.getElementById('player');
        }
        var miniAudio = undefined;
        if (target) {
            var elParent = target.parentElement;
            for (var x = 0; x < elParent.children.length; x++) {
                var elChild = elParent.children[x];
                if (elChild.tagName == 'AUDIO') {
                    miniAudio = elChild;
                    this.log("Found mini audio player.");
                    return miniAudio;
                }
            }
        } else {
            this.log("Unable to find mini audio player.");
            return miniAudio;
        }
    };
    this.onplay = function (e) {
        debugger;
        if (!this.hasSetVolume) {
            let savedVolume = Cookie.get('volume');
            if (savedVolume) {
                this.setVolume(savedVolume, true);
            } else {
                this.log("Volume still unset or invalid.  Value: ", savedVolume);
            }
        }
    }
    this.setPlayer = function (player) {
        this.activeplayer = player;
        player.onplay = this.onplay.bind(this);
    }

    this.setVolume = function (volume, updateElement) {
        this.activeplayer.volume = volume;
        if (updateElement) {
            this.widgetRange.setAttribute('value', volume * 100);
        }
        if (this.cookiejs) {
            Cookie.set('volume', volume);
        }
    };

    this.getVolume = function () {
        return this.activeplayer.volume;
    };
    this.init = function () {
        this.log("Loading.");
        const elTrackInfoContainer = document.getElementById("trackInfoInner"); // Get track info container if we're on the main bandcamp site
        var elPlayer = document.getElementById('player'); //mini player widget potentially

        if (this.cookiejs) { //Cookie plugin detection
            this.log("CookieJS detected.  This will attempt to integrate with Bandcamp's Volume cookie.");
        }
        if (elTrackInfoContainer) { //Bandcamp site
            this.setPlayer(gplaylist._player._html5player._mediaElem)
            this.attachWidget(elTrackInfoContainer);
            this.log("Found main Bandcamp audio player.  Attached volume widget.");
        } else if (elPlayer) { // Mini player e.g. twitter.
            var miniAudio = this.getMiniplayer(elPlayer);
            if (miniAudio) {
                this.setPlayer(miniAudio);
                var elTitleRow = document.getElementById('timelinecontainer');
                this.attachWidget(elTitleRow, true);
            } else {
                this.log("An incompatible player was detected and ignored.");
            }
        } else { // Nada
            this.log("No player detected.  This extension will stop running.");
        }
        this.log("Loaded."); // All done
        return this;
    };
    return this.init();
};
var bandcampVolume = new BandcampVolume();
