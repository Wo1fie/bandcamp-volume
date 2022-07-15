function BandcampVolume(){
    // Get track info container if we're on the main bandcamp site
    const elTrackInfoContainer = document.getElementById("trackInfoInner");
    this.generateWidget = function(){

    }
    
    this.onPlay = function(e, v) {
        console.log("[]");
        var infolayer = document.getElementById('infolayer');
    }

    this.setVolume = function(volume) {
        gplaylist._player._html5player.setvol(volume);
    };

    this.getVolume = function() {
        return gplaylist._player._html5player.getvol();
    };
    function init(){
        console.log("[Bandcamp Volume Extension] Loading.");

        addEventListener('play', this.onPlay);

        console.log("[Bandcamp Volume Extension] Loaded.");
    }
};
var bandcampVolume = new BandcampVolume();

(function () {
    // Attach to play event listener to try and detect when the bandcamp widget is being used
    function 

    function attachWidget(target) {
        var widget = generateWidget();
        target.prepend(widget);
    }
    function generateWidget() {
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

        let currentVolume = getVolume() * 100;
        elText.innerText = currentVolume + "%";
        elRange.setAttribute('value', currentVolume)
        elRange.oninput = function onVolumeChange(e) {
            const val = e.target.valueAsNumber;
            const newVolume = val / 100;
            setVolume(newVolume);
            elText.innerText = val + "%";
        };
    }

    if (elTrackInfoContainer) {

    } else {
        console.log("[Bandcamp Volume Extension] Could not find track info container.");
    }

})();