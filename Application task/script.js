var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var tasksData = null; // Replace 'any' with the appropriate data type for tasksData
var filteredTasks = []; // Replace 'any[]' with the appropriate data type for filteredTasks
var sortOrder = "default";
var sortButtonClicked = false;
function fetchTasks(searchQuery) {
    if (searchQuery === void 0) { searchQuery = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var res, jsonData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (tasksData) {
                        return [2 /*return*/, tasksData];
                    }
                    return [4 /*yield*/, fetch("./data.json")];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    jsonData = _a.sent();
                    tasksData = jsonData.tasks;
                    return [2 /*return*/, tasksData];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    tasksData = [];
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleSearch() {
    var searchInput = document.getElementById("searchInput");
    var searchQuery = searchInput.value.trim().toLowerCase();
    if (!searchQuery) {
        filteredTasks = [];
        renderTasks(tasksData);
        return;
    }
    filteredTasks = tasksData.filter(function (task) {
        return task.name.toLowerCase().split(" ").some(function (word) { return word.startsWith(searchQuery); });
    });
    renderTasks(filteredTasks);
}
document.getElementById("searchInput").addEventListener("input", handleSearch);
function initialize() {
    return __awaiter(this, void 0, void 0, function () {
        var data, defaultItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchTasks()];
                case 1:
                    data = _a.sent();
                    tasksData = data;
                    renderTasks(tasksData);
                    defaultItem = tasksData.find(function (item) { return item.name === "Display date"; });
                    if (defaultItem) {
                        highlightItem(defaultItem.id);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function renderTasks(tasks) {
    var ulElement = document.querySelector("#list");
    ulElement.innerHTML = "";
    if (!Array.isArray(tasks) || tasks.length === 0) {
        ulElement.innerHTML = "<li>No tasks found.</li>";
        return;
    }
    tasks.forEach(function (task) {
        var escapedName = escapeHTML(task.name);
        var markup = "<li class=\"selectedItem\"><a href=\"#\" path=\"".concat(task.pathname, "\" class=\"sidebar\" id=\"").concat(task.id, "\">").concat(escapedName, "</a></li>");
        ulElement.insertAdjacentHTML("beforeend", markup);
    });
    var sidebarLinks = document.querySelectorAll(".sidebar");
    sidebarLinks.forEach(function (link) {
        link.addEventListener("click", handleLinkClick);
    });
    showList();
    if ((sortOrder === "default" || sortOrder === "ascending") && tasks.length > 0) {
        loadTaskContent(tasks[0].pathname);
        highlightSelectedLink(sidebarLinks[0]);
    }
}
function handleLinkClick(event) {
    return __awaiter(this, void 0, void 0, function () {
        var path, selectedItemId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    path = event.target.getAttribute("path");
                    if (!path) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadTaskContent(path)];
                case 1:
                    _a.sent();
                    highlightSelectedLink(event.target);
                    selectedItemId = event.target.id;
                    highlightItem(selectedItemId);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function loadTaskContent(path) {
    var iframe = document.querySelector("#taskFrame");
    if (path) {
        iframe.src = "tasks/".concat(path);
    }
    else {
        iframe.src = "";
    }
}
function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
function hideList() {
    var ulElement = document.querySelector("#list");
    ulElement.innerHTML = "";
}
function showList() {
    var ulElement = document.querySelector("#list");
    ulElement.style.display = "block";
}
function highlightSelectedLink(linkElement) {
    var sidebarLinks = document.querySelectorAll(".sidebar");
    sidebarLinks.forEach(function (link) {
        link.classList.remove("active");
    });
    linkElement.classList.add("active");
}
function sortTasks() {
    if (sortOrder === "default") {
        sortOrder = "ascending";
    }
    else if (sortOrder === "ascending") {
        sortOrder = "descending";
    }
    else {
        sortOrder = "default";
    }
    var sortButton = document.getElementById("sortButton");
    toggleIcon();
    if (sortOrder === "default") {
        renderTasks(tasksData);
        sortButtonClicked = false;
        if (tasksData.length > 0) {
            loadTaskContent(tasksData[0].pathname);
            highlightSelectedLink(document.getElementById(tasksData[0].id));
        }
    }
    else {
        var sortedTasks = filteredTasks.length === 0 ? tasksData.slice() : filteredTasks.slice();
        sortedTasks.sort(function (a, b) {
            return sortOrder === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        renderTasks(sortedTasks);
        sortButtonClicked = true;
        if (sortedTasks.length > 0) {
            loadTaskContent(sortedTasks[0].pathname);
            highlightSelectedLink(document.getElementById(sortedTasks[0].id));
        }
    }
}
function highlightItem(itemId) {
    var sidebarLinks = document.querySelectorAll(".sidebar");
    sidebarLinks.forEach(function (link) {
        link.classList.remove("active");
    });
    var selectedLink = document.getElementById(itemId);
    if (selectedLink) {
        selectedLink.classList.add("active");
    }
}
function toggleIcon() {
    var sortButton = document.getElementById("sortButton");
    var upIcon = sortButton.querySelector(".fa-chevron-up");
    var downIcon = sortButton.querySelector(".fa-chevron-down");
    if (sortOrder === "default") {
        upIcon.style.display = "none";
        downIcon.style.display = "inline-block";
        sortButton.style.backgroundColor = "grey";
    }
    else if (sortOrder === "ascending") {
        upIcon.style.display = "inline-block";
        downIcon.style.display = "none";
        sortButton.style.backgroundColor = "orange";
    }
    else {
        upIcon.style.display = "none";
        downIcon.style.display = "inline-block";
        sortButton.style.backgroundColor = "orange";
    }
}
document.getElementById("sortButton").addEventListener("click", sortTasks);
initialize();
