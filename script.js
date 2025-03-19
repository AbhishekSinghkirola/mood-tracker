/* ------------------------- Nav Tabs Functionality ------------------------- */
const dayTab = document.querySelector("#day-tab");
const weekTab = document.querySelector("#week-tab");
const monthTab = document.querySelector("#month-tab");

const dayView = document.querySelector("#day-view");
const weekView = document.querySelector("#week-view");
const monthView = document.querySelector("#month-view");

dayTab.addEventListener("click", () => {
  dayTab.classList.add("active");
  weekTab.classList.remove("active");
  monthTab.classList.remove("active");

  dayView.classList.add("show-view");
  weekView.classList.remove("show-view");
  monthView.classList.remove("show-view");
});

weekTab.addEventListener("click", () => {
  dayTab.classList.remove("active");
  weekTab.classList.add("active");
  monthTab.classList.remove("active");

  dayView.classList.remove("show-view");
  weekView.classList.add("show-view");
  monthView.classList.remove("show-view");
});

monthTab.addEventListener("click", () => {
  dayTab.classList.remove("active");
  weekTab.classList.remove("active");
  monthTab.classList.add("active");

  dayView.classList.remove("show-view");
  weekView.classList.remove("show-view");
  monthView.classList.add("show-view");
});
/* ------------------------ Intialize Timeline Swiper ----------------------- */
new Swiper(".swiper-container", {
  slidesPerView: 3,
  spaceBetween: 0,
  loop: false,
  navigation: {
    nextEl: ".next-slide",
    prevEl: ".prev-slide",
  },
  grabCursor: true,
});

/* ----------------------- Mood Logging Functionlaity ----------------------- */

const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

const emojiEl = document.querySelectorAll(".emoji");
const updateEmojiBtn = document.querySelector(".update-emoji-btn");

const isSameDate = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
    ? true
    : false;
};

if (
  isSameDate(new Date(moodHistory[moodHistory?.length - 1]?.date), new Date())
) {
  updateEmojiBtn.disabled = true;
  updateEmojiBtn.style.display = "none";

  const todayMoodEl = Array.from(emojiEl).find(
    (emoji) => emoji.src === moodHistory[moodHistory?.length - 1]?.mood
  );

  emojiEl.forEach((emoji) => {
    emoji.classList.remove("today-mood");
  });

  todayMoodEl.classList.add("today-mood");
} else {
  emojiEl.forEach((emoji) => {
    emoji.addEventListener("click", () => {
      emojiEl.forEach((emoji) => {
        emoji.classList.remove("today-mood");
      });
      emoji.classList.add("today-mood");
    });
  });
}

updateEmojiBtn.addEventListener("click", () => {
  const todayMood = document.querySelector(".emoji.today-mood");

  if (
    isSameDate(new Date(moodHistory[moodHistory?.length - 1]?.date), new Date())
  ) {
    alert("You have already logged this mood today!");
  }

  const data = [...moodHistory, { date: new Date(), mood: todayMood.src }];
  localStorage.setItem("moodHistory", JSON.stringify(data));
});

/* ------------------------------ Mood History ------------------------------ */
const dayViewWrapper = document.querySelector("#day-view .swiper-wrapper");
const weekViewWrapper = document.querySelector("#week-view .swiper-wrapper");
const monthViewWrapper = document.querySelector("#month-view .swiper-wrapper");

const renderMoodHistory = (wrapper) => {
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

  const type = wrapper.closest(".view").id;

  if (type === "day-view") {
    if (moodHistory?.length > 1) {
      moodHistory = [moodHistory[moodHistory?.length - 1]];
    }
  } else if (type === "week-view") {
    moodHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    moodHistory = moodHistory.slice(0, 7);
  }

  wrapper.innerHTML = "";

  moodHistory.forEach((mood) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    slide.innerHTML = `
      <div class="timestamp">
        <span class="date">${new Date(mood.date).toLocaleDateString(
          "en-US",
          dateOptions
        )}</span>
      </div>
      <div class="status">
        <img src="${mood.mood}" width="50px" alt="mood"  /> 
      </div>`;

    wrapper.appendChild(slide);
  });
};

renderMoodHistory(dayViewWrapper);
renderMoodHistory(weekViewWrapper);
renderMoodHistory(monthViewWrapper);
