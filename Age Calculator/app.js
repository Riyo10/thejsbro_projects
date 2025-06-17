let doughnutChart, barChart;

function calculateAge() {
  const dobInput = document.getElementById("dob").value;
  if (!dobInput) return;

  const dob = new Date(dobInput);
  const now = new Date();

  const ageMS = now - dob;
  const ageDate = new Date(ageMS);

  const years = ageDate.getUTCFullYear() - 1970;
  const months = ageDate.getUTCMonth();
  const days = ageDate.getUTCDate() - 1;

  const totalDays = Math.floor(ageMS / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(ageMS / (1000 * 60 * 60));
  const totalMinutes = Math.floor(ageMS / (1000 * 60));
  const totalSeconds = Math.floor(ageMS / 1000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  document.getElementById("ageText").innerHTML = `
    You are <strong>${years} years</strong>, 
    <strong>${months} months</strong>, 
    and <strong>${days} days</strong> old.<br>
    That's <strong>${totalMonths}</strong> months, 
    <strong>${totalWeeks}</strong> weeks, 
    <strong>${totalDays}</strong> days, 
    <strong>${totalHours}</strong> hours, 
    <strong>${totalMinutes}</strong> minutes, 
    and <strong>${totalSeconds}</strong> seconds lived.
  `;

  // Next birthday countdown
  let nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const diff = nextBirthday - now;
  const daysToNextBday = Math.ceil(diff / (1000 * 60 * 60 * 24));
  document.getElementById("nextBirthday").innerText = `🎉 Your next birthday is in ${daysToNextBday} day(s)!`;

  // Charts
  updateCharts({ years, months, days, totalDays, totalWeeks, totalMonths });
}

function updateCharts(data) {
  const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");
  const barCtx = document.getElementById("barChart").getContext("2d");

  if (doughnutChart) doughnutChart.destroy();
  if (barChart) barChart.destroy();

  doughnutChart = new Chart(doughnutCtx, {
    type: "doughnut",
    data: {
      labels: ["Years", "Months", "Days"],
      datasets: [{
        data: [data.years, data.months, data.days],
        backgroundColor: ["#4bc0c0", "#ff6384", "#36a2eb"],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Age Distribution",
          color: "#333"
        },
        legend: { labels: { color: "#000" } }
      }
    }
  });

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Months", "Weeks", "Days"],
      datasets: [{
        label: "Total",
        data: [data.totalMonths, data.totalWeeks, data.totalDays],
        backgroundColor: ["#ffcd56", "#36a2eb", "#ff6384"]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Lifespan Breakdown",
          color: "#333"
        },
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: "#000" } },
        y: { ticks: { color: "#000" } }
      }
    }
  });
}
