const noteContainer = document.getElementById("note-container");
const createNoteButton = document.getElementById("create-note-button");

const colors = ["pink", "lime", "purple", "beige", "blue", "orange", "green", "yellow"];

const actions = {
  createNote: () => {
    const note = {
      id: Date.now(),
      lastUpdated: Date.now(),
      color: createNoteButton.getAttribute("color"),
      title: "",
      content: "",
    };

    createNoteButton.setAttribute("color", getRandomColor());

    setNote(note);
    createNoteElement(note);
  },
  openDeleteMenu: (note) => {
    showMenuController(note, { deleteMenu: true });
    toggleNoteContenteditable(note);
  },
  closeDeleteMenu: (note) => {
    hideMenuController(note, { deleteMenu: true });
    note.addEventListener(
      "animationend",
      () => {
        hideMenuController(note, {});
        showMenuController(note, {});
        toggleNoteContenteditable(note);
      },
      { once: true }
    );
  },
  deleteNote: (note) => {
    unsetNote(note.id);
    document.getElementById(note.id).remove();
  },
  openColorsMenu: (note) => {
    showMenuController(note, { colorMenu: true });
    toggleNoteContenteditable(note);
  },
  closeColorsMenu: (note) => {
    hideMenuController(note, { colorMenu: true });
    note.addEventListener(
      "animationend",
      () => {
        hideMenuController(note, {});
        showMenuController(note, {});
        toggleNoteContenteditable(note);
      },
      { once: true }
    );
  },
  updateNoteColor: (note, button) => {
    let color = button.getAttribute("color");
    let uNote = getNote(note.id);

    uNote.color = color;
    updateNote(uNote);
    note.setAttribute("color", color);
  },
};

// EventListeners

getNotes().forEach((note) => createNoteElement(note));

createNoteButton.onclick = () => actions.createNote();

noteContainer.onclick = (e) => {
  const note = e.target.closest("li");
  const button = e.target.closest("button");

  if (button && button.hasAttribute("action")) {
    let action = button.getAttribute("action");

    if (actions[action]) {
      actions[action](note, button);
    }
  }

  const notes = document.querySelectorAll("[show-delete-menu], [show-color-menu]");

  notes.forEach((iNote) => {
    if (iNote && iNote !== e.target.closest("li")) {
      if (iNote.hasAttribute("show-color-menu")) {
        actions.closeColorsMenu(iNote);
      } else {
        actions.closeDeleteMenu(iNote);
      }
    }
  });
};

noteContainer.addEventListener("input", debounce(updateNoteContent, 400));

// functions to manage localStorage

function getNotes() {
  if (localStorage.getItem("note-notes")) {
    return JSON.parse(localStorage.getItem("note-notes"));
  }
  return [];
}

function setNotes(notes) {
  localStorage.setItem("note-notes", JSON.stringify(notes));
}

function getNote(id) {
  return getNotes().find((note) => note.id == id);
}

function setNote(note) {
  let notes = getNotes();
  notes.push(note);
  setNotes(notes);
}

function unsetNote(id) {
  setNotes(getNotes().filter((note) => note.id != id));
}

function updateNote(uNote) {
  let notes = getNotes();
  let index = notes.findIndex((note) => note.id == uNote.id);

  if (index !== -1) {
    notes[index] = { ...notes[index], ...uNote };
  }

  setNotes(notes);
}

// functions to manage notes

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function showMenuController(note, { colorMenu = false, deleteMenu = false }) {
  note.toggleAttribute("show-color-menu", colorMenu);
  note.toggleAttribute("show-delete-menu", deleteMenu);
}

function hideMenuController(note, { colorMenu = false, deleteMenu = false }) {
  note.toggleAttribute("hide-color-menu", colorMenu);
  note.toggleAttribute("hide-delete-menu", deleteMenu);
}

function toggleNoteContenteditable(note) {
  note.querySelector("h1").toggleAttribute("contenteditable");
  note.querySelector("p").toggleAttribute("contenteditable");
}

function updateNoteContent(event) {
  if (event.target.tagName !== "H1" && event.target.tagName !== "P") {
    return;
  }

  let target = event.target.closest("li");
  let content = event.target.innerText;
  let tag = event.target.tagName === "H1" ? "title" : "content";
  const note = getNote(target.id);

  toggleUpdateStage(target, { spin: true });

  note[tag] = content;
  note.lastUpdated = Date.now();

  setTimeout(() => {
    updateNote(note);
    target.querySelector("h2").innerHTML = convertTimestampToStringDate(note.lastUpdated);
    toggleUpdateStage(target, { check: true });
  }, 600);

  setTimeout(() => {
    toggleUpdateStage(target, {});
  }, 1100);
}

function toggleUpdateStage(note, { spin = false, check = false }) {
  note.querySelector("#spinner").style.display = spin ? "inline" : "none";
  note.querySelector("#updated").style.display = check ? "inline" : "none";
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function convertTimestampToStringDate(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 2 * 60 * 60 * 1000) {
    // less than 2 hours
    return (
      "Última edição <b>" +
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      "</b>"
    );
  } else if (diff < 24 * 60 * 60 * 1000) {
    // less than 1 day
    return "Última edição <b>Hoje</b>";
  } else if (diff < 2 * 24 * 60 * 60 * 1000) {
    // less than 2 days
    return "Última edição <b>Ontem</b>";
  } else if (diff >= 7 * 24 * 60 * 60 * 1000 && diff < 30 * 24 * 60 * 60 * 1000) {
    // more than 1 week and less than 1 month
    return "Última edição <b>mais de uma semana</b>";
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    // less than 1 week
    return `Última edição <b>${Math.floor(diff / (24 * 60 * 60 * 1000))} dias</b>`;
  } else {
    // more than 1 month
    return "Última edição <b>mais de 1 mês</b>";
  }
}

function createNoteElement(note) {
  let element = `
  <li id="${note.id}" color="${note.color}">
    <h1 contenteditable>${note.title}</h1>
    <h2>${convertTimestampToStringDate(note.lastUpdated)}</h2>
    <hr />
    <p contenteditable>${note.content}</p>
    <div class="card-options">
      <div id="spinner">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="none">
          <path
            d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div id="updated">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="none">
          <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
            fill="currentColor"
          />
        </svg>
      </div>
      <button class="pulse" action="openColorsMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="none">
          <path
            d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button class="shake" action="openDeleteMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512" fill="none">
          <path
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <div class="delete-menu">
      <h3>excluir nota?</h3>
      <button action="deleteNote">Sim</button>
      <button action="closeDeleteMenu">Não</button>
    </div>
    <div class="colors-menu">
      <div></div>
      <button class="close" action="closeColorsMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512" fill="none">
          <path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button action="updateNoteColor" color="pink" class="option"></button>
      <button action="updateNoteColor" color="lime" class="option"></button>
      <button action="updateNoteColor" color="purple" class="option"></button>
      <button action="updateNoteColor" color="beige" class="option"></button>
      <button action="updateNoteColor" color="blue" class="option"></button>
      <button action="updateNoteColor" color="orange" class="option"></button>
      <button action="updateNoteColor" color="green" class="option"></button>
      <button action="updateNoteColor" color="yellow" class="option"></button>
    </div>
  </li>`;

  noteContainer.insertAdjacentHTML("beforeend", element);
}
