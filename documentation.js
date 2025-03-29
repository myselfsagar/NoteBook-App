/**
 * Notebook App Documentation
 * ---------------------------
 * This file contains documentation for the Notebook App.
 * The application allows users to create, search, and manage notes with a CRUD backend.
 * Axios is used to interact with a CRUD API endpoint.
 */

// CRUD API base URL
const API_BASE_URL =
  "https://crudcrud.com/api/e53918ece15b4c00b37491f647ae83b6/notes";

// DOM elements
const notesContainer = document.getElementById("notes"); // Container for notes
const totalNotesSpan = document.getElementById("total-notes"); // Total notes counter
const showingNotesSpan = document.getElementById("showing-notes"); // Showing notes counter

// Local state for notes
let notes = [];

/**
 * Updates the counters displayed in the UI.
 * @param {number} totalNotes - Total number of notes.
 * @param {number} showingNotes - Number of notes currently being displayed.
 */
function updateCounters(totalNotes, showingNotes) {
  totalNotesSpan.textContent = `Total Notes: ${totalNotes}`;
  showingNotesSpan.textContent = `Showing: ${showingNotes}`;
}

/**
 * Deletes a note from the backend and updates the UI.
 * @param {string} id - Unique identifier of the note.
 * @param {HTMLElement} noteElement - HTML element corresponding to the note.
 */
async function deleteNote(id, noteElement) {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    notes = notes.filter((note) => note._id !== id);
    noteElement.remove(); // Remove the note from the DOM
    updateCounters(notes.length, notesContainer.childElementCount);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

/**
 * Adds a note element to the DOM.
 * @param {Object} note - Note object containing title and description.
 */
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

/**
 * Fetches notes from the backend and updates the UI.
 */
async function fetchNotes() {
  try {
    const response = await axios.get(API_BASE_URL);
    notes = response.data;

    notesContainer.innerHTML = ""; // Clear the current notes
    notes.forEach((note) => appendNoteToDOM(note)); // Add all notes to the DOM
    updateCounters(notes.length, notes.length);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

/**
 * Filters notes based on a search query and updates the UI.
 */
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
      note.style.display = ""; // Show the note
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

/**
 * Adds a new note to the backend and UI.
 */
async function addNote() {
  const title = document.getElementById("note-title").value;
  const desc = document.getElementById("note-description").value;

  if (title && desc) {
    const newNote = { title, description: desc };

    try {
      const response = await axios.post(API_BASE_URL, newNote);
      notes.push(response.data);
      appendNoteToDOM(response.data); // Add the new note to the DOM
      updateCounters(notes.length, notesContainer.childElementCount);

      // Clear the input fields
      document.getElementById("note-title").value = "";
      document.getElementById("note-description").value = "";
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }
}

// Event listeners for interactivity
document.getElementById("add-note").addEventListener("click", addNote); // Add note button
document.getElementById("search").addEventListener("input", searchNotes); // Search input

/**
 * Initializes the application by fetching notes on page load.
 */
document.addEventListener("DOMContentLoaded", fetchNotes);
