  const monthYear = document.getElementById("monthYear");
  const calendarBody = document.getElementById("calendar_body");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentDate = new Date(); // Oktober 2025 (Monate: 0=Jan, 9=Okt)

  function renderCalendar(date) {
    calendarBody.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startDay = (firstDay === 0 ? 6 : firstDay - 1);

    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement("div");
      calendarBody.appendChild(emptyCell);
    }


    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.classList.add("day");
      cell.textContent = day;
      calendarBody.appendChild(cell);
    }
  }

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Initial render
  renderCalendar(currentDate);