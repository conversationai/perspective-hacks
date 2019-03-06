/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const highlighterAnimations = {"version_app":"0.12.1","version_extension":"1.3.6","version_runtime":"2.2.2","groups":[{"root":{"path":"/html[1]/body[1]","id":null},"name":"Fade In","timeScale":1,"timelines":[{"type":"dom","props":{"opacity":{"0s":"0","0.26728723404255317s":{"value":"1","ease":"Quad.easeIn"}},"transformOrigin":{"0s":"50% 100%"},"y":{"0s":"30","0.40558510638297873s":{"value":"0","ease":"Back.easeOut"}}},"label":"#container","path":"div[1]","id":"container"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Fade Out","timeScale":1,"timelines":[{"type":"dom","props":{"opacity":{"0s":"1","0.40159574468085113s":{"value":"0","ease":"Quad.easeOut"}},"scale":{"0s":"1","0.06515957446808511s":"1","0.40159574468085113s":{"value":"0.98","ease":"Quad.easeOut"}},"transformOrigin":{"0s":"50% 100%"}},"label":"#container","path":"div[1]","id":"container"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Success","timeScale":1,"timelines":[{"type":"dom","props":{"opacity":{"0s":"0","0.9986702127659575s":"0","1.002659574468085s":"1","2.253324468085106s":"1","2.257313829787234s":"0"},"y":{"0s":"0","1.5454787234042553s":"0","1.9568203756586093s":{"value":"-11","ease":"Quad.easeOut"}}},"label":"#success-container","path":"div[1]/div[3]","id":"success-container"},{"type":"dom","props":{"opacity":{"0s":"1","0.08374164810690424s":"1","0.2566489361702128s":"0"},"scale":{"0s":"1","0.08374164810690424s":"1","0.2566489361702128s":"0.98"}},"label":"#faces-container","path":"div[1]/div[1]","id":"faces-container"},{"type":"dom","props":{"scale":{"0s":"0","1.0026595744680855s":"0","1.5412234042553192s":{"value":"1","ease":"Back.easeOut"}}},"label":"#tick-container","path":"div[1]/div[3]/*[local-name()='svg'][1]","id":"tick-container"},{"type":"dom","label":"#tick-circle","path":"div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='circle'][1]","id":"tick-circle"},{"type":"dom","props":{"opacity":{"0s":"0","1.3803191489361701s":"0","1.406379744730131s":"1"},"strokeDasharray":{"0s":"21","1.3789893617021276s":"21","1.5851063829787233s":"45"}},"label":"#tick-outline","path":"div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"tick-outline"},{"type":"dom","props":{"opacity":{"0s":"0","1.5264952678955137s":"0","1.9713540756326717s":{"value":"1","ease":"Quad.easeIn"}},"scale":{"0s":"0.9","0.7307469600463231s":"0.9"}},"label":"#tick-caption","path":"div[1]/div[3]/div[1]","id":"tick-caption"},{"type":"dom","props":{"opacity":{"0s":"0","0.29388297872340424s":"0","0.738031914893617s":"1","0.7420212765957447s":"0","0.9986702127659575s":"0","1.514627659574468s":"0","1.523936170212766s":"0"}},"label":"#loading-container","path":"div[1]/div[2]","id":"loading-container"},{"type":"dom","props":{"opacity":{"2.2519946808510634s":"0","2.257978723404255s":"1"}},"label":"#error-container","path":"div[1]/div[4]","id":"error-container"},{"type":"dom","props":{"scale":{"0s":"0","2.5744680851063846s":"0","2.9973404255319167s":{"value":"1","ease":"Back.easeOut"}}},"label":"#cross-svg","path":"div[1]/div[4]/*[local-name()='svg'][1]","id":"cross-svg"},{"type":"dom","props":{"rotation":{"2.607712765957449s":"-30","2.998005319148936s":{"value":"0","ease":"Quad.easeOut"}},"scale":{"2.607712765957449s":"0","2.9973404255319167s":{"value":"1","ease":"Quad.easeOut"}}},"label":"#cross","path":"div[1]/div[4]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"cross"},{"type":"dom","props":{"opacity":{"0s":"0","2.499335106382979s":"0 ","2.9940159574468086s":{"value":"1","ease":"Quad.easeOut"}},"x":{"0s":"6","2.499335106382979s":"6","2.998005319148936s":{"value":"0","ease":"Quad.easeOut"}}},"label":"#error-caption","path":"div[1]/div[4]/div[1]","id":"error-caption"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Loading","timeScale":1,"timelines":[{"type":"dom","label":"#loading-svg-container","path":"div[1]/div[2]/*[local-name()='svg'][1]","id":"loading-svg-container"},{"type":"dom","props":{"rotation":{"0s":"0deg","0.738031914893617s":"360"},"transformOrigin":{"0s":"5% 95%"}},"label":"#loader-fg","path":"div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='path'][2]","id":"loader-fg"},{"type":"dom","label":"#loader-bg","path":"div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"loader-bg"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Healthy Face","timeScale":1,"timelines":[{"type":"dom","props":{"scale":{"0s":"1","0.5s":{"value":"1.2 ","ease":"Back.easeOut"}}},"label":"#healthy-face-container","path":"div[1]/div[1]/div[1]","id":"healthy-face-container"},{"type":"dom","label":"#healthy-face-svg","path":"div[1]/div[1]/div[1]/*[local-name()='svg'][1]","id":"happy-face-svg"},{"type":"dom","props":{"color":{"0s":"rgb(245, 244, 242)","0.5s":"rgb(251, 214,140)"}},"label":"#healthy-face-face","path":"div[1]/div[1]/div[1]/*[local-name()='svg'][1]/*[local-name()='circle'][1]","id":"healthy-face-face"},{"type":"dom","props":{"color":{"0s":"rgb(51, 51, 51)","0.5s":"rgb(255,255, 255)"}},"label":"#healthy-face-left-eye","path":"div[1]/div[1]/div[1]/*[local-name()='svg'][1]/*[local-name()='circle'][2]","id":"healthy-face-left-eye"},{"type":"dom","props":{"color":{"0s":"rgb(245, 244, 242)","0.5s":"rgb(87, 83, 90)"}},"label":"#healthy-face-right-eye","path":"div[1]/div[1]/div[1]/*[local-name()='svg'][1]/*[local-name()='circle'][3]","id":"healthy-face-right-eye"},{"type":"dom","label":"#healthy-face-mouth","path":"div[1]/div[1]/div[1]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"healthy-face-mouth"},{"type":"dom","label":"#healthy-face-caption","path":"div[1]/div[1]/div[1]/div[1]","id":"healthy-face-caption"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Neutral Face","timeScale":1,"timelines":[{"type":"dom","label":"#neutral-face-container","path":"div[1]/div[1]/div[2]","id":"neutral-face-container"},{"type":"dom","props":{"color":{"0s":"red"}},"label":"#neutral-face-svg","path":"div[1]/div[1]/div[2]/*[local-name()='svg'][1]","id":"neutral-face-svg"},{"type":"dom","label":"#neutral-face-face","path":"div[1]/div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='circle'][1]","id":"neutral-face-face"},{"type":"dom","label":"#neutral-face-left-eye","path":"div[1]/div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='circle'][2]","id":"neutral-face-left-eye"},{"type":"dom","label":"#neutral-face-right-eye","path":"div[1]/div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='circle'][3]","id":"neutral-face-right-eye"},{"type":"dom","label":"#neutral-face-mouth","path":"div[1]/div[1]/div[2]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"neutral-face-mouth"},{"type":"dom","label":"#neutral-face-caption","path":"div[1]/div[1]/div[2]/div[1]","id":"neutral-face-caption"}]},{"root":{"path":"/html[1]/body[1]","id":null},"name":"Toxic Face","timeScale":1,"timelines":[{"type":"dom","label":"#toxic-face-container","path":"div[1]/div[1]/div[3]","id":"toxic-face-container"},{"type":"dom","label":"#toxic-face-svg","path":"div[1]/div[1]/div[3]/*[local-name()='svg'][1]","id":"toxic-face-svg"},{"type":"dom","label":"#toxic-face-face","path":"div[1]/div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='circle'][1]","id":"toxic-face-face"},{"type":"dom","label":"#toxic-face-left-eye","path":"div[1]/div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='circle'][2]","id":"toxic-face-left-eye"},{"type":"dom","label":"#toxic-face-right-eye","path":"div[1]/div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='circle'][3]","id":"toxic-face-right-eye"},{"type":"dom","label":"#toxic-face-mouth","path":"div[1]/div[1]/div[3]/*[local-name()='svg'][1]/*[local-name()='path'][1]","id":"toxic-face-mouth"},{"type":"dom","label":"#toxic-face-caption","path":"div[1]/div[1]/div[3]/div[1]","id":"toxic-face-caption"}]}]};

class Animations {
  constructor() {
    this.groups = [];

    // Ensure TweenMax isn't loaded from CDN to bypass CSP policies on sites like Twitter and
    // Facebook.
    spirit.config.gsap.autoInjectUrl = ''
    spirit.setup({ tween: TweenMax, timeline: TimelineMax }).then(() => {});
  }

  getTimeline(groupName) {
    const groups = spirit.create(highlighterAnimations);
    const group = groups.get(groupName);
    this.groups.push(group);
    return group.construct();
  }

  playAnimation(groupName, completeFunction, reset = false, repeat = false) {
    /**
     * Recreate all the animation groups before playing any animation. This
     * isn't a great idea! Ideally we want to load them all once and then play
     * the timelines, however since we are adding and removing the speech bubble
     * from the DOM, we need to re-create the groups so Spirit knows which
     * element to animate. There is a new feature coming out which will allow
     * users to refresh the group which should fix this issue.
     */
    const groups = spirit.create(highlighterAnimations);
    const group = groups.get(groupName);
    let timeline = group.construct();

    this.groups.push(group);

    if (repeat) {
      timeline.repeat(-1);
    }

    timeline.play();

    group.timeline.eventCallback('onComplete', () => {
      if (typeof completeFunction === 'function') {
        completeFunction();
      }

      if (reset) {
        group.timeline.progress(0).pause();
      }
    });
  }

  reset() {
    this.groups.forEach((group) => {
      group.reset();
    });
  }
}