import { useEffect, useState } from "react";

function App() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [color, setColor] = useState("bg-yellow-100");

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");

    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [showArchive, setShowArchive] = useState(false);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);


  function handleSubmit(event) {

    event.preventDefault();

    if (content.trim() === "") {
      alert("Please write something");
      return;
    }

    if (editId !== null) {

      const updatedNotes = notes.map((note) => {

        if (note.id === editId) {
          return {
            ...note,
            title: title,
            content: content,
            color: color
          };
        }

        return note;
      });

      setNotes(updatedNotes);
      setEditId(null);

    }

    else {

      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        color: color,
        archived: false,
        date: new Date().toLocaleDateString()
      };

      setNotes([newNote, ...notes]);
    }

   
    setTitle("");
    setContent("");
    setColor("bg-yellow-100");
  }

  function editNote(note) {

    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setEditId(note.id);
  }


  function deleteNote(id) {

    const remainingNotes = notes.filter(
      (note) => note.id !== id
    );

    setNotes(remainingNotes);
  }

  function archiveNote(id) {

    const updatedNotes = notes.map((note) => {

      if (note.id === id) {
        return {
          ...note,
          archived: !note.archived
        };
      }

      return note;
    });

    setNotes(updatedNotes);
  }

  function cancelEdit() {

    setEditId(null);
    setTitle("");
    setContent("");
    setColor("bg-yellow-100");
  }

  let displayedNotes = notes.filter((note) => {

    const text =
      note.title.toLowerCase() +
      note.content.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      note.archived === showArchive
    );
  });

  if (sort === "oldest") {
    displayedNotes = [...displayedNotes].reverse();
  }


  return (

  <div className="min-h-screen bg-gray-100 p-5">

   <div className="max-w-5xl mx-auto">

    <h1 className="text-3xl font-bold mb-5">
      Notes App
    </h1>

    <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg"
    >

    <input
       type="text"
       placeholder="Title"
       value={title}
       maxLength={100}
       onChange={(event) =>
       setTitle(event.target.value)
    }
       className="w-full border p-2 rounded"
    />


    <textarea
       placeholder="Write your note..."
       value={content}
        onChange={(event) =>
        setContent(event.target.value)
      }
        className="w-full border p-2 rounded mt-3 h-28"
      />

      <div className="flex gap-2 mt-3">

      <button
          type="button"
          onClick={() => setColor("bg-yellow-100")}
          className="w-7 h-7 rounded-full bg-yellow-100 border"
        />

        <button
          type="button"
          onClick={() => setColor("bg-pink-100")}
          className="w-7 h-7 rounded-full bg-pink-100 border"
        />

        <button
          type="button"
          onClick={() => setColor("bg-blue-100")}
          className="w-7 h-7 rounded-full bg-blue-100 border"
        />

        <button
           type="button"
           onClick={() => setColor("bg-green-100")}
          className="w-7 h-7 rounded-full bg-green-100 border"
        />

      </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {editId !== null ? "Update" : "Add Note"}
        </button>

        {editId !== null && (

          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded mt-4 ml-2"
        >
          Cancel
        </button>
        )}

      </form>
      
      <input
      type="text"
      placeholder="Search notes..."
      value={search}
      onChange={(event) =>
      setSearch(event.target.value)
      }
      className="w-full border p-2 rounded mt-5"
    />

      <div className="flex gap-3 mt-3">

      <select
      value={sort}
      onChange={(event) =>
      setSort(event.target.value)
     }
       className="border p-2 rounded"
      >
       <option value="newest">
           Newest
        </option>

        <option value="oldest">
           Oldest
         </option>

    </select>

     <button
         onClick={() => setShowArchive(!showArchive)}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        {showArchive ? "View Notes" : "View Archive"}
       </button>

    </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

      {displayedNotes.map((note) => (

        <div
         key={note.id}
        className={`p-5 rounded-lg ${note.color}`}
      >
        <h2 className="text-xl font-bold">
         {note.title || "Untitled"}
        </h2>

        <p className="mt-2">
           {note.content}
        </p>

          <p className="text-sm text-gray-500 mt-3">
            Created: {note.date}
          </p>

      <div className="flex gap-2 mt-4">

          <button
          onClick={() => editNote(note)}
           className="bg-blue-500 text-white px-3 py-1 rounded"
        >
           Edit
        </button>

          <button
            onClick={() => archiveNote(note.id)}
            className="bg-gray-700 text-white px-3 py-1 rounded"
         >
            {note.archived ? "Unarchive" : "Archive"}
          </button>

          <button
             onClick={() => deleteNote(note.id)}
             className="bg-red-500 text-white px-3 py-1 rounded"
            >
             Delete
          </button>

    </div>

    </div>

      ))}

    </div>

    </div>

    </div>
  );
}

export default App;