const noteContainer = document.getElementById("note-container");
const createNoteButton = document.getElementById("create-note-button");

const colors = ["pink", "lime", "purple", "beige", "blue", "orange", "green", "yellow"];

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
  const notes = getNotes();
  return notes.find((note) => note.id == id);
}

function setNote(note) {
  let notes = getNotes();

  notes.push(note);
  setNotes(notes);
}

function updateNote(updatedNote) {
  let notes = getNotes();
  let index = notes.findIndex((note) => note.id == updatedNote.id);

  if (index !== -1) {
    notes[index] = { ...notes[index], ...updatedNote };
  }

  setNotes(notes);
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function toggleTargetEditable(target) {
  target.querySelector("h1").toggleAttribute("contenteditable");
  target.querySelector("p").toggleAttribute("contenteditable");
}

function createNote() {
  const note = {
    id: Date.now(),
    lastUpdated: Date.now(),
    color: createNoteButton.getAttribute("color"),
    title: "",
    content: "",
  };

  setNote(note);
  createNoteElement(note);
  createNoteButton.setAttribute("color", getRandomColor());
}

function deleteNote(self) {
  const target = self.closest("li");
  let notes = getNotes();

  setNotes(notes.filter((note) => note.id != target.id));

  document.getElementById(target.id).remove();
}

function createNoteElement(note) {
  let noteElement = `
  <li id="${note.id}" color="${note.color}">
    <h1 contenteditable>${note.title}</h1>
    <h2>${checkTimestamp(note.lastUpdated)}</h2>
    <hr />
    <p contenteditable>${note.content}</p>
    <div class="card-options">
      <span class="update-popup">Nota Atualizada</span>
      <button class="pulse" onclick="openColorMenu(this)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button class="shake" onclick="openDeleteMenu(this)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 448 512"
          fill="none"
        >
          <path
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <div class="delete-menu">
      <h3>excluir nota?</h3>
      <button onclick="deleteNote(this)">Sim</button>
      <button onclick="closeDeleteMenu(this)">Não</button>
    </div>
    <div class="colors-menu">
      <div></div>
      <button class="close" onclick="closeColorMenu(this)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 384 512"
          fill="none"
        >
          <path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        onclick="updateNoteColor(this, 'pink')"
        class="option pink"
      ></button>
      <button
        onclick="updateNoteColor(this, 'lime')"
        class="option lime"
      ></button>
      <button
        onclick="updateNoteColor(this, 'purple')"
        class="option purple"
      ></button>
      <button
        onclick="updateNoteColor(this, 'beige')"
        class="option beige"
      ></button>
      <button
        onclick="updateNoteColor(this, 'blue')"
        class="option blue"
      ></button>
      <button
        onclick="updateNoteColor(this, 'orange')"
        class="option orange"
      ></button>
      <button
        onclick="updateNoteColor(this, 'green')"
        class="option green"
      ></button>
      <button
        onclick="updateNoteColor(this, 'yellow')"
        class="option yellow"
      ></button>
    </div>
  </li>`;

  noteContainer.insertAdjacentHTML("beforeend", noteElement);
}

function checkTimestamp(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 2 * 60 * 60 * 1000) {
    // Menos de 2 horas
    return (
      "Última edição <b>" +
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      "</b>"
    );
  } else if (diff < 24 * 60 * 60 * 1000) {
    // Menos de 1 dia
    return "Última edição <b>Hoje</b>";
  } else if (diff < 2 * 24 * 60 * 60 * 1000) {
    // Menos de 2 dias
    return "Última edição <b>Ontem</b>";
  } else if (diff >= 7 * 24 * 60 * 60 * 1000 && diff < 30 * 24 * 60 * 60 * 1000) {
    // Mais de 1 semana e menos que 1 mês
    return "Última edição <b>mais de uma semana</b>";
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    // Menos de 1 semana
    return `Última edição <b>${Math.floor(diff / (24 * 60 * 60 * 1000))} dias</b>`;
  } else {
    // mais de 1 mês
    return "Última edição <b>mais de 1 mês</b>";
  }
}

function openColorMenu(self) {
  const target = self.closest("li");

  toggleTargetEditable(target);
  target.setAttribute("listen", "");
  target.setAttribute("show-colors", "");
}

function closeColorMenu(self) {
  const target = self.closest("li");

  target.setAttribute("close-colors", "");

  target.addEventListener(
    "animationend",
    () => {
      toggleTargetEditable(target);
      target.removeAttribute("listen", "");
      target.removeAttribute("show-colors", "");
      target.removeAttribute("close-colors", "");
    },
    { once: true }
  );
}

function updateNoteColor(self, color) {
  const target = self.closest("li");
  const note = getNote(target.id);

  color = colors.includes(color) ? color : getRandomColor();

  note.color = color;
  updateNote(note);
  target.setAttribute("color", color);
}

function openDeleteMenu(self) {
  const target = self.closest("li");

  toggleTargetEditable(target);
  target.setAttribute("listen", "");
  target.setAttribute("show-delete", "");
}

function closeDeleteMenu(self) {
  const target = self.closest("li");

  target.setAttribute("close-delete", "");

  target.addEventListener(
    "animationend",
    () => {
      toggleTargetEditable(target);
      target.removeAttribute("listen", "");
      target.removeAttribute("show-delete", "");
      target.removeAttribute("close-delete", "");
    },
    { once: true }
  );
}

function updateNoteContent(event) {
  if (event.target.tagName !== "H1" && event.target.tagName !== "P") {
    return;
  }

  let target = event.target.closest("li");
  let content = event.target.innerText;
  let tag = event.target.tagName === "H1" ? "title" : "content";
  const note = getNote(target.id);

  note[tag] = content;
  note.lastUpdated = Date.now();

  updateNote(note);
  target.querySelector("h2").innerHTML = checkTimestamp(note.lastUpdated);
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

createNoteButton.setAttribute("color", getRandomColor());

document.addEventListener("DOMContentLoaded", () => {
  getNotes().forEach((note) => createNoteElement(note));
});

noteContainer.addEventListener("input", debounce(updateNoteContent, 400));

noteContainer.addEventListener("click", (e) => {
  let notes = document.querySelectorAll("[listen]");

  notes.forEach((note) => {
    if (note && note !== e.target.closest("li")) {
      if (note.closest("li").hasAttribute("show-delete")) {
        closeDeleteMenu(note);
      }
      if (note.closest("li").hasAttribute("show-colors")) {
        closeColorMenu(note);
      }
    }
  });
});
