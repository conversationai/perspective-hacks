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

class Icons {
  constructor() {
    this.svgNamespace = 'http://www.w3.org/2000/svg';
  }

  getSvg() {
    const svg = document.createElementNS(this.svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 33.25 33.25');
    svg.style.width = '33px';
    svg.style.height = '33px';
    return svg;
  }

  getFace() {
    const face = document.createElementNS(this.svgNamespace, 'circle');
    face.classList.add('face');
    face.setAttribute('cx', '16.63');
    face.setAttribute('cy', '16.63');
    face.setAttribute('r', '16.63');
    face.setAttribute('fill', 'currentColor');
    return face;
  }

  getEye(isLeft = true) {
    const eye = document.createElementNS(this.svgNamespace, 'circle');
    eye.setAttribute('cx', (isLeft) ? '11.9' : '21.3');
    eye.setAttribute('cy', '11.8');
    eye.setAttribute('r', '1.8');
    eye.setAttribute('fill', '#b2b2b2');
    eye.classList.add('highlighter-face-feature');
    return eye;
  }

  getBaseLips() {
    const lips = document.createElementNS(this.svgNamespace, 'path');
    lips.setAttribute('fill', '#b2b2b2');
    lips.classList.add('highlighter-face-feature');
    return lips;
  }

  getNeutralLips() {
    const lips = this.getBaseLips();
    lips.setAttribute('d', 'M23.1 21h-13c-.4 0-.8.4-.8.8s.4.8.8.8h13c.4 0 .8-.4.8-.8s-.3-.8-.8-.8z');
    return lips;
  }

  getHappyLips() {
    const lips = this.getBaseLips();
    lips.setAttribute('d', 'M16.9 23.4c-4.4 0-7.7-1.5-7.9-1.6-.4-.2-.6-.7-.4-1.1.2-.4.7-.6 1.1-.4.1 0 7 3.3 14 0 .4-.2.9 0 1.1.4s0 .9-.4 1.1c-2.7 1.2-5.2 1.6-7.5 1.6z');
    return lips;
  }

  getSadLips() {
    const lips = this.getBaseLips();
    lips.setAttribute('d', 'M24.3 21.9c-.3-.1-7.7-3.6-15.4 0-.4.2-.6.7-.4 1.1.1.3.4.5.7.5.1 0 .2 0 .3-.1 7-3.3 13.9 0 14 0 .4.2.9 0 1.1-.4.3-.5.1-.9-.3-1.1z');
    return lips;
  }

  getBaseFace() {
    const svg = this.getSvg();
    svg.appendChild(this.getFace());
    svg.appendChild(this.getEye(true));
    svg.appendChild(this.getEye(false));
    return svg;
  }

  getCaption(caption) {
    const wrapper = document.createElement('div');
    wrapper.innerText = caption;
    wrapper.style.color = '#999';
    wrapper.style.fontSize = '12px';
    return wrapper;
  }

  getWrapper(svg, caption) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('highlighter-face');
    wrapper.appendChild(svg);
    wrapper.appendChild(this.getCaption(caption));
    return wrapper;
  }

  getNeutralFace() {
    const svg = this.getBaseFace();
    svg.appendChild(this.getNeutralLips());
    return this.getWrapper(svg, 'Neutral');
  }

  getSadFace() {
    const svg = this.getBaseFace();
    svg.appendChild(this.getSadLips());
    return this.getWrapper(svg, 'Toxic');
  }

  getHappyFace() {
    const svg = this.getBaseFace();
    svg.appendChild(this.getHappyLips());
    return this.getWrapper(svg, 'Healthy');
  }

  getTick() {
    const svg = document.createElementNS(this.svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 42.7 42.7');
    svg.style.width = '42px';
    svg.style.height = '42px';
    svg.classList.add('highlighter-tick');
    svg.dataset.spiritId = 'tick-container';

    const circle = document.createElementNS(this.svgNamespace, 'circle');
    circle.setAttribute('cx', '21.35');
    circle.setAttribute('cy', '21.35');
    circle.setAttribute('r', '21.35');
    circle.setAttribute('fill', '#66bb6a');
    circle.dataset.spiritId = 'tick-circle';

    const outline = document.createElementNS(this.svgNamespace, 'path');
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke-dashoffset', '20');
    outline.setAttribute('stroke', '#fff');
    outline.setAttribute('stroke-linecap', 'round');
    outline.setAttribute('stroke-linejoin', 'round');
    outline.setAttribute('stroke-width', '4');
    outline.setAttribute('d', 'M13.75 21.52l4.89 4.9 10.39-10.39');
    outline.dataset.spiritId = 'tick-outline';

    svg.appendChild(circle);
    svg.appendChild(outline);
    return svg;
  }

  getCross() {
    const svg = document.createElementNS(this.svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 42.7 42.7');
    svg.classList.add('highlighter-cross');
    svg.dataset.spiritId = 'cross-svg';

    const circle = document.createElementNS(this.svgNamespace, 'circle');
    circle.setAttribute('cx', '21.35');
    circle.setAttribute('cy', '21.35');
    circle.setAttribute('r', '21.35');
    circle.setAttribute('fill', '#e57373');
    circle.dataset.spiritId = 'cross-circle';

    const cross = document.createElementNS(this.svgNamespace, 'path');
    cross.setAttribute('fill', 'none');
    cross.setAttribute('stroke', '#fbfbf9');
    cross.setAttribute('stroke-linecap', 'round');
    cross.setAttribute('stroke-miterlimit', '10');
    cross.setAttribute('stroke-width', '4px');
    cross.setAttribute('d', 'M26.35 16l-10 10M26.35 26l-10-10');
    cross.dataset.spiritId = 'cross';

    svg.appendChild(circle);
    svg.appendChild(cross);
    return svg;
  }

  getLoader() {
    const svg = document.createElementNS(this.svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 42.7 42.7');
    svg.classList.add('highlighter-loading-svg');
    svg.dataset.spiritId = 'loading-svg-container';

    const background = document.createElementNS(this.svgNamespace, 'path');
    background.setAttribute('fill', '#57535a');
    background.setAttribute('opacity', '.2');
    background.setAttribute('d', 'M21.35 2A19.35 19.35 0 1 1 2 21.35 19.37 19.37 0 0 1 21.35 2m0-2A21.35 21.35 0 1 0 42.7 21.35 21.35 21.35 0 0 0 21.35 0z');
    background.dataset.spiritId = 'loader-bg';

    const foreground = document.createElementNS(this.svgNamespace, 'path');
    foreground.setAttribute('fill', '#57535a');
    foreground.setAttribute('d', 'M41.69 22.35a1 1 0 0 1-1-1A19.36 19.36 0 0 0 21.35 2a1 1 0 1 1 0-2 21.37 21.37 0 0 1 21.34 21.35 1 1 0 0 1-1 1z');
    foreground.dataset.spiritId = 'loader-fg';

    svg.appendChild(background);
    svg.appendChild(foreground);

    return svg;
  }
}