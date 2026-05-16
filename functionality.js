var cursor = document.getElementById('cursor');

document.addEventListener('mousemove', function(e) {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});

document.addEventListener('mousedown', function() {
  cursor.classList.add('active');
});

document.addEventListener('mouseup', function() {
  cursor.classList.remove('active');
});


function buildMiniChart() {
  var ctx = document.getElementById('miniChart1');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      datasets: [{
        data: [1100, 1150, 1200, 1280, 1350, 1450],
        borderColor: '#ccff00',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        backgroundColor: 'rgba(204,255,0,0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}


function buildPriceChart() {
  var ctx = document.getElementById('priceChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Median Price (R\'000)',
        data: [980, 1010, 1050, 1080, 1120, 1100, 1180, 1220, 1260, 1300, 1350, 1420],
        borderColor: '#ccff00',
        backgroundColor: 'rgba(204,255,0,0.08)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#ccff00',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}


function buildSuburbChart() {
  var ctx = document.getElementById('suburbChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Flora Park', 'Bendor', 'Penina Park', 'Ivy Park', 'Thornhill'],
      datasets: [{
        label: 'Sales',
        data: [38, 27, 52, 21, 15],
        backgroundColor: [
          'rgba(204,255,0,0.7)',
          'rgba(0,240,255,0.7)',
          'rgba(204,255,0,0.5)',
          'rgba(0,240,255,0.4)',
          'rgba(112,0,255,0.5)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}


function buildTypeChart() {
  var ctx = document.getElementById('typeChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Freehold', 'Sectional Title', 'Townhouse', 'Vacant Land'],
      datasets: [{
        data: [62, 21, 11, 6],
        backgroundColor: ['#ccff00', '#00f0ff', 'rgba(204,255,0,0.4)', 'rgba(0,240,255,0.3)'],
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255,255,255,0.6)',
            font: { size: 11 },
            padding: 12
          }
        }
      }
    }
  });
}


var suburbPrices = {
  flora:   { base: 1200, growth: 1.12 },
  bendor:  { base: 2200, growth: 1.10 },
  penina:  { base: 850,  growth: 1.16 },
  ivypark: { base: 1500, growth: 1.08 }
};

var bedroomMultiplier = { '1': 0.6, '2': 0.8, '3': 1.0, '4': 1.25, '5': 1.5 };

var conditionMultiplier = {
  excellent: 1.1,
  good:      1.0,
  average:   0.9,
  renovate:  0.75
};

function formatRands(value) {
  if (value >= 1000000) {
    return 'R' + (value / 1000000).toFixed(2) + 'M';
  }
  return 'R' + Math.round(value).toLocaleString('en-ZA');
}

function calculateValuation() {
  var suburb    = document.getElementById('suburb').value;
  var propType  = document.getElementById('propType').value;
  var bedrooms  = document.getElementById('bedrooms').value;
  var size      = parseFloat(document.getElementById('size').value) || 150;
  var erfSize   = parseFloat(document.getElementById('erfSize').value) || 500;
  var condition = document.getElementById('condition').value;

  if (!suburb || !propType) {
    alert('Please select a suburb and property type.');
    return;
  }

  var data = suburbPrices[suburb] || { base: 1200, growth: 1.1 };

  var sizeFactor  = 1 + (size - 150) / 1000;
  var erfFactor   = 1 + (erfSize - 500) / 5000;
  var estimate    = data.base * 1000
                  * bedroomMultiplier[bedrooms]
                  * conditionMultiplier[condition]
                  * sizeFactor
                  * erfFactor;

  var low  = estimate * 0.90;
  var high = estimate * 1.12;

  document.getElementById('estimateValue').textContent = formatRands(estimate);
  document.getElementById('rangeLow').textContent      = formatRands(low);
  document.getElementById('rangeMid').textContent      = formatRands(low) + ' – ' + formatRands(high);
  document.getElementById('rangeHigh').textContent     = formatRands(high);

  var panel = document.getElementById('resultPanel');
  panel.classList.remove('active');
  setTimeout(function() { panel.classList.add('active'); }, 10);
}


function submitForm() {
  var name  = document.getElementById('contactName').value.trim();
  var email = document.getElementById('contactEmail').value.trim();

  if (!name || !email) {
    alert('Please enter your name and email address.');
    return;
  }

  alert('Thanks ' + name + '! We\'ll be in touch shortly.');
}


document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  buildMiniChart();
  buildPriceChart();
  buildSuburbChart();
  buildTypeChart();
});