class Leaderboard {
  constructor(url) {
    this.url = url;
    this.data = null;
    this.fetchInterval = 60000; // 1 minute in milliseconds
    this.lastUpdated = new Date();
    this.init();
  }

  init() {
    this.fetchData();
    setInterval(this.fetchData.bind(this), this.fetchInterval);
  }

  fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this.url, true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.data = JSON.parse(xhr.responseText);
        this.updateUI();
        this.lastUpdated = new Date();
      }
    };
    xhr.onerror = () => {
      console.error("An error occurred while fetching data.");
    };
    xhr.send();
  }

  updateUI() {
    // Update order statuses
    document.getElementById("pickingOrders").textContent =
      this.data.order_status.picking;
    document.getElementById("packingOrders").textContent =
      this.data.order_status.packing;
    document.getElementById("idleOrders").textContent =
      this.data.order_status.idle;

    // Get the leaderboard table body
    const tableBody = document.getElementById("leaderboardTable");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Populate the leaderboard table
    this.data.employees.sort((a, b) => b.total_tasks - a.total_tasks);
    this.data.employees.forEach((employee, index) => {
      const row = tableBody.insertRow();

      // Rank
      const rankCell = row.insertCell(0);
      rankCell.innerHTML = `
        <div class="rank">
          #${index + 1}
        </div>
      `;

      // User (photo + name)
      const userCell = row.insertCell(1);
      userCell.innerHTML = `
            <div class="user-info">
                <div class="img-wrapper">
                  <img src="${employee.photo}" alt="${employee.name}">
                </div>
                ${employee.name}
            </div>
        `;

      // // Total score
      // const scoreCell = row.insertCell(2);
      // scoreCell.textContent = employee.total_tasks;
    });
    document.getElementById("updateTime").querySelector("span").textContent =
      this.getFormattedUpdateTime();
  }
  getFormattedUpdateTime() {
    const hours = this.lastUpdated.getHours().toString().padStart(2, "0");
    const minutes = this.lastUpdated.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}

// Instantiate the class with the path to your JSON data
const leaderboard = new Leaderboard("./data.json");
