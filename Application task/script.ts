interface Task {
  id: string;
  name: string;
  pathname: string;
}

let tasksData: Task[] | null = null;
let filteredTasks: Task[] = [];
let sortOrder: "default" | "ascending" | "descending" = "default";
let sortButtonClicked = false;

async function fetchTasks(searchQuery: string = ""): Promise<Task[]> {
  try {
    if (tasksData) {
      return tasksData;
    }

    const res = await fetch("./data.json");
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonData = await res.json();
    tasksData = jsonData.tasks;
    return tasksData;
  } catch (error) {
    console.log(error);
    tasksData = [];
    return [];
  }
}

function handleSearch() {
  const searchInput = document.getElementById("searchInput") as HTMLInputElement;
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (!searchQuery) {
    filteredTasks = [];
    renderTasks(tasksData);
    return;
  }

  filteredTasks = tasksData.filter((task) => {
    return task.name
      .toLowerCase()
      .split(" ")
      .some((word) => word.startsWith(searchQuery));
  });

  renderTasks(filteredTasks);
}

document.getElementById("searchInput")?.addEventListener("input", handleSearch);

async function initialize() {
  const data = await fetchTasks();
  tasksData = data;
  renderTasks(tasksData);

  const defaultItem = tasksData.find((item) => item.name === "Display date");
  if (defaultItem) {
    highlightItem(defaultItem.id);
  }
}

function renderTasks(tasks: Task[]) {
  const ulElement = document.querySelector("#list") as HTMLUListElement;
  ulElement.innerHTML = "";

  if (!Array.isArray(tasks) || tasks.length === 0) {
    ulElement.innerHTML = "<li>No tasks found.</li>";
    return;
  }

  tasks.forEach((task) => {
    const escapedName = escapeHTML(task.name);
    const markup = `<li class="selectedItem"><a href="#" path="${task.pathname}" class="sidebar" id="${task.id}">${escapedName}</a></li>`;
    ulElement.insertAdjacentHTML("beforeend", markup);
  });

  const sidebarLinks = document.querySelectorAll(".sidebar");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });

  showList();

  if (
    (sortOrder === "default" || sortOrder === "ascending") &&
    tasks.length > 0
  ) {
    loadTaskContent(tasks[0].pathname);
    highlightSelectedLink(sidebarLinks[0] as HTMLAnchorElement);
  }
}

async function handleLinkClick(event: Event) {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const path = target.getAttribute("path");
  if (path) {
    await loadTaskContent(path);
    highlightSelectedLink(target as HTMLAnchorElement);
    const selectedItemId = target.id;
    highlightItem(selectedItemId);
  }
}

function loadTaskContent(path: string | null) {
  const iframe = document.querySelector("#taskFrame") as HTMLIFrameElement;
  if (path) {
    iframe.src = `tasks/${path}`;
  } else {
    iframe.src = "";
  }
}

function escapeHTML(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function hideList() {
  const ulElement = document.querySelector("#list") as HTMLUListElement;
  ulElement.innerHTML = "";
}

function showList() {
  const ulElement = document.querySelector("#list") as HTMLUListElement;
  ulElement.style.display = "block";
}

function highlightSelectedLink(linkElement: HTMLAnchorElement) {
  const sidebarLinks = document.querySelectorAll(".sidebar");
  sidebarLinks.forEach((link) => {
    link.classList.remove("active");
  });
  linkElement.classList.add("active");
}

function sortTasks() {
  if (sortOrder === "default") {
    sortOrder = "ascending";
  } else if (sortOrder === "ascending") {
    sortOrder = "descending";
  } else {
    sortOrder = "default";
  }

  const sortButton = document.getElementById("sortButton") as HTMLElement;
  toggleIcon();

  if (sortOrder === "default") {
    renderTasks(tasksData!);
    sortButtonClicked = false;
    if (tasksData!.length > 0) {
      loadTaskContent(tasksData![0].pathname);
      highlightSelectedLink(document.getElementById(tasksData![0].id) as HTMLAnchorElement);
    }
  } else {
    const sortedTasks =
      filteredTasks.length === 0 ? tasksData!.slice() : filteredTasks.slice();
    sortedTasks.sort((a, b) =>
      sortOrder === "ascending"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    renderTasks(sortedTasks);
    sortButtonClicked = true;
    if (sortedTasks.length > 0) {
      loadTaskContent(sortedTasks[0].pathname);
      highlightSelectedLink(document.getElementById(sortedTasks[0].id) as HTMLAnchorElement);
    }
  }
}

function highlightItem(itemId: string) {
  const sidebarLinks = document.querySelectorAll(".sidebar");
  sidebarLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const selectedLink = document.getElementById(itemId) as HTMLAnchorElement | null;
  if (selectedLink) {
    selectedLink.classList.add("active");
  }
}

function toggleIcon() {
  const sortButton = document.getElementById("sortButton") as HTMLElement;
  const upIcon = sortButton.querySelector(".fa-chevron-up") as HTMLElement;
  const downIcon = sortButton.querySelector(".fa-chevron-down") as HTMLElement;

  if (sortOrder === "default") {
    upIcon.style.display = "none";
    downIcon.style.display = "inline-block";
    sortButton.style.backgroundColor = "grey";
  } else if (sortOrder === "ascending") {
    upIcon.style.display = "inline-block";
    downIcon.style.display = "none";
    sortButton.style.backgroundColor = "orange";
  } else {
    upIcon.style.display = "none";
    downIcon.style.display = "inline-block";
    sortButton.style.backgroundColor = "orange";
  }
}

document.getElementById("sortButton")?.addEventListener("click", sortTasks);

initialize();

