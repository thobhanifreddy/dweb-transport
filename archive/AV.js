require('babel-core/register')({ presets: ['env', 'react']}); // ES6 JS below!
import React from './ReactFake';
import Util from "./Util";

import Details from './Details'

export default class AV extends Details {
    constructor(itemid, item) {
        super(itemid, item);
    }
    nodeHtmlBefore() {
        playlist = JSON.stringify(this.playlist);
        cfg = JSON.stringify(this.cfg);
        return `
          <script src="//archive.org/jw/6.8/jwplayer.js" type="text/javascript"></script>
          <script src="//archive.org/includes/play.js" type="text/javascript"></script>
          <script>
            $(function(){ Play('jw6', ${playlist}, ${cfg}); });
          </script>
          <style>
            #jw6, #jw6__list { backgroundColor:black; }
          </style>`;

    }
    browserAfter() {
        super.browserAfter()
        Play('jw6', this.playlist, this.cfg);
    }
    theatreIaWrap() {
        let item = this.item;
        let itemid = this.itemid;
        let detailsurl = `https://archive.org/details/${itemid}`
        let title = item.title
        this.playlist=[];
        let cfg={};
        let avs = item.files.filter(fi => (fi.format=='h.264' || fi.format=='512Kb MPEG4'));    //TODO-DETAILS-LIST Maybe use _list instead of .files
        if (!avs.length)
            avs = item.files.filter(fi => fi.format=='VBR MP3'); //TODO-DETAILS-LIST Maybe use _list instead of .files
        cfg.aspectratio = 4/3;

        if (avs.length) {

            // reduce array down to array of just filenames
            //avs = avs.map(val => val.name);

            avs.sort((a, b) => Util.natcompare(a.name, b.name));   //Unsure why sorting names, presumably tracks are named alphabetically ?
            for (var fi of avs) //TODO-DETAILS make this a map (note its tougher than it looks!)
                this.playlist.push({title:(fi.title ? fi.title : fi.name), sources:[{file:'https://archive.org/download/'+itemid+'/'+fi.name}]});
            this.playlist[0].image = 'https://archive.org/services/img/' + itemid;
        }
        //TODO-DETAILS make next few lines between theatre-ia-wrap and theatre-ia not commute specific
        return (
            <div id="theatre-ia-wrap" class="container container-ia width-max ">
                <link itemprop="url" href={detailsurl}/>
                {/*-- TODO make commute specific - look for somewhere else it builds itemprop
                <link itemprop="thumbnailUrl" href="https://archive.org/download/commute/commute.thumbs/commute_000005.jpg">
                <link itemprop="contentUrl" href="https://archive.org/download/commute/commute.mp4">
                <link itemprop="embedUrl" href="https://archive.org/embed/commute/commute.avi">
                 <meta itemprop="duration" content="PT0M115S">
                 --*/}
                <h1 class="sr-only">{title}</h1>
                <h2 class="sr-only">Movies Preview</h2>

                <div id="theatre-ia" class="container">
                    <div class="row">
                        <div class="xs-col-12">

                            <div id="theatre-controls">
                                <a href="#" id="gofullscreen" onclick="jwplayer('jw6').setFullscreen()">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-fullscreen"
                                         title="fullscreen view"></div>
                                </a>
                                <a href="#" onclick="return AJS.flash_click(0)">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-flash"
                                         title="Click to have player try flash first, then HTML5 second"></div>
                                </a>
                                <a href="#" onclick="return AJS.mute_click()">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-unmute"
                                         title="sound is on.  click to mute sound."></div>
                                </a>
                                <a href="#" onclick="return AJS.mute_click()">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-mute"
                                         style="display:none" title="sound is off.  click for sound."></div>
                                </a>
                            </div>{/*--/#theatre-controls--*/}
                            <noscript>
                                <div class="alert alert-danger alert-dismissable" data-dismiss="alert">
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true"><span
                                            class="iconochive-remove-circle" aria-hidden="true"></span><span class="sr-only">remove-circle</span>
                                    </button>
                                    Internet Archive&apos;s in-browser
                                    video player requires JavaScript to be enabled.
                                    It appears your browser does not have it turned on.
                                    Please see your browser settings for this feature.
                                </div>
                            </noscript>

                            <div id="jw6"></div>
                            {this.cherModal("video")}
                        </div> {/*--/.xs-col-12--*/}
                    </div>{/*--/.row--*/}
                </div>
                <div id="flag-overlay" class="center-area ">
                </div>
            {/*--//.container-ia--*/}</div>
        );
    }
}