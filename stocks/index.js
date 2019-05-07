
async function main() {



  //TODO wait for on ready and set RESPONSIVEPAPER Ready
  let response = await fetch("assets/data.json");
  response = await response.json();

  Chart.plugins.unregister(ChartDataLabels)



  var source = document.getElementById("reportTemplate").innerHTML;
  var template = Handlebars.compile(source);
  console.log(response)
  var html = template(response);
  document.getElementsByClassName('rjs-page')[0].innerHTML = html

  const numberEls = document.querySelectorAll('[data-number-format]')
  const percentageEls = document.querySelectorAll('[data-percentage-format]')
  const averageEls = document.querySelectorAll('[data-average-format]')
  const averageScoreTrendChartEls = document.querySelectorAll('[data-average-score-trend-chart]')
  const scorePeerTrendChartEls = document.querySelectorAll('.average-score-peer-trend-chart')
  const volumesChartEls = document.querySelectorAll('.scores-volume-chart')
  const pricesChartEls = document.querySelectorAll('.scores-price-chart')
  const averageScoreIndicatorChartEls = document.querySelectorAll('[data-average-score-indicator-chart]')


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
window.onload = function () {
  main()
}