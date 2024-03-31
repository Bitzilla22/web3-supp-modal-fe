document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  // Get current date
  const currentDate = new Date();

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get month and day
  const month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate();

  // Format the date
  const formattedDate = month + " " + day;

  document.querySelector("#show-date").textContent = formattedDate;
});
