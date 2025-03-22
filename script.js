const baseUrl = "https://crudcrud.com/api/YOUR_UNIQUE_ENDPOINT/notes"; // Replace with your CRUD CRUD unique endpoint
const notesContainer = document.getElementById("notes");
const totalNotesSpan = document.getElementById("totalNotes");
const showingNotesSpan = document.getElementById("showingNotes");
let notes = [];

// Utility function to update counters
function updateCounters(totalNotes, showingNotes) {
  totalNotesSpan.textContent = `Total Notes: ${totalNotes}`;
  showingNotesSpan.textContent = `Showing: ${showingNotes}`;
}

// Utility function to append a note to the DOM
function appendNoteToDOM(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.setAttribute("data-id", note._id);

  const titleElement = document.createElement("div");
  titleElement.classList.add("note-title");
  titleElement.textContent = note.title;

  const descElement = document.createElement("p");
  descElement.textContent = note.description;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "DELETE";
  deleteButton.onclick = () => deleteNote(note._id, noteElement);

  noteElement.appendChild(titleElement);
  noteElement.appendChild(descElement);
  noteElement.appendChild(deleteButton);

  notesContainer.appendChild(noteElement);
}

// Fetch notes from CRUD CRUD
async function fetchNotes() {
  try {
    const response = await axios.get(baseUrl);
    notes = response.data;

    notesContainer.innerHTML = ""; // Clear the current notes
    notes.forEach((note) => appendNoteToDOM(note)); // Add all notes to the DOM
    updateCounters(notes.length, notes.length);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

// Add a new note
async function addNote() {
  const title = document.getElementById("noteTitle").value;
  const desc = document.getElementById("noteDesc").value;

  if (title && desc) {
    const newNote = { title, description: desc };

    try {
      const response = await axios.post(baseUrl, newNote);
      notes.push(response.data);
      appendNoteToDOM(response.data); // Add the new note to the DOM
      updateCounters(notes.length, notesContainer.childElementCount);

      // Clear the input fields
      document.getElementById("noteTitle").value = "";
      document.getElementById("noteDesc").value = "";
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
}

// Delete a note
async function deleteNote(id, noteElement) {
  try {
    await axios.delete(`${baseUrl}/${id}`);
    notes = notes.filter((note) => note._id !== id);
    noteElement.remove(); // Remove the note from the DOM
    updateCounters(notes.length, notesContainer.childElementCount);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

// Search notes dynamically
function searchNotes() {
  const query = document.getElementById("search").value.toLowerCase();

  // Get all note elements
  const allNotes = document.querySelectorAll(".note");

  allNotes.forEach((note) => {
    const noteTitle = note
      .querySelector(".note-title")
      .textContent.toLowerCase();
    const noteDescription = note.querySelector("p").textContent.toLowerCase();

    if (noteTitle.includes(query) || noteDescription.includes(query)) {
      note.style.display = ""; // Keep default style
    } else {
      note.style.display = "none"; // Hide the note
    }
  });

  // Update "Showing" counter
  const showingCount = Array.from(allNotes).filter(
    (note) => note.style.display !== "none"
  ).length;
  showingNotesSpan.textContent = `Showing: ${showingCount}`;
}

// Event listeners
document.getElementById("addNote").addEventListener("click", addNote);
document.getElementById("search").addEventListener("input", searchNotes);

// Fetch notes on page load
fetchNotes();
