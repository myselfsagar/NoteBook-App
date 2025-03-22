const baseUrl =
  "https://crudcrud.com/api/6d5334e861c4472ea1f78de0b45e360b/notes";
const notesContainer = document.getElementById("notes");
const totalNotesSpan = document.getElementById("totalNotes");
const showingNotesSpan = document.getElementById("showingNotes");
let notes = [];

// Fetch notes from CRUD CRUD
async function fetchNotes() {
  try {
    const response = await axios.get(baseUrl);
    notes = response.data;
    displayNotes();
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
      displayNotes();
      document.getElementById("noteTitle").value = "";
      document.getElementById("noteDesc").value = "";
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
}

// Delete a note
async function deleteNote(id) {
  try {
    await axios.delete(`${baseUrl}/${id}`);
    notes = notes.filter((note) => note._id !== id);
    displayNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

// Search notes
function searchNotes() {
  const query = document.getElementById("search").value.toLowerCase();
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
  );
  displayNotes(filteredNotes);
}

// Display notes dynamically
function displayNotes(filteredNotes = notes) {
  notesContainer.innerHTML = "";
  filteredNotes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    const titleElement = document.createElement("div");
    titleElement.classList.add("note-title");
    titleElement.textContent = note.title;

    const descElement = document.createElement("p");
    descElement.textContent = note.description;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    deleteButton.onclick = () => deleteNote(note._id);

    noteElement.appendChild(titleElement);
    noteElement.appendChild(descElement);
    noteElement.appendChild(deleteButton);

    notesContainer.appendChild(noteElement);
  });

  // Update counters
  totalNotesSpan.textContent = `Total Notes: ${notes.length}`;
  showingNotesSpan.textContent = `Showing: ${filteredNotes.length}`;
}

// Event listeners
document.getElementById("addNote").addEventListener("click", addNote);
document.getElementById("search").addEventListener("input", searchNotes);

// Initial fetch
fetchNotes();
