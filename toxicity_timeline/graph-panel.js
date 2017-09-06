/**
 * Copyright 2017 Google Inc.
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

const GraphPanel = class {
  constructor() {
    this.scoreElement = document.getElementById('score');
    this.toxicityRangeElement = document.getElementById('toxicity-range');
    this.chartSetup = false;
    this.currentCommentElement = document.createElement('div');
    this.currentCommentElement.classList.add('current-comment');
    this.headerElement = document.createElement('header');
    this.graphPanel;

    this.buildFilters();
  }

  buildFilters() {
    this.filterContainer = document.createElement('div');
    this.filterContainer.classList.add('filter-container');

    this.filterElement = document.createElement('select');
    this.filterElement.classList.add('graph-filter');

    this.oneDay = document.createElement('option');
    this.oneDay.value = '1';
    this.oneDay.innerText = '24 hours';

    this.threeDays = document.createElement('option');
    this.threeDays.value = '3';
    this.threeDays.innerText = '3 days';

    this.allTime = document.createElement('option');
    this.allTime.value = 'all';
    this.allTime.selected = 'true';
    this.allTime.innerText = 'All time';

    this.filterElement.appendChild(this.oneDay);
    this.filterElement.appendChild(this.threeDays);
    this.filterElement.appendChild(this.allTime);
    this.filterContainer.appendChild(this.filterElement);
  }


  /**
   * Builds panel containing graph.
   * @param {Object} stats
   */
  setupGraphPanel(stats) {
    // Contains all pages comments.
    this.stats = stats;

    // New data has arrived from page, but the chart is already setup
    // so just update dataset.
    if (this.chartSetup) {
      this.updateChartData(this.stats);
      this.allTime.selected = 'true';
      return;
    }

    this.graphPanel = document.createElement('div');
    this.graphPanel.setAttribute('id', 'graph-panel');
    this.graphPanel.classList.add('graph-panel', 'mdl-shadow--3dp');

    const imageUrl = chrome.runtime.getURL('arrow.svg');
    const logoUrl = chrome.runtime.getURL('perspective-logo.png');
    this.graphPanel.innerHTML = `<canvas class="toxicGraph" id="toxicGraph" width="800" height="380"></canvas>`;

    if (!this.chartSetup) {
      this.graphPanel.insertBefore(
          this.headerElement, this.graphPanel.firstChild);
    }

    this.graphPanel.appendChild(this.filterContainer);
    this.graphPanel.appendChild(this.currentCommentElement);
    document.body.appendChild(this.graphPanel);

    this.filterElement.addEventListener('change', (e) => {
      this.showDays(parseInt(this.filterElement.selectedOptions[0].value));
    });

    this.drawChart(stats);
    this.chartSetup = true;
  }

  /**
   * Returns header element.
   * @returns {Element}
   */
  getHeaderElement() {
    return this.headerElement;
  }

  /**
   * Returns date of latest comment.
   * @returns {Date}
   */
  getLatestCommentDate() {
    return this.stats[this.stats.length - 1].date;
  }

  /**
   * Returns filters within the given dates.
   * @param {Date} earliestDate
   * @param {Date} latestDate
   * @returns {Object}
   */
  filterCommentsByDate(earliestDate, latestDate) {
    let filteredStats = [];

    for (let stat of this.stats) {
      if (stat.date >= earliestDate && stat.date <= latestDate) {
        filteredStats.push(stat);
      }
    }
    return filteredStats;
  }

  /**
   * Updatess chart to only show data for the specified past days.
   * @param {number} days
   * @returns
   */
  showDays(days) {
    // If no days are passed in or it's not a number, show all data.
    if (isNaN(days)) {
      this.showAllTime();
      return;
    }
    const earliestDate = new Date().add(-days).days();
    const filteredStats = this.filterCommentsByDate(earliestDate, new Date());
    this.updateChartData(filteredStats);
  }

  /**
   * Updates chart to show comments from all days.
   */
  showAllTime() {
    this.updateChartData(this.stats);
  }

  /**
   * Updates chart with the given data.
   * @param {Object} stats
   */
  updateChartData(stats) {
    this.chart.data.labels = this.getDates(stats);
    this.chart.data.datasets[0].data = this.getScores(stats);
    this.chart.data.datasets[0].comments = this.getComments(stats);
    this.chart.update();
  }

  /**
   * Given a data set of comments, return dates in order of newest to oldest.
   * @param {Object} stats
   * @returns {Array<Date>}
   */
  getDates(stats) {
    let dates = [];
    for (let stat of stats) {
      let date = new Date(stat.date);
      dates.push(stat.date);
    }
    dates.sort((date1, date2) => {
      return date1 - date2;
    });
    return dates;
  }

  /**
   * Returns scores for a given dataset.
   * @param {Object} stats
   * @returns Array<number>
   */
  getScores(stats) {
    let scores = [];
    for (let stat of stats) {
      scores.push(stat.score * 100);
    }
    return scores;
  }

  /**
   * Returns comments for a given dataset.
   * @param {Object} stats
   * @returns Array<string>
   */
  getComments(stats) {
    let comments = [];
    for (let stat of stats) {
      comments.push(stat.comment);
    }
    return comments;
  }

  /**
   * Renders chart in panel for a given dataset.
   * @param {Object} stats
   */
  drawChart(stats) {
    const customTooltips = function(tooltip) {

      // Tooltip Element
      let tooltipEl = document.getElementById('chartjs-tooltip');
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        // TODO: Use mustache templating.
        tooltipEl.innerHTML = '<div class=\'chart-tooltip\'></div>';
        this._chart.canvas.parentNode.appendChild(tooltipEl);
      }

      // Hides if no tooltip is available.
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      // Sets caret position.
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (tooltip.yAlign) {
        tooltipEl.classList.add(tooltip.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }
      function getBody(bodyItem) {
        return bodyItem.lines;
      }

      // Sets text.
      if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(getBody);
        // TODO: Use mustache templating.
        let innerHtml = '';
        titleLines.forEach(function(title) {
          innerHtml += '' + title + '';
        });
        innerHtml += '';
        bodyLines.forEach((body, i) => {
          const colors = tooltip.labelColors[i];
          // TODO: Use CSS classes.
          let style = 'background:red';
          style += '; border-width: 2px';
          const span = '';
          innerHtml += '' + span + body + '';
        });
        innerHtml += '';
        const tableRoot = tooltipEl.querySelector('.chart-tooltip');
        tableRoot.innerHTML = innerHtml;
      }
      const positionY = this._chart.canvas.offsetTop;
      const positionX = this._chart.canvas.offsetLeft;
      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      let leftPosition = positionX + tooltip.caretX;

      // Prevent rendering tooltip off the edges
      if (leftPosition > 725) {
        leftPosition = 725;
      } else if (leftPosition < 115) {
        leftPosition = 115;
      }

      tooltipEl.style.left = leftPosition + 'px';
      let topPosition = ((positionY + tooltip.caretY) < 200) ?
          200 + 160 :
          positionY + tooltip.caretY;
      tooltipEl.style.top = topPosition + 'px';
      tooltipEl.style.fontFamily = tooltip._fontFamily;
      tooltipEl.style.fontSize = tooltip.fontSize;
      tooltipEl.style.fontStyle = tooltip._fontStyle;
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.pointerEvents = 'none';
    };

    /**
     * Updates current highlighted comment with given text (useful for
     * debugging).
     * @param {string} text
     */
    const updateCurrentComment = () => {
      const currentCommentElement =
          document.getElementsByClassName('current-comment')[0];
      currentCommentElement.textContent = text;
    }

    const toxicGraph = document.getElementById('toxicGraph');
    let toxicGraphCtx = toxicGraph.getContext('2d');

    this.chart = new Chart(toxicGraphCtx, {
      type: 'line',
      fillOpacity: .3,
      data: {
        labels: this.getDates(stats),
        datasets: [{
          label: '',
          comments: this.getComments(stats),
          data: this.getScores(stats),
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
          pointRadius: 4,
          pointHitRadius: 5,
          pointBorderColor: '#FB757C',
          pointBackgroundColor: '#FB757C',
          showLine: false,
        }]
      },
      // TODO break up config into smaller objects.
      options: {
        events: ['mousemove', 'click'],
        hover: {
          onHover: function(evt, points) {
            if (points.length > 0 && evt.type === 'mousemove') {
              toxicGraph.classList.add('hover');
            } else if (points.length > 0 && evt.type === 'click') {
              // tooltipEl.style.opacity = 1;
            } else {
              toxicGraph.classList.remove('hover');
            }
          },
        },
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              maxTicksLimit: 3,
              fontColor: '#706F6B',
              fontFamily: 'Roboto'
            },
            scaleLabel: {
              display: true,
              labelString: 'Toxicity (%)',
              fontColor: '#706F6B'
            },
            gridLines: {color: 'rgba(0, 0, 0, 0)', zeroLineColor: '#FB757C'}
          }],
          xAxes: [{
            type: 'time',
            time: {unit: 'hour'},
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
              fontColor: '#706F6B',
              fontFamily: 'Roboto',
              callback: function(value, index, values) {
                if (values && values[index]) {
                  return values[index].hours() + ':00';
                }

              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Date',
              fontColor: '#706F6B',
            },
            gridLines: {color: 'rgba(0, 0, 0, 0)', zeroLineColor: '#FB757C'}
          }]
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
          custom: customTooltips,
          callbacks: {
            title: function(tooltipItem, data) {
              const score = parseFloat(tooltipItem[0].yLabel).toFixed(2);
              const date = new Date(tooltipItem[0].xLabel);

              let className = 'graph-high';
              if (score < 33) {
                className = 'graph-low';
              } else if (score < 66) {
                className = 'graph-moderate';
              }
              // TODO Use Mustache templating.
              return '<div class="' + className +
                  ' graph-date"><div class="chart-date">' + date.getDate() +
                  '/' + (date.getMonth() + 1) + '/' + date.getFullYear() +
                  '</div><div class="chart-time">' + date.getHours() + ':' +
                  date.getMinutes() + '</div></div>';
            },
            label: function(tooltipItem, data) {
              const score = parseFloat(tooltipItem.yLabel).toFixed(2);

              let className = 'graph-high';
              if (score < 33) {
                className = 'graph-low';
              } else if (score < 66) {
                className = 'graph-moderate';
              }

              const currentComment =
                  data.datasets[0].comments[tooltipItem.index];
              // Shows current comment (useful for debugging).
              // updateCurrentComment(currentComment);

              // TODO Use Mustache templating.
              return '<div class="graph-score ' + className + '">' +
                  parseFloat(tooltipItem.yLabel).toFixed(0) +
                  '<span class="small-text">%</span><div class="graph-tooltip-title">Toxicity</div></div><div class="tooltip-comment">' +
                  currentComment + '</div>';
            }
          },
        }
      }
    });
  }
}
