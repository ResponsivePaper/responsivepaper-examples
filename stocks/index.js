function ViewModel() {
  this.formatCharts = function () {

    const self = this

    Chart.plugins.unregister(ChartDataLabels)

    const averageScoreTrendChartEls = document.querySelectorAll('[data-average-score-trend-chart]')
    const scorePeerTrendChartEls = document.querySelectorAll('.average-score-peer-trend-chart')
    const volumesChartEls = document.querySelectorAll('.scores-volume-chart')
    const pricesChartEls = document.querySelectorAll('.scores-price-chart')
    const averageScoreIndicatorChartEls = document.querySelectorAll('[data-average-score-indicator-chart]')

    function getCompanyData(peerName) {
      return self.companies.find((comp) => comp.peerName === peerName)
    }

    function getScoreValueType(currentValue) {
      let valueType

      if (currentValue == null) {
        return null
      }

      if (currentValue >= 8) {
        valueType = 'Positive'
      } else if (currentValue >= 4 && currentValue <= 7) {
        valueType = 'Neutral'
      } else if (currentValue >= 1 && currentValue <= 3) {
        valueType = 'Negative'
      } else {
        valueType = 'NoRating'
      }

      return valueType
    }

    function getDatasetForAverageScoreTrend(scores) {
      return {
        labels: scores.map((s) => s.month),
        datasets: [{
          label: 'Filled',
          backgroundColor: 'rgba(47, 124, 186, 0.7)',
          borderColor: '#2F7CBA',
          data: scores.map((s) => s.value),
          fill: 'start'
        }]
      }
    }

    function getDatasetForVolumes(volumes, byPastYears) {
      const dateParts = self.exchangeDateStr.split('-')
      const year = parseInt(dateParts[0], 10)
      const targetYear = year - byPastYears
      const targetMonth = Math.min(parseInt(dateParts[1], 10) + 1, 12)

      const selectedVolumes = volumes.filter((v) => {
        const cYear = parseInt(v.week.split('-')[0], 10)
        const cMonth = parseInt(v.week.split('-')[1], 10)

        return (
          (cYear === targetYear && cMonth >= targetMonth) ||
          (cYear > targetYear)
        )
      })

      return {
        labels: selectedVolumes.map((v) => v.week),
        datasets: [{
          label: 'Volume',
          backgroundColor: 'rgba(246, 168, 0, 0.4)',
          borderColor: 'rgb(246, 168, 0)',
          data: selectedVolumes.map((v) => v.value),
          fill: 'start'
        }]
      }
    }

    function getDatasetForPrices(prices, byPastYears) {
      const dateParts = self.exchangeDateStr.split('-')
      const year = parseInt(dateParts[0], 10)
      const targetYear = year - byPastYears
      const targetMonth = Math.min(parseInt(dateParts[1], 10) + 1, 12)

      const selectedPrices = prices.filter((p) => {
        const cYear = parseInt(p.week.split('-')[0], 10)
        const cMonth = parseInt(p.week.split('-')[1], 10)

        return (
          (cYear === targetYear && cMonth >= targetMonth) ||
          (cYear > targetYear)
        )
      })

      return {
        labels: selectedPrices.map((p) => p.week),
        datasets: [{
          label: 'Price',
          backgroundColor: 'rgba(144, 144, 144, 0.5)',
          data: selectedPrices.map((p) => p.value)
        }]
      }
    }

    function getDatasetForAverageScoreIndicator() {
      return {
        labels: ['Earnings', 'Fundamental', 'Relative Valuation', 'Risk', 'Price Momentum', 'Insider Trading'],
        datasets: [{
          label: 'Score NoRating',
          backgroundColor: '#DCDCDC',
          data: [-1, -1, -1, -1, -1, -1]
        }, {
          label: 'Score Negative',
          backgroundColor: '#BABABA',
          data: [3, 3, 3, 3, 3, 3]
        }, {
          label: 'Score Neutral',
          backgroundColor: '#F7B600',
          data: [4, 4, 4, 4, 4, 4]
        }, {
          label: 'Score Positive',
          backgroundColor: '#ED8C00',
          data: [3, 3, 3, 3, 3, 3]
        }]
      }
    }
    averageScoreTrendChartEls.forEach((el) => {
      const currentMainPeerName = el.dataset.mainPeerName
      const companyData = getCompanyData(currentMainPeerName)

      if (!companyData) {
        return
      }

      const scores = companyData.scoresByMonth

      if (!scores) {
        return
      }

      const averageScoreTrendChrt = new Chart(el.getContext('2d'), {
        type: 'line',
        data: getDatasetForAverageScoreTrend(scores),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                fontColor: '#000',
                fontSize: 10,
                maxTicksLimit: 3,
                maxRotation: 0
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: 0,
                max: 10,
                stepSize: 5,
                fontColor: '#000',
                fontSize: 10,
                callback: (label, index) => {
                  if (label >= 8) {
                    return 'Positive'
                  } else if (label >= 4 && label <= 7) {
                    return 'Neutral'
                  } else {
                    return 'Negative'
                  }
                }
              }
            }, {
              display: true,
              ticks: {
                min: 0,
                max: 10,
                stepSize: 5,
                fontColor: '#000',
                fontSize: 10,
                callback: (label, index) => {
                  if (label >= 4 && label <= 7) {
                    return ''
                  }

                  return null
                }
              },
              gridLines: {
                drawTicks: false,
                drawBorder: false,
                lineWidth: 2,
                borderDash: [4, 4],
                color: '#CC890B'
              }
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 6
            }
          },
          title: {
            display: true,
            text: 'Average Score Trend (4 Week Moving Avg)',
            fontSize: 12,
            fontColor: '#000'
          },
          legend: {
            display: false
          }
        },
        plugins: [{
          // plugin for 2 background-color on chart
          beforeDraw: (chart) => {
            const helpers = Chart.helpers
            const ctx = chart.chart.ctx
            const chartArea = chart.chartArea
            const firstBgSize = 20

            ctx.save();
            ctx.fillStyle = '#EAEAEA';
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.top + firstBgSize)
            ctx.fillStyle = '#F6F6F6';
            ctx.fillRect(chartArea.left, chartArea.top + firstBgSize, chartArea.right - chartArea.left, chartArea.bottom - (chartArea.top + firstBgSize))
            ctx.restore()
          }
        }]
      })

    })

    scorePeerTrendChartEls.forEach((el) => {
      const currentMainPeerName = el.dataset.mainPeerName
      const currentPeer = el.dataset.peerName
      const companyData = getCompanyData(currentMainPeerName)

      if (!companyData) {
        return
      }

      const scoresByPeer = companyData.scoresByPeer

      if (!scoresByPeer) {
        return
      }

      const chart = new Chart(el.getContext('2d'), {
        type: 'line',
        data: getDatasetForAverageScoreTrend(scoresByPeer[currentPeer]),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          scales: {
            xAxes: [{
              display: false,
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              display: false,
              gridLines: {
                display: false
              }
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 5,
              hoverRadius: 4
            }
          },
          title: {
            display: false
          },
          legend: {
            display: false
          }
        }
      })
    })

    volumesChartEls.forEach((el) => {
      const currentMainPeerName = el.dataset.mainPeerName
      const currentPeer = el.dataset.peerName
      const companyData = getCompanyData(currentMainPeerName)

      if (!companyData) {
        return
      }

      const pricesByWeek = companyData.pricesByWeek
      const volumesByWeek = companyData.volumesByWeek

      if (!pricesByWeek || !volumesByWeek) {
        return
      }

      const byPastYears = parseInt(el.dataset.pastYears, 10)
      const stepSize = el.dataset.stepSize != null ? parseInt(el.dataset.stepSize, 10) : 2

      const priceData = getDatasetForPrices(pricesByWeek, byPastYears).datasets[0].data

      const priceReturnPercentage = (priceData[priceData.length - 1] - priceData[0]) / priceData[0]

      const chart = new Chart(el.getContext('2d'), {
        type: 'line',
        data: getDatasetForVolumes(volumesByWeek, byPastYears),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          scales: {
            xAxes: [{
              ticks: {
                fontColor: 'transparent'
              },
              gridLines: {
                display: true,
                color: '#fff',
                borderDash: [2, 2]
              }
            }],
            yAxes: [{
              ticks: {
                fontColor: '#7C7C7C',
                fontSize: 10,
                stepSize
              },
              gridLines: {
                display: true,
                color: '#fff',
                borderDash: [2, 2]
              }
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 5,
              hoverRadius: 4
            }
          },
          title: {
            display: true,
            text: `${byPastYears}-Year Return: ${numbro(priceReturnPercentage).format({ output: 'percent', mantissa: 1, trimMantissa: true })}`,
            fontSize: 12,
            fontColor: '#000'
          },
          legend: {
            display: false
          }
        },
        plugins: [{
          // plugin for background-color on chart
          beforeDraw: (chart) => {
            const helpers = Chart.helpers
            const ctx = chart.chart.ctx
            const chartArea = chart.chartArea
            const firstBgSize = 20

            ctx.save();
            ctx.fillStyle = '#EAEAEA';
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top)
            ctx.restore()
          }
        }]
      })
    })

    pricesChartEls.forEach((el) => {
      const currentMainPeerName = el.dataset.mainPeerName
      const currentPeer = el.dataset.peerName
      const companyData = getCompanyData(currentMainPeerName)

      if (!companyData) {
        return
      }

      const pricesByWeek = companyData.pricesByWeek

      if (!pricesByWeek) {
        return
      }

      const byPastYears = parseInt(el.dataset.pastYears, 10)
      const maxPriceTick = el.dataset.maxPriceTick != null ? parseInt(el.dataset.maxPriceTick, 10) : 2000
      const noMonthsAxe = el.dataset.noMonthsAxe != null ? Boolean(el.dataset.noMonthsAxe) : false

      const yearsRendered = {}

      const MONTHS_MAP = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      }

      const inputData = getDatasetForPrices(pricesByWeek, byPastYears)

      const monthsByYear = inputData.labels.reduce((acu, l) => {
        const dateParts = l.split('-')
        const year = dateParts[0]
        const month = dateParts[1]

        acu[year] = acu[year] || []

        if (!acu[year].includes(month)) {
          acu[year].push(month)
        }

        return acu
      }, {})

      const xAxes = []

      if (!noMonthsAxe) {
        xAxes.push({
          ticks: {
            fontColor: '#7C7C7C',
            fontSize: 8,
            autoSkip: false,
            callback: (value, index, values) => {
              const dateParts = value.split('-')
              const month = dateParts[1]
              const week = dateParts[2]

              if (MONTHS_MAP[month] != null && week === '1') {
                return `| ${MONTHS_MAP[month]}`
              }

              return null
            },
            maxRotation: 0
          },
          gridLines: {
            display: true,
            color: '#fff',
            borderDash: [2, 2]
          }
        })
      }

      xAxes.push({
        ticks: {
          fontColor: '#7C7C7C',
          fontSize: 8,
          autoSkip: false,
          callback: (value) => {
            const dateParts = value.split('-')
            const year = dateParts[0]
            const month = dateParts[1]
            const week = dateParts[2]
            const totalMonthsForYear = monthsByYear[year].length
            const middleMonthIndex = Math.max(0, Math.floor(totalMonthsForYear / 2) - 1)
            const middleMonth = monthsByYear[year][middleMonthIndex]

            if (monthsByYear[year] != null && month === middleMonth && week === '1') {
              return year
            }

            return null
          },
          maxRotation: 0
        },
        gridLines: {
          display: noMonthsAxe ? true : false,
          color: '#fff',
          borderDash: [2, 2]
        }
      })

      const chart = new Chart(el.getContext('2d'), {
        type: 'bar',
        data: inputData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          scales: {
            xAxes,
            yAxes: [{
              ticks: {
                fontColor: '#7C7C7C',
                fontSize: 10,
                beginAtZero: true,
                stepSize: 1000000,
                callback: (value, index, values) => {
                  if (value === 0 || value === maxPriceTick) {
                    return `${value > 0 ? value / 1000 : value} K`
                  }

                  return null
                }
              },
              gridLines: {
                display: true,
                color: '#fff',
                borderDash: [2, 2]
              }
            }]
          },
          title: {
            display: false
          },
          legend: {
            display: false
          }
        },
        plugins: [{
          // plugin for background-color on chart
          beforeDraw: (chart) => {
            const helpers = Chart.helpers
            const ctx = chart.chart.ctx
            const chartArea = chart.chartArea
            const firstBgSize = 20

            ctx.save();
            ctx.fillStyle = '#EAEAEA';
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top)
            ctx.restore()
          }
        }]
      })
    })

    averageScoreIndicatorChartEls.forEach((el) => {
      const currentMainPeerName = el.dataset.mainPeerName
      const companyData = getCompanyData(currentMainPeerName)

      if (!companyData) {
        return
      }

      const indicatorComponents = companyData.indicatorComponents

      if (!indicatorComponents) {
        return
      }

      const averageScoreIndicatorChrt = new Chart(el.getContext('2d'), {
        type: 'bar',
        data: getDatasetForAverageScoreIndicator(),
        plugins: [ChartDataLabels],
        options: {
          plugins: {
            datalabels: {
              align: (context) => {
                const currentLabel = context.chart.data.labels[context.dataIndex]

                const currentValue = indicatorComponents[currentLabel]
                const currentValueType = getScoreValueType(currentValue)

                if (currentValueType === 'NoRating') {
                  return 'center'
                } else if (currentValueType === 'Negative') {
                  if (currentValue === 1) {
                    return 'bottom'
                  } else if (currentValue === 2) {
                    return 'center'
                  } else {
                    return 'top'
                  }
                } else if (currentValueType === 'Neutral') {
                  if (currentValue === 4) {
                    return 'bottom'
                  } else if (currentValue === 5) {
                    return 'center'
                  } else {
                    return 'top'
                  }
                } else if (currentValueType === 'Positive') {
                  if (currentValue === 8) {
                    return 'bottom'
                  } else if (currentValue === 9) {
                    return 'center'
                  } else {
                    return 'top'
                  }
                }
              },
              color: '#fff',
              backgroundColor: '#205986',
              borderColor: '#205986',
              borderRadius: 3,
              borderWidth: 1,
              font: {
                size: 10
              },
              padding: {
                top: 2,
                bottom: 2,
                left: 12,
                right: 12
              },
              formatter: (value, context) => {
                const currentLabel = context.chart.data.labels[context.dataIndex]

                const valueTypesDataIndexes = {
                  "NoRating": 0,
                  "Negative": 1,
                  "Neutral": 2,
                  "Positive": 3
                }

                const currentValue = indicatorComponents[currentLabel]
                const currentValueType = getScoreValueType(currentValue)
                const currentValueTypeIndex = valueTypesDataIndexes[currentValueType]

                if (context.datasetIndex === currentValueTypeIndex) {
                  if (currentValue === 0) {
                    return 'NR'
                  }

                  return currentValue
                }

                return null
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          scales: {
            xAxes: [{
              display: true,
              position: 'top',
              barPercentage: 0.4,
              ticks: {
                fontColor: '#000',
                fontStyle: 'bold',
                fontSize: 11
              },
              gridLines: {
                display: false
              },
              stacked: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: -1,
                max: 10,
                stepSize: 1,
                fontColor: '#000',
                fontSize: 11,
                padding: 15,
                callback: (label, index, labels) => {
                  if (label === 9) {
                    return 'Positive'
                  } else if (label === 5) {
                    return 'Neutral'
                  } else if (label === 2) {
                    return 'Negative'
                  } else if (label === -1) {
                    return 'No Rating'
                  } else {
                    return ''
                  }
                }
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              stacked: true
            }, {
              display: true,
              position: 'right',
              ticks: {
                min: 0,
                max: 10,
                stepSize: 1,
                fontColor: '#000',
                fontSize: 11,
                padding: 15,
                callback: (label, index, labels) => {
                  if (label === 0) {
                    return 'NR'
                  } else {
                    return label
                  }
                }
              },
              gridLines: {
                display: true,
                color: '#EDEDED',
                lineWidth: 1.5,
                drawBorder: false
              },
              stacked: true
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 6
            }
          },
          title: {
            display: false
          },
          legend: {
            display: false
          }
        }
      })
    })

  }

  this.formatText = function () {
    const numberEls = document.querySelectorAll('[data-number-format]')
    const percentageEls = document.querySelectorAll('[data-percentage-format]')
    const averageEls = document.querySelectorAll('[data-average-format]')
    numberEls.forEach((el) => {
      try {
        const mantissa = el.dataset.mantissa != null ? parseInt(el.dataset.mantissa, 10) : 2
        const trimMantissa = el.dataset.trimMantissa != null ? Boolean(parseInt(el.dataset.trimMantissa, 10)) : true

        el.innerText = numbro(el.innerText).format({
          thousandSeparated: true,
          trimMantissa,
          mantissa
        })
      } catch (err) {
        console.error(err)
      }
    })

    percentageEls.forEach((el) => {
      try {
        const mantissa = el.dataset.mantissa != null ? parseInt(el.dataset.mantissa, 10) : 2
        const trimMantissa = el.dataset.trimMantissa != null ? Boolean(parseInt(el.dataset.trimMantissa, 10)) : true

        el.innerText = numbro(el.innerText).format({
          output: 'percent',
          mantissa,
          trimMantissa
        })
      } catch (err) {
        console.error(err)
      }
    })
    averageEls.forEach((el) => {
      try {
        el.innerText = numbro(el.innerText).format({
          average: true,
          mantissa: 1
        }).toUpperCase()
      } catch (err) {
        console.error(err)
      }
    })


  }
  this.setTocData = function (companies) {
    if (!Array.isArray(companies)) {
      return
    }
    this.tocData = companies.map((item) => {
      return {
        id: item.peerName,
        title: `${item.company.fullName} - ${item.company.abbreviation}`,
        chapters: [{
          id: `${item.peerName}-average-score`,
          title: 'Average Score'
        }, {
          id: `${item.peerName}-highlights`,
          title: 'Highlights'
        }, {
          id: `${item.peerName}-price-volume-charts`,
          title: 'Price and Volume Charts'
        }, {
          id: `${item.peerName}-business-summary`,
          title: 'Business Summary'
        }, {
          id: `${item.peerName}-indicator-components`,
          title: 'Indicator Components'
        }, {
          id: `${item.peerName}-optimized-score`,
          title: 'Optimized Score'
        }, {
          id: `${item.peerName}-peer-analysis`,
          title: 'Peer Analysis'
        }, {
          id: `${item.peerName}-peer-companies`,
          title: 'Peer Companies'
        }]
      }
    })


  }

  this.init = async function () {



    let response = await fetch("assets/data.json");
    response = await response.json();
    var source = document.getElementById("reportTemplate").innerHTML;
    var template = Handlebars.compile(source);
    this.companies = response.companies
    this.setTocData(this.companies)
    this.exchangeDateStr = response.exchangeDate
    var html = template(this);

    document.getElementsByClassName('rp-page')[0].innerHTML = html

    this.formatText()
    this.formatCharts()


    console.log("RESPONSIVE_PAPER_READY_TO_RENDER")
    window.RESPONSIVE_PAPER_READY_TO_RENDER = true;

  }

}

window.onload = function () {
  let vm = new ViewModel()
  vm.init()

}

window.test = function () {
  var source = document.getElementsByClassName('rp-page')[0]
  var sourceCopy = source.cloneNode(true)
}